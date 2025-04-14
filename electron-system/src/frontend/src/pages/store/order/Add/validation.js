import * as yup from 'yup'
import errorsText from '../../../../utils/errorsText'

const validation = {
  // defaultValue:{},
  fieldNames: {
    title: 'title',
    slug: 'slug',
    type: 'type',
    linkType: 'linkType',
    link: 'link',
    order: 'order',
    status: 'status',
    image: 'image',
    product: 'product',
    category: 'category',
  },
  schema: () => {
    const obj = {
      [validation.fieldNames.title]: yup.string().required(errorsText.blankError()),
      // --------------------------------------
      [validation.fieldNames.status]: yup.mixed().nullable().required(errorsText.blankError()),

      [validation.fieldNames.image]: yup.mixed().nullable(),
    }

    return yup.object().shape(obj)
  },
}

export default validation
