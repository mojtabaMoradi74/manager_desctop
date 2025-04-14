import * as yup from 'yup'
import errorsText from '../../../utils/errorsText'

const validation = {
  // defaultValue:{},
  fieldNames: {
    name: 'name',
    description: 'description',
    serialId: 'serialId',
    supply: 'supply',
    status: 'status',
    address: 'address',
    isFeatured: 'isFeatured',
    isExplorer: 'isExplorer',
    isVerified: 'isVerified',
    image: 'image',
    background: 'background',
    site: 'website',
    instagram: 'instagram',
    categories: 'category',
    isLazyMint: 'isLazyMint',
    isTrend: 'isTrend',
    isSlider: 'isSlider',
    isPhysical: 'isPhysical',
    type: 'type',
  },
  schema: () =>
    yup.object().shape({
      [validation.fieldNames.name]: yup.string().nullable(),
      [validation.fieldNames.address]: yup.string().nullable(),
      [validation.fieldNames.description]: yup.string().nullable(),
      // --------------------------------------
      // [validation.fieldNames.status]: yup.mixed().nullable().required(errorsText.blankError()),
      // [validation.fieldNames.image]: yup.mixed().nullable().required(errorsText.blankError()),
      // [validation.fieldNames.categories]: yup.mixed().nullable().required(errorsText.blankError()),
      // --------------------------------------
      [validation.fieldNames.isFeatured]: yup.bool(),
      [validation.fieldNames.isVerified]: yup.bool(),
      [validation.fieldNames.isExplorer]: yup.bool(),
    }),
}

export default validation
