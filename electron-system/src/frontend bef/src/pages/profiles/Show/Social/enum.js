import {travelTypeObject} from '../../../../enumeration'
import {routes} from '../../../../routes/paths'
import api from '../../../../services/api'

const ECaravanSocial = {
  title: {},
  routes: routes.caravansManagement,
  api: api.caravan,
  enum: {
    array: Object.values(travelTypeObject),
    object: travelTypeObject,
  },
}

export default ECaravanSocial
