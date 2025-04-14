import {useParams} from 'react-router-dom'
// @mui
import {Container} from '@mui/material'
// routes
import {routes} from '../../routes/paths'
// hooks
import useSettings from '../../hooks/useSettings'
// _mock_
import {_invoices} from '../../_mock'
// components
import Page from '../../components/Page'
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs'
// sections
import InvoiceNewEditForm from '../../sections/@dashboard/invoice/new-edit-form'

// ----------------------------------------------------------------------

export default function InvoiceEdit() {
  const {themeStretch} = useSettings()

  const {id} = useParams()

  const currentInvoice = _invoices.find((invoice) => invoice.id === id)

  return (
    <Page title='Invoices: Edit'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Edit invoice'
          links={[
            {name: 'Dashboard', href: routes.root},
            {name: 'Invoices', href: routes.invoice.list},
            {name: currentInvoice?.invoiceNumber || ''},
          ]}
        />

        <InvoiceNewEditForm isEdit currentInvoice={currentInvoice} />
      </Container>
    </Page>
  )
}
