import {useMemo} from 'react'
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
import Layout from '../../Layout'

const List = () => {
  const {t} = useTranslation()
  const queryParams = useParams()
  const queryString = useQueryString()

  const getting = async () => axiosInstance().get(`${Enum?.api?.base}`, {params: {...queryString}})

  const {themeStretch} = useSettings()

  const tableSetting = useTable({queryString})
  console.log({tableSetting, queryParams})
  // ------------------------------------------------------- query Get
  const {
    data: {data = {}} = {},
    error,
    isError,
    isLoading,
    refetch,
    isFetching,
  } = useQueryCustom({
    name: `${Enum?.api?.base}_get_${queryParams.id}`,
    url: getting,
    params: {...queryString},
  })

  console.log({data})

  return <Layout>{'123'}</Layout>
}

export default List
