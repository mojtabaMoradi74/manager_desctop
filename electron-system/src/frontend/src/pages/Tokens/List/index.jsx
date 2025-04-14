import {useMemo} from 'react'
import {toast} from 'react-toastify'
import {useTranslation} from 'react-i18next'
import {Box, Button, Container, Modal} from '@mui/material'
import {Link as RouterLink, useNavigate, useParams} from 'react-router-dom'
import axiosInstance from '../../../utils/axios'
import {useMutationCustom, useQueryCustom} from '../../../utils/reactQueryHooks'
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
import {hasAccess} from '../../../permission/utiles'

const List = ({access}) => {
  const {t} = useTranslation()
  const queryParams = useParams()
  const queryString = useQueryString()

  // ---------------------------------------------------------------------
  const getApi = async () =>
    axiosInstance().get(`${Enum?.api?.base}`, {
      params: {...queryString},
    })

  const deleteApi = async ({id}) => axiosInstance().delete(`${Enum?.api?.base}/${id}`)
  // ---------------------------------------------------------------------
  const checkAccess = useMemo(() => {
    return {
      update: hasAccess(access?.update),
      delete: hasAccess(access?.delete),
      create: hasAccess(access?.create),
      confirm: hasAccess(access?.confirm),
      read: hasAccess(access?.read),
    }
  }, [access])
  const {themeStretch} = useSettings()

  const tableSetting = useTable({queryString})
  console.log({tableSetting, queryParams})
  // ------------------------------------------------------- query Get
  const {
    data: {data = {}} = {},
    isLoading,
    isFetching,
    refetch,
  } = useQueryCustom({
    name: `${Enum?.api?.base}_list`,
    url: getApi,
    params: {...queryString},
    enabled: checkAccess?.read,
  })
  // ------------------------------------------------------- query delete

  const deleteInput = useMutationCustom({
    url: deleteApi,
    name: `${Enum?.api?.base}_delete`,
    invalidQueries: [`${Enum?.api?.base}_list`],
    onSuccess: () => {
      toast.success(t('question.delete.successfully'))
    },
    onError: (error) => {
      console.log({error})
      const errorTitle = error.response.data.message || t('errorTryAgain')

      const errors = Object.values(error?.response?.data?.errors || {})
      if (errors?.length) {
        errors?.map((x) => {
          return toast.error(x?.[0])
        })
      } else toast.error(errorTitle)
    },
  })

  const title = t(`${Enum.title.name[1]}`)
  const tableOptions = useMemo(() => {
    return tableData({
      baseRoute: `${Enum.routes.root}`,
      onDelete: (x) => deleteInput.mutate({id: x?._id}),
      disabled: {
        update: !checkAccess.update,
        delete: !checkAccess.delete,
      },
    })
  }, [])

  console.log({tableOptions, data})

  return (
    <Page title={t(`${title}`)}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {name: t('dashboard'), href: Enum.routes.root},
            {name: title, href: Enum.routes.list},
            {name: t('list')},
          ]}
          action={
            checkAccess?.create ? (
              <>
                <Button
                  disabled
                  variant='contained'
                  color={'success'}
                  // component={RouterLink}
                  // to={`${Enum.routes.root}${Enum.routes.add}`}
                  startIcon={<Iconify icon={'eva:plus-fill'} />}
                >
                  {t('addAuthor', {author: t(Enum.title.name[0])})}
                </Button>
              </>
            ) : (
              ''
            )
          }
        />
        <TableComponent
          active={{
            // selectable: true,
            rowNumber: true,
          }}
          options={tableOptions}
          data={data?.data?.data}
          tableSetting={tableSetting}
          pagination={{
            // totalPage: data?.data?.last_page,
            total: data?.data?.total,
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
