import {paramCase, capitalCase} from 'change-case'
import {useParams, useLocation} from 'react-router-dom'
// @mui
import {Container} from '@mui/material'
// routes
import {routes} from '../../../../routes/paths'
// hooks
import useSettings from '../../../../hooks/useSettings'
// _mock_
import {_userList} from '../../../../_mock'
// components
import Page from '../../../../components/Page'
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs'
// sections
import UserNewEditForm from '../../../../sections/@dashboard/user/UserNewEditForm'
import AdminNewEditForm from '../../../../sections/@dashboard/user copy/UserNewEditForm'

// ----------------------------------------------------------------------

export default function AdminCreate() {
  const {themeStretch} = useSettings()

  const {pathname} = useLocation()

  const {name = ''} = useParams()

  const isEdit = pathname.includes('edit')

  const currentUser = _userList.find((user) => paramCase(user.name) === name)

  return (
    <Page title='ساخت ادمین جدید'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'ساخت ادمین جدید' : 'Edit ادمین'}
          links={[
            {name: 'داشبورد', href: routes.root},
            {name: 'ادمین', href: routes.admin.list},
            {name: !isEdit ? 'ادمین جدید' : capitalCase(name)},
          ]}
        />

        <AdminNewEditForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  )
}
