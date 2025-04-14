import * as yup from 'yup'
import errorsText from '../../../../utils/errorsText'

const validation = {
  // defaultValue:{},
  fieldNames: {
    title: 'title',
    type: 'type',
    prepay: 'prepay',
    independent: 'independent',
    description: 'description',
    status: 'status',
    includeStates: 'includeStates',
    excludeStates: 'excludeStates',
    basePrice: 'basePrice',
    usageType: 'usageType',
    image: 'image',
    province: 'province',
    city: 'city',
    price: 'price',
  },
  schema: () => {
    const obj = {
      [validation.fieldNames.title]: yup.string().required(errorsText.blankError()),
      [validation.fieldNames.description]: yup.string().required(errorsText.blankError()),
      [validation.fieldNames.basePrice]: yup.string(),
      // --------------------------------------
      [validation.fieldNames.status]: yup.mixed().nullable().required(errorsText.blankError()),
      [validation.fieldNames.usageType]: yup.mixed().nullable().required(errorsText.blankError()),
      // --------------------------------------
      [validation.fieldNames.prepay]: yup.boolean().nullable().default(false),
    }

    return yup.object().shape(obj)
  },
}

export default validation
