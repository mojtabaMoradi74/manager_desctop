import {t} from 'i18next'
import {travelTypeObject} from '../../../enumeration'
import {routes} from '../../../routes/paths'
import api from '../../../services/api'

const types = {
  wallet: {label: t('wallet'), value: 'wallet'},
  online: {label: t('online'), value: 'online'},
  paymentOnSite: {label: t('paymentOnSite'), value: 'paymentOnSite'},
  other: {label: t('default'), value: 'default'},
}

const EPaymentClass = {
  title: {
    name: ['payment', 'payments'],
  },
  routes: routes.paymentClass,
  api: api.paymentClass,
  types: {
    object: types,
    array: Object.values(types),
  },
}

export default EPaymentClass
