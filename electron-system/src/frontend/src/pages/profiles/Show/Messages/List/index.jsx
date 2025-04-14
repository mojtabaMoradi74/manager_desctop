import {useTranslation} from 'react-i18next'
import {Box, Button, Container, Modal} from '@mui/material'
import {Link as RouterLink, useNavigate, useParams} from 'react-router-dom'
import axiosInstance from '../../../../../utils/axios'
import {useQueryCustom} from '../../../../../utils/reactQueryHooks'
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
import ShowCaravansManagementLayout from '../../Layout'

const Message = () => {
  const {t} = useTranslation()
  const queryParams = useParams()
  const queryString = useQueryString()
  const paramId = queryParams?.id

  const {themeStretch} = useSettings()

  const tableSetting = useTable({queryString})
  console.log({tableSetting, queryParams})
  // ------------------------------------------------------- query Get

  const getById = () => axiosInstance().get(`${Enum?.api?.base}/${paramId}`)

  const teamById = useQueryCustom({
    name: `get_by_Id_${Enum?.api?.base}_${paramId}`,
    url: getById,
    enabled: !!paramId,
  })

  const getting = async () => {}
  // axiosInstance().get(`${Enum.api.message}`, { params: { ...queryString, team_id: queryParams.id } });

  const {
    data: {data = {}} = {},
    error,
    isError,
    isLoading,
    refetch,
    isFetching,
  } = useQueryCustom({
    name: `${Enum.api.message}_get_${queryParams.id}`,
    url: getting,
    params: {...queryString},
  })

  const tableOptions = tableData({
    baseRoute: `${Enum.routes.root}`,
  })

  console.log({teamById, data})

  return (
    <ShowCaravansManagementLayout>
      <TableComponent
        active={{
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
      />
    </ShowCaravansManagementLayout>
  )
}

export default Message
