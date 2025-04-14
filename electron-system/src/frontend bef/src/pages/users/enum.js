import {travelTypeObject} from '../../enumeration'
import {routes} from '../../routes/paths'
import api from '../../services/api'

const typeOptions = {
  USER: {label: 'user', value: 'USER', bg: 'success'},
  ADMIN: {label: 'admin', value: 'ADMIN', bg: 'error'},
}
const EUsers = {
  title: {
    name: ['user', 'users'],
  },
  routes: routes.users,
  api: api.users,
  enum: {
    array: Object.values(typeOptions),
    object: typeOptions,
  },
}

export default EUsers
