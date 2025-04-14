import {travelTypeObject} from '../../../enumeration'
import {routes} from '../../../routes/paths'
import api from '../../../services/api'

const EShippingClass = {
  title: {
    name: ['shipping class', 'shipping classes'],
  },
  routes: routes.shippingClass,
  api: api.shippingClass,
}

export default EShippingClass
