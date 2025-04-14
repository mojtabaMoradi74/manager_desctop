import {travelTypeObject} from '../../../enumeration'
import {routes} from '../../../routes/paths'
import api from '../../../services/api'
import {t} from 'i18next'

const types = {
  1: {
    label: t('variableProduct'),
    value: 1,
    bg: 'primary',
  },
  2: {
    label: t('simpleProduct'),
    value: 2,
    bg: 'success',
  },
}

const EProduct = {
  title: {
    name: ['product', 'products'],
  },
  routes: routes.product,
  api: api.store.product,
  types: {
    array: Object.values(types),
    object: types,
  },
}

export default EProduct
