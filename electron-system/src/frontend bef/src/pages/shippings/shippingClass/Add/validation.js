import * as yup from 'yup'
import errorsText from '../../../../utils/errorsText'

const validation = {
  // defaultValue:{},
  fieldNames: {
    title: 'title',
    description: 'description',
    shippingMethods: 'shippingMethods',
    order: 'order',
    status: 'status',
    image: 'image',
  },
  schema: () => {
    const obj = {
      [validation.fieldNames.title]: yup.string().required(errorsText.blankError()),
      [validation.fieldNames.description]: yup.string().nullable(),
      // --------------------------------------
      [validation.fieldNames.status]: yup.mixed().nullable().required(errorsText.blankError()),
      // --------------------------------------
      [validation.fieldNames.shippingMethods]: yup
        .array()
        .nullable()
        .required(errorsText.blankError()),
    }

    return yup.object().shape(obj)
  },
}

export default validation
