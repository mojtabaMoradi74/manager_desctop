import {cloneElement, isValidElement, useEffect, useMemo} from 'react'
import {Box, Container, Typography, Button} from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'

import {Link, NavLink, useLocation, useNavigate, useParams, useSearchParams} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import Enum from '../enum'
import Page from '../../../components/Page'
import Iconify from '../../../components/Iconify'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs'
import useSettings from '../../../hooks/useSettings'
import axiosInstance from '../../../utils/axios'
import {useQueryCustom} from '../../../utils/reactQueryHooks'
import WaitingBox from '../../../components/WaitingBox/index'
import useQueryString from '../../../utils/useQueryString'
import AgentComponent from './Agent/List'
import ClientComponent from './Client/List'
import SocialComponent from './Social'

const ProfileManagementLayout = ({children}) => {
  const {t} = useTranslation()
  const queryParams = useParams()
  const queryString = useQueryString()
  const location = useLocation()
  const {themeStretch} = useSettings()
  const backUrl = `${Enum.routes.root}`
  const paramId = queryParams?.id
  const currentBase = `${backUrl}/show/${paramId}`

  const getById = () => axiosInstance().get(`${Enum?.api?.base}/${paramId}`)

  const dataById = useQueryCustom({
    name: `get_by_Id_${Enum?.api?.base}_${paramId}`,
    url: getById,
    enabled: !!paramId,
  })

  const user = dataById?.data?.data

  console.log({dataById, location})
  const caravanTabType = Enum.enumTab.object
  const tab = [
    {
      ...caravanTabType.specification,
      // active: !queryParams.tab && true,
      side: (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            ml: 'auto',
          }}
        >
          <Button variant='outlined' color='success'>
            {'صدور کارت'}
          </Button>
        </Box>
      ),
    },
    {
      ...caravanTabType.access,
      // side: (
      //   <Box
      //     sx={{
      //       display: 'flex',
      //       alignItems: 'center',
      //       gap: 2,
      //       ml: 'auto',
      //     }}
      //   >
      //     <Button variant="grey">
      //       <PrintIcon
      //         sx={{
      //           cursor: 'pointer',
      //         }}
      //       />
      //     </Button>

      //     <Button variant="contained" color={'success'} startIcon={<Iconify icon={'eva:plus-fill'} />}>
      //       {'افزودن کابر'}
      //     </Button>
      //   </Box>
      // ),
    },
    {
      ...caravanTabType.nezam,
      active: false,
    },
    {
      ...caravanTabType.bank,
      active: false,
      // side: (
      //   <Box
      //     sx={{
      //       display: 'flex',
      //       alignItems: 'center',
      //       gap: 2,
      //       ml: 'auto',
      //     }}
      //   >
      //     <Button variant="grey">
      //       <PrintIcon
      //         sx={{
      //           cursor: 'pointer',
      //         }}
      //       />
      //     </Button>

      //     <Button variant="contained" color={'success'} startIcon={<Iconify icon={'eva:plus-fill'} />}>
      //       {'افزودن کابر'}
      //     </Button>

      //     <Button variant="outlined" color="success">
      //       {'صدور کارت'}
      //     </Button>
      //   </Box>
      // ),
    },
    {
      ...caravanTabType.message,
      active: false,
      side: (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            ml: 'auto',
          }}
        >
          <Button variant='grey'>
            <PrintIcon
              sx={{
                cursor: 'pointer',
              }}
            />
          </Button>

          <Button
            variant='contained'
            color={'success'}
            startIcon={<Iconify icon={'eva:plus-fill'} />}
          >
            {'ارسال پیام'}
          </Button>
        </Box>
      ),
    },
  ]

  const selectedTab = useMemo(() => {
    return tab?.find((x) => queryParams.tab === x.value || x.active)
  }, [queryString])

  // useEffect(()=>{
  //   // if(!queryString.type)
  // },[])

  const title = ` ${dataById?.data?.data?.name || ''} ${dataById?.data?.data?.last_name || ''}`

  const appendedPropsToChildren = () => {
    if (isValidElement(children)) {
      return cloneElement(children, {
        user,
      })
    }
    return <>{children || ' '}</>
  }

  return dataById.isLoading ? (
    <WaitingBox />
  ) : (
    <Page title={t(`${title}`)}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          back={backUrl}
          links={[
            {name: 'داشبورد', href: Enum.routes.root},
            {name: title, href: Enum.routes.list},
            {name: 'لیست'},
          ]}
        />
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {tab?.map((x) => {
              return (
                <Link to={`${currentBase}/${x.value}`}>
                  <Typography
                    sx={{
                      color: 'grey.800',
                      p: 1,
                      borderBottom: '2px solid transparent',
                      fontWeight: '300',
                      fontSize: '13px',

                      ...(queryParams.tab === x.value
                        ? {
                            borderColor: 'grey.800',
                            fontWeight: '900',
                          }
                        : {
                            '&:hover': {
                              color: 'grey.600',
                            },
                          }),
                    }}
                  >
                    {x.label}
                  </Typography>
                </Link>
              )
            })}
          </Box>

          <Box
            sx={{
              ml: 'auto',
            }}
          >
            {selectedTab?.side}
          </Box>
        </Box>

        <Box
          sx={{
            mt: 3,
          }}
        >
          {/* {selectedTab?.component} */}

          {appendedPropsToChildren()}
        </Box>
      </Container>
    </Page>
  )
}

export default ProfileManagementLayout
