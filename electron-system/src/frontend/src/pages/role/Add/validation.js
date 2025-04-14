import * as yup from 'yup'
import errorsText from '../../../utils/errorsText'

const validation = {
  // defaultValue:{},
  fieldNames: {
    name: 'name',
    permissions: 'permissions',
    status: 'status',
  },
  schema: () => {
    const obj = {
      [validation.fieldNames.name]: yup.string().required(errorsText.blankError()),
      // --------------------------------------
      [validation.fieldNames.status]: yup.mixed().required(errorsText.blankError()),
      [validation.fieldNames.permissions]: yup.mixed().required(errorsText.blankError()),
      // --------------------------------------
    }
    return yup.object().shape(obj)
  },
}

export default validation
