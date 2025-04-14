import {useEffect, useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Box,
  Button,
  Container,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
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
import api from '../../../../../services/api'
import addDataInObjectDepth from '../../../../../utils/addDataInObjectDepth'
import {RHFCheckbox} from '../../../../../components/hook-form/RHFCheckbox'
import Form from '../Add'

const List = () => {
  const {t} = useTranslation()
  const queryParams = useParams()
  const queryString = useQueryString()

  const getById = () => axiosInstance().get(`${Enum?.api?.base}/${queryParams?.id}`)

  const userById = useQueryCustom({
    name: `get_by_Id_${Enum?.api?.base}_${queryParams?.id}`,
    url: getById,
    enabled: !!queryParams?.id,
  })
  // /${userById?.data?.data?.role?.id}
  const getting = async () =>
    axiosInstance().get(`${api.role.base}/${userById?.data?.data?.role?.id}`)
  const getPermissions = async () => axiosInstance().get(`${api.permission.base}`)

  const {themeStretch} = useSettings()

  const tableSetting = useTable({queryString})
  console.log({tableSetting, queryParams, userById})
  // ------------------------------------------------------- query Get
  const roleData = useQueryCustom({
    name: `${api.role.base}_get_${queryParams.id}`,
    url: getting,
    enabled: !!userById?.data?.data?.role?.id,
  })

  // ------------------------------------------------------- query Get All Permission
  const allPermissions = useQueryCustom({
    name: `${api.permission.base}_get_${queryParams.id}`,
    url: getPermissions,
  })

  const permissions = useMemo(() => {
    const param = allPermissions?.data?.data
    const byType = {}
    for (const key in param) {
      if (Object.hasOwnProperty.call(param, key)) {
        const current = param[key]
        if (current.type) {
          //  addDataInObjectDepth(`${current.type}.${current.model}.${current.action}`, current, byType);
          addDataInObjectDepth(`${current.type}.${current.model}.label`, current.translate, byType)
          addDataInObjectDepth(
            `${current.type}.${current.model}.object.${current.action}`,
            current,
            byType
          )
        } else {
          // addDataInObjectDepth(`${current.model}.${current.action}`, current, byType);
          addDataInObjectDepth(`${current.model}.label`, current.translate, byType)
          addDataInObjectDepth(`${current.model}.object.${current.action}`, current, byType)
        }
      }
    }
    return byType
  }, [allPermissions])

  // useEffect(() => {
  //   roleData?.data?.data;
  // }, [roleData?.data?.data]);

  console.log({permissions, roleData, userById, allPermissions})

  return (
    <Layout>
      {/* {otherPermissions} */}
      <Box>
        <Form
          permissions={permissions}
          user={userById?.data?.data}
          roleData={roleData?.data}
          allPermissions={allPermissions}
          loading={roleData?.isFetching}
        />
      </Box>
    </Layout>
  )
}

export default List
