import {travelTypeObject} from '../../../enumeration'
import {routes} from '../../../routes/paths'
import api from '../../../services/api'

const ETag = {
  title: {
    name: ['tag', 'tags'],
  },
  routes: routes.tag,
  api: api.store.tag,
}

export default ETag
