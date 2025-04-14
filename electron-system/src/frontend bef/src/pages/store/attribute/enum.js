import {routes} from '../../../routes/paths'
import api from '../../../services/api'

const typeObject = {
  default: {
    label: 'default',
    value: 'default',
    bg: 'secondary',
  },
  color: {
    label: 'color',
    value: 'color',
    bg: 'success',
  },
  button: {
    label: 'button',
    value: 'button',
    bg: 'info',
  },
  image: {
    label: 'image',
    value: 'image',
    bg: 'warning',
  },
}

const EAttributes = {
  title: {
    name: ['attribute', 'attribute'],
  },
  routes: routes.attribute,
  api: api.store.attribute,
  types: {
    array: Object.values(typeObject),
    object: typeObject,
  },
}

export default EAttributes
