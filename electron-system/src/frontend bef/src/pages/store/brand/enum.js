import {travelTypeObject} from '../../../enumeration'
import {routes} from '../../../routes/paths'
import api from '../../../services/api'

const EBrand = {
  title: {
    name: ['brand', 'brands'],
  },
  routes: routes.brand,
  api: api.store.brand,
}

export default EBrand
