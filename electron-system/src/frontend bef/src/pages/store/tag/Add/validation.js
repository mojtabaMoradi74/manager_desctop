import * as yup from 'yup'
import errorsText from '../../../../utils/errorsText'

const validation = {
  // defaultValue:{},
  fieldNames: {
    title: 'title',
    slug: 'slug',
    parent: 'parent',
    status: 'status',
    image: 'image',
  },
  schema: () => {
    const obj = {
      [validation.fieldNames.title]: yup.string().required(errorsText.blankError()),
      [validation.fieldNames.slug]: yup.string().required(errorsText.blankError()),
      // --------------------------------------
      [validation.fieldNames.status]: yup.mixed().nullable().required(errorsText.blankError()),
    }

    return yup.object().shape(obj)
  },
}

export default validation
