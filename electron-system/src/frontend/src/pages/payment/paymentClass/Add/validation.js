import * as yup from 'yup'
import errorsText from '../../../../utils/errorsText'

const validation = {
  // defaultValue:{},
  fieldNames: {
    title: 'title',
    description: 'description',
    type: 'type',
    order: 'order',
    status: 'status',
    default: 'default',
  },
  schema: () => {
    const obj = {
      [validation.fieldNames.title]: yup.string().required(errorsText.blankError()),
      [validation.fieldNames.description]: yup.string().required(errorsText.blankError()),
      [validation.fieldNames.order]: yup.string().required(errorsText.blankError()),
      // --------------------------------------
      [validation.fieldNames.default]: yup.boolean().nullable(),
      // --------------------------------------
      [validation.fieldNames.type]: yup.mixed().nullable().required(errorsText.blankError()),
      [validation.fieldNames.status]: yup.mixed().nullable().required(errorsText.blankError()),
    }

    return yup.object().shape(obj)
  },
}

export default validation
