// @mui
import {Container} from '@mui/material'
// routes
import {routes} from '../../routes/paths'
// hooks
import useSettings from '../../hooks/useSettings'
// components
import Page from '../../components/Page'
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs'
// sections
import InvoiceNewEditForm from '../../sections/@dashboard/invoice/new-edit-form'

// ----------------------------------------------------------------------

export default function InvoiceCreate() {
  const {themeStretch} = useSettings()

  return (
    <Page title='Invoices: Create a new invoice'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Create a new invoice'
          links={[
            {name: 'Dashboard', href: routes.root},
            {name: 'Invoices', href: routes.invoice.list},
            {name: 'New invoice'},
          ]}
        />

        <InvoiceNewEditForm />
      </Container>
    </Page>
  )
}
