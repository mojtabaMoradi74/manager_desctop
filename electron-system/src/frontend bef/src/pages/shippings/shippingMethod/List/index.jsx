import {useMemo} from 'react'
import {toast} from 'react-toastify'
import {useTranslation} from 'react-i18next'
import {Button, Container} from '@mui/material'
import {Link as RouterLink, useParams} from 'react-router-dom'
import axiosInstance from '../../../../utils/axios'
import {useMutationCustom, useQueryCustom} from '../../../../utils/reactQueryHooks'
import useQueryString from '../../../../utils/useQueryString'
import Enum from '../enum'
import Page from '../../../../components/Page'
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs'
import useSettings from '../../../../hooks/useSettings'
import Iconify from '../../../../components/Iconify'
import TableComponent from '../../../../components/table/TableComponent'
import {tableData} from './tableInfo'
import useTable from '../../../../hooks/useTable'
import {hasAccess} from '../../../../permission/utiles'
import {useSelector} from 'react-redux'
import QuestionComponent from 'src/components/modal/Question'

const List = ({access}) => {
  const {t} = useTranslation()
  const queryParams = useParams()
  const queryString = useQueryString()
  const title = t(`${Enum.title.name[1]}`)
  const modal = useSelector((state) => state.modal.data)
  console.log({modal})
  // ---------------------------------------------------------------------
  const getApi = async () =>
    axiosInstance().get(`${Enum.api.base}`, {
      params: {...queryString},
    })

  const deleteApi = async ({id}) => axiosInstance().delete(`${Enum.api.base}/${id}`)
  const changeStatus = async (params) => axiosInstance().put(Enum.api.changeStatus, params)
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
    name: `${Enum.api.base}_list`,
    url: getApi,
    params: {...queryString},
    enabled: checkAccess?.read,
  })

  // ------------------------------------------------------- query Change status
  const onSuccessChangeStatusMutation = () => {
    modal.hide()
    toast.success(t('success'))
  }
  const changeStatusMutation = useMutationCustom({
    name: `${Enum.api.base}_changeStatus`,
    url: changeStatus,
    invalidQuery: `${Enum.api.base}_list`,
    onSuccess: onSuccessChangeStatusMutation,
    onError: () => modal.hide(),
  })
  // ---------------------------------------------- action click table

  const actionsOperation = ({data, status}) => {
    modal.show(
      <QuestionComponent
        {...{
          title: t('are you sure'),
          description: t('You want to status this title', {
            status: status?.label?.toLowerCase(),
            title,
          }),
          button: {
            confirm: {
              label: 'question.accept',
              loading: changeStatusMutation?.isLoading,
              onClick: () => {
                changeStatusMutation.mutate({data, status: status.value})
              },
              color: status.bg,
            },
            reject: {
              label: 'question.no',
              disabled: changeStatusMutation?.isLoading,
              onClick: () => {
                console.log({modalIsOpen: modal.isOpen()})
                modal.hide()
              },
            },
          },
        }}
      />
    )
  }
  // swal({
  //   title: t('are you sure'),
  //   text: t('You want to status this title', {status: status?.label?.toLowerCase(), title}),
  //   icon: 'warning',
  //   buttons: true,
  //   dangerMode: true,
  // }).then((willBe) => {
  //   if (willBe) {
  //     changeStatusMutation.mutate({data, status: status.value})
  //   }
  // })
  const clickAction = ({data, status}) => {
    const newData = data.map((x) => x.id)
    // if (status?.needQuestion)
    actionsOperation({data: newData, status})
  }

  const tableOptions = useMemo(() => {
    return tableData({
      baseRoute: `${Enum.routes.root}`,
      onClick: clickAction,
      active: {
        update: checkAccess.update,
        delete: checkAccess.delete,
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
                  variant='contained'
                  color={'success'}
                  component={RouterLink}
                  to={`${Enum.routes.root}${Enum.routes.add}`}
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
          data={data?.result}
          tableSetting={tableSetting}
          pagination={{
            // totalPage: data?.data?.last_page,
            total: data?.count,
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
