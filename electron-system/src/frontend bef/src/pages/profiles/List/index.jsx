import {useTranslation} from 'react-i18next'
import {hasAccess} from 'src/permission/utiles'
import {Box, Button, Container, Modal} from '@mui/material'
import {useMemo} from 'react'
import {Link as RouterLink, useLocation, useNavigate, useParams} from 'react-router-dom'
import axiosInstance from '../../../utils/axios'
import {useQueryCustom} from '../../../utils/reactQueryHooks'
import useQueryString from '../../../utils/useQueryString'
import Enum from '../enum'
import Page from '../../../components/Page'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs'
import {routes} from '../../../routes/paths'
import useSettings from '../../../hooks/useSettings'
import Iconify from '../../../components/Iconify'
import TableComponent from '../../../components/table/TableComponent'
import {tableData} from './tableInfo'
import useTable from '../../../hooks/useTable'
import RoleSelector from '../../role/selector'
import RemoveNullObjectValue from '../../../utils/RemoveNullObjectValue'

const List = ({access}) => {
  const {t} = useTranslation()
  const queryParams = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const {role, ...queryString} = useQueryString()

  const checkAccess = useMemo(() => {
    return {
      update: hasAccess(access?.update),
      delete: hasAccess(access?.delete),
      create: hasAccess(access?.create),
      confirm: hasAccess(access?.confirm),
      read: hasAccess(access?.read),
    }
  }, [access])

  const roleValue = useMemo(() => {
    return role ? JSON.parse(role) : null
  }, [location])

  const getting = async () =>
    axiosInstance().get(`${Enum?.api?.base}`, {
      params: {
        ...queryString,
        travel_id: queryParams.travel,
        ...(roleValue && {role_id: roleValue?.value}),
      },
    })

  const {themeStretch} = useSettings()

  const tableSetting = useTable({queryString})
  console.log({tableSetting, queryParams, queryString})
  // ------------------------------------------------------- query Get
  const {
    data: {data = {}} = {},
    error,
    isError,
    isLoading,
    refetch,
    isFetching,
  } = useQueryCustom({
    name: `${Enum?.api?.base}_get_${queryParams.travel}`,
    url: getting,
    params: {...queryString},
    enabled: checkAccess?.read,
  })

  const title = `مدیریت ${Enum.title.name[1]} `
  const tableOptions = tableData({
    baseRoute: `${Enum.routes.root}`,
    disabled: checkAccess,
  })

  const changeUrl = (params) => ({
    pathname: location.pathname,
    search: new URLSearchParams(RemoveNullObjectValue({...queryString, ...params})).toString(),
  })
  const navigateUrl = (obj) => navigate(changeUrl(obj))

  const handleChangeRole = (param) => {
    navigateUrl({
      role: JSON.stringify({
        label: param?.data?.name || param?.label,
        value: param?.data?.id || param?.value,
      }),
    })
    console.log('* * * handleChangeRole : ', {param})
  }

  // console.log({ tableOptions, data, location, roleValue });

  return (
    <Page title={t(`${title}`)}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          // heading={title}
          headComponent={
            <RoleSelector.Element
              sx={{
                minWidth: '150px',
              }}
              staticForm
              label={'نقش ها'}
              onChange={handleChangeRole}
              value={roleValue}
              defaultValue={roleValue}
            />
          }
          links={[
            {name: 'داشبورد', href: Enum.routes.root},
            {name: title, href: Enum.routes.list},
            {name: 'لیست'},
          ]}
          // action={
          //   checkAccess?.create || true ? (
          //     <>
          //       <Button
          //         variant="contained"
          //         color={'success'}
          //         component={RouterLink}
          //         to={`${Enum.routes.root}${Enum.routes.add}`}
          //         startIcon={<Iconify icon={'eva:plus-fill'} />}
          //       >
          //         {'ایجاد ادمین جدید'}
          //       </Button>
          //     </>
          //   ) : (
          //     ''
          //   )
          // }
        />
        <TableComponent
          active={{
            // selectable: true,
            rowNumber: true,
          }}
          options={tableOptions}
          data={data?.data}
          tableSetting={tableSetting}
          pagination={{
            totalPage: data?.meta?.last_page,
            total: data?.meta?.total,
          }}
          loading={isLoading}
          isFetching={isFetching}
          refetch={refetch}
        />{' '}
      </Container>
    </Page>
  )
}

export default List
