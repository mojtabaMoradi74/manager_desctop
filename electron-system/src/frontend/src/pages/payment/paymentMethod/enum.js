import {travelTypeObject} from '../../../enumeration'
import {routes} from '../../../routes/paths'
import api from '../../../services/api'

const types = {
  wallet: {label: 'wallet', value: 'wallet'},
  online: {label: 'online', value: 'online'},
}

const EPaymentMethod = {
  title: {
    name: ['PaymentMethod', 'PaymentMethods'],
  },
  routes: routes.paymentMethod,
  api: api.paymentMethod,
  types: {
    object: types,
    array: Object.values(types),
  },
}

export default EPaymentMethod
