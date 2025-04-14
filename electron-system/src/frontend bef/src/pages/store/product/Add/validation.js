import * as yup from 'yup'
import errorsText from '../../../../utils/errorsText'

const validation = {
  // defaultValue:{},
  fieldNames: {
    title: 'title',
    slug: 'slug',
    description: 'description',
    shortDescription: 'shortDescription',
    category: 'category',
    categories: 'categories',
    tags: 'tags',
    brand: 'brand',
    parent: 'parent',
    status: 'status',
    image: 'image',
    images: 'images',
    weight: 'weight',
    length: 'length',
    width: 'width',
    height: 'height',
    price: 'price',
    salePrice: 'salePrice',
    type: 'type',
    sku: 'sku',
    attributes: 'attributes',
    attributeValues: 'attributeValues',
    usedForVariation: 'usedForVariation',
    variants: 'variants',
    manageStock: 'manageStock',
    stockCount: 'stockCount',
    manageShipping: 'manageShipping',
    defaultVariant: 'defaultVariant',
    discount: 'discount',
    showInProduct: 'showInProduct',
    lowStockAmount: 'lowStockAmount',
    shippingClass: 'shippingClass',
  },
  schema: () => {
    const obj = {
      [validation.fieldNames.title]: yup.string().required(errorsText.blankError()),
      [validation.fieldNames.slug]: yup.string().required(errorsText.blankError()),
      // --------------------------------------
      [validation.fieldNames.status]: yup.mixed().nullable().required(errorsText.blankError()),

      [validation.fieldNames.image]: yup.mixed().nullable(),
    }

    return yup.object().shape(obj)
  },
}

export default validation
