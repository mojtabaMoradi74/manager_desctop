import {useParams} from 'react-router-dom'
// @mui
import {Container} from '@mui/material'
// routes
import {routes} from '../../routes/paths'
// _mock_
import {_invoices} from '../../_mock'
// hooks
import useSettings from '../../hooks/useSettings'
// components
import Page from '../../components/Page'
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs'
// sections
import Invoice from '../../sections/@dashboard/invoice/details'

// ----------------------------------------------------------------------

export default function InvoiceDetails() {
  const {themeStretch} = useSettings()

  const {id} = useParams()

  const invoice = _invoices.find((invoice) => invoice.id === id)

  return (
    <Page title='Invoice: View'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Invoice Details'
          links={[
            {name: 'Dashboard', href: routes.root},
            {
              name: 'Invoices',
              href: routes.invoice.root,
            },
            {name: invoice?.invoiceNumber || ''},
          ]}
        />

        <Invoice invoice={invoice} />
      </Container>
    </Page>
  )
}
