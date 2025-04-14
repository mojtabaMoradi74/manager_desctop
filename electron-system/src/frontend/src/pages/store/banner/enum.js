import {travelTypeObject} from '../../../enumeration'
import {routes} from '../../../routes/paths'
import api from '../../../services/api'

const TYPE_OBJECT = {
  default: {
    label: 'default',
    value: 'default',
  },
  slider: {
    label: 'slider',
    value: 'slider',
  },
  rowOne: {
    label: 'rowOne',
    value: 'rowOne',
  },
  rowTwo: {
    label: 'rowTwo',
    value: 'rowTwo',
  },
  rowThree: {
    label: 'rowThree',
    value: 'rowThree',
  },
}

const LINK_TYPE_OBJECT = {
  custom: {
    label: 'custom',
    value: 'custom',
  },
  product: {
    label: 'product',
    value: 'product',
  },
  category: {
    label: 'category',
    value: 'category',
  },
}

const EBanner = {
  title: {
    name: ['banner', 'banners'],
  },
  routes: routes.banner,
  api: api.store.banner,
  type: {
    object: TYPE_OBJECT,
    array: Object.values(TYPE_OBJECT),
  },
  linkType: {
    object: LINK_TYPE_OBJECT,
    array: Object.values(LINK_TYPE_OBJECT),
  },
}

export default EBanner
