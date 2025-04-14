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

const EAttributeValues = {
  title: {
    name: ['attributeValue', 'attributeValue'],
  },
  routes: routes.attributeValue,
  api: api.store.attributeValue,
  types: {
    array: Object.values(typeObject),
    object: typeObject,
  },
}

export default EAttributeValues
