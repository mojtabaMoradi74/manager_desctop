import {useTranslation} from 'react-i18next'
import {Box, Button, Container, Modal, Typography} from '@mui/material'
import {Link as RouterLink, useNavigate, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {LoadingButton} from '@mui/lab'
import axiosInstance from '../../../../../utils/axios'
import {useMutationCustom, useQueryCustom} from '../../../../../utils/reactQueryHooks'
import useQueryString from '../../../../../utils/useQueryString'
import Enum from '../../../enum'
import Page from '../../../../../components/Page'
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs'
import {routes} from '../../../../../routes/paths'
import useSettings from '../../../../../hooks/useSettings'
import Iconify from '../../../../../components/Iconify'
import TableComponent from '../../../../../components/table/TableComponent'
import {tableData} from './tableInfo'
import useTable from '../../../../../hooks/useTable'
import FiltersCaravanList from './Filters'
import api from '../../../../../services/api'
import validation from './Filters/validation'
import WaitingBox from '../../../../../components/WaitingBox/index'

const List = () => {
  const {t} = useTranslation()
  const queryParams = useParams()
  const queryString = useQueryString()
  const navigate = useNavigate()
  // ----------------------------------------------------------

  const getById = () => axiosInstance().get(`${Enum?.api?.base}/${queryParams.id}`)

  const caravanById = useQueryCustom({
    name: `get_by_Id_${Enum?.api?.base}_${queryParams.travel}_${queryParams.id}`,
    url: getById,
    enabled: !!queryParams.id,
  })

  const caravan = caravanById?.data?.data
  // ----------------------------------------------------------
  const backUrl = `${Enum.routes.root(queryParams.type, queryParams.travel)}/show/${
    queryParams.id
  }/${Enum.enumTab.object.client.value}`

  const getting = async () => {
    const province = queryString.province && JSON.parse(queryString.province || '')
    const city = queryString.city && JSON.parse(queryString.city || '')
    const university = queryString.university && JSON.parse(queryString.university || '')
    return axiosInstance().get(`${api.travelRegister.base}`, {
      params: {
        ...(province?.value && {[validation.fieldNames.province_id]: province.value}),
        ...(city?.value && {[validation.fieldNames.city_id]: city.value}),
        ...(university?.value && {[validation.fieldNames.university_id]: university.value}),
        ...(queryString.code_melli && {[validation.fieldNames.code_melli]: queryString.code_melli}),
        travel_id: queryParams.travel,
      },
    })
  }
  const {themeStretch} = useSettings()

  const tableSetting = useTable({queryString})
  console.log({tableSetting, queryParams, caravan})
  // ------------------------------------------------------- query Get
  const {
    data: {data = {}} = {},
    error,
    isError,
    isLoading,
    refetch,
    isFetching,
  } = useQueryCustom({
    name: `${Enum?.api?.base}_get_${queryParams.travel}_${queryParams.id}`,
    url: getting,
    params: {...queryString},
  })

  const creating = (params) => axiosInstance().post(Enum.api.client, params)
  // ------------------------------------------------------------------------------ Mutation
  const onSuccessMutating = () => {
    toast.success(t('successfully'))
    navigate(backUrl)
  }

  const onErrorMutating = (error) => {
    console.log('* * * onErrorMutating :', {error})
    const errorTitle = error.response.data.message || t('errorTryAgain')
    const errors = Object.values(error?.response?.data?.errors || {})
    if (errors?.length) {
      errors?.map((x) => {
        return toast.error(x?.[0])
      })
    } else toast.error(errorTitle)
  }

  const mutateAdd = useMutationCustom({
    url: creating,
    name: `${Enum?.api?.base}_update`,
    invalidQuery: `${Enum?.api?.base}_get`,
    onSuccess: onSuccessMutating,
    onError: onErrorMutating,
  })

  const onSubmit = async () => {
    console.log('* * * onSubmit : ', {tableSetting})

    const reqData = {
      team_id: queryParams.id,
    }
    tableSetting?.selected?.forEach((x, i) => {
      reqData[`clients[${i}][id]`] = x
    })

    const formData = new FormData()
    Object.keys(reqData || {})?.map((x) => {
      formData.append(x, reqData[x])
    })
    // if (paramId) {
    //   formData.append('_method', 'put');
    // }

    console.log('* * * onSubmit : ', {reqData, tableSetting})
    mutateAdd.mutate(formData)
  }

  const title = `افزودن زائر ${caravan?.id || ''} - ${caravan?.province?.name || ''} `
  const tableOptions = tableData({
    baseRoute: `${Enum.routes.root(queryParams.type, queryParams.travel)}`,
  })

  console.log({tableOptions, data})

  return caravanById.isLoading ? (
    <WaitingBox />
  ) : (
    <Page title={t(`${title}`)}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          back={backUrl}
          links={[
            {name: 'داشبورد', href: Enum.routes.root(queryParams.type, queryParams.travel)},
            {name: title, href: Enum.routes.list},
            {name: 'لیست'},
          ]}
        />
        <FiltersCaravanList />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            px: 2,
            py: 1,
            backgroundColor: 'background.neutral',
            borderRadius: '8px',
          }}
        >
          <Typography>{'نتایج جستجو'}</Typography>
        </Box>
        <TableComponent
          active={{
            selectable: true,
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

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          backgroundColor: 'background.neutral',
          borderRadius: '8px',
          borderTop: '1px solid',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: '13px',
              }}
            >
              {'ظرفیت کاروان :'}
            </Typography>
            <Typography>{caravan?.storage_max}</Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: '13px',
              }}
            >
              {'تعداد تکمیل شد : '}
            </Typography>
            <Typography>{'0'}</Typography>
          </Box>
        </Box>

        <Box>
          {' '}
          <LoadingButton
            disabled={!tableSetting?.selected?.length}
            loading={mutateAdd?.isLoading}
            variant='contained'
            color={'success'}
            startIcon={<Iconify icon={'eva:plus-fill'} />}
            onClick={onSubmit}
          >
            {`افزودن به کاروان`}
          </LoadingButton>
        </Box>
      </Box>
    </Page>
  )
}

export default List
