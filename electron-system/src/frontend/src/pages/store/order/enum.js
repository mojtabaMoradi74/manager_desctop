import {t} from 'i18next'
import {travelTypeObject} from '../../../enumeration'
import {routes} from '../../../routes/paths'
import api from '../../../services/api'

const status = {
  awaiting_payment: {label: t('awaitingPayment'), value: 'awaiting_payment', bg: 'info'},
  completed: {label: t('completed'), value: 'completed'},
  // processing: {label: t('processing'), value: 'processing'},
  in_processing: {label: t('inProcessing'), value: 'in_processing'},
  ready: {label: t('ready'), value: 'ready'},
  posted: {label: t('posted'), value: 'posted'},
  canceled: {label: t('canceled'), value: 'canceled', bg: 'primary'},
  canceled_system: {label: t('canceledSystem'), value: 'canceled_system', bg: 'error'},
  received: {label: t('received'), value: 'received', bg: 'success'},
  returned: {label: t('returned'), value: 'returned', bg: 'error'},
}

const EOrder = {
  title: {
    name: ['order', 'orders'],
  },
  routes: routes.order,
  api: api.store.order,
  status: {
    object: status,
    array: Object.values(status),
  },
}

export default EOrder
