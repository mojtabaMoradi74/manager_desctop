import {travelTypeObject} from '../../../enumeration'
import {routes} from '../../../routes/paths'
import api from '../../../services/api'

const ECategories = {
  title: {
    name: ['category', 'categories'],
  },
  routes: routes.category,
  api: api.store.category,
}

export default ECategories
