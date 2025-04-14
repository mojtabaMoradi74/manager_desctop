import {travelTypeObject} from '../../../enumeration'
import {routes} from '../../../routes/paths'
import api from '../../../services/api'

const types = {
  post: {
    label: 'post',
    value: 'post',
    color: 'success',
  },
  tipax: {
    label: 'tipax',
    value: 'tipax',
    color: 'info',
  },
  courier: {
    label: 'courier',
    value: 'courier',
    color: 'warning',
  },
  freight: {
    label: 'freight',
    value: 'freight',
    color: 'danger',
  },
}

const usageTypes = {
  independentAll: {
    label: 'Only include selected provinces',
    value: 'independentAll',
  },
  independentPrice: {
    label: 'Include all provinces and only take prices from selected provinces',
    value: 'independentPrice',
  },
}

const EShippingMethod = {
  title: {
    name: ['shippingMethod', 'shippingMethods'],
  },
  routes: routes.shippingMethod,
  api: api.shippingMethod,
  types: {
    array: Object.values(types),
    object: types,
  },
  usageTypes: {
    array: Object.values(usageTypes),
    object: usageTypes,
  },
}

export default EShippingMethod
