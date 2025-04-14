import {uniqueId} from 'lodash'
import {useFormContext, useWatch} from 'react-hook-form'
import validation from '../../Add/validation'
import DefaultVariable from './DefaultVariant'
import ProductVariantForms from './Form'
import ProductVariantOption from './Options'

const ProductVariantComponent = () => {
  const contextParentForm = useFormContext()

  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    formState: {errors},
    control,
    reset,
    watch,
  } = contextParentForm

  const watchAttributes = useWatch({
    control: contextParentForm.control,
    name: validation.fieldNames.attributes,
  })
  const watchVariants = useWatch({
    control: contextParentForm.control,
    name: validation.fieldNames.variants,
  })
  const currentVariants = watch(validation.fieldNames.variants)

  const handleAddNewVariant = () => {
    const {attributes, ...other} = contextParentForm.getValues()
    console.log('* * * handleAddNewVariant :', {attributes})
    const attributesConverted = attributes
      .filter((x) => x.usedForVariation)
      ?.map((x) => ({...x, attributeValues: null}))
    const values = getValues()
    const newVariants = [...(values.variants || [])]
    newVariants.push({attributes: attributesConverted, id: +(Math.random() * +new Date())})
    console.log('* * * handleAddNewVariant :', {newVariants})
    // reset({...other, variants: newVariants})
    setValue('variants', newVariants)
  }

  const handleCreateForAllVariants = () => {
    alert('coming Soon')
    // return
  }

  const handleClear = (i) => {
    // console.log({ i, state }, state.splice(+i, 1));
    const values = getValues()
    const newVariants = [...values.variants]
    newVariants.splice(+i, 1)
    // reset({variants: newVariants})
    setValue('variants', newVariants)
  }

  return (
    <div className='flex flex-col gap-4'>
      <DefaultVariable />
      <ProductVariantOption {...{handleAddNewVariant, handleCreateForAllVariants}} />

      {currentVariants?.map((x, i) => {
        // console.log({ x });
        // const { dragging, dragged, ...rest } = options(i);
        return (
          <div key={'ProductVariantComponent' + x.id}>
            <ProductVariantForms
              data={x}
              index={i}
              onClear={() => handleClear(i)}
              baseName={`variants.${i}.`}
              // {...{ stateParentAttributes, stateParentAttributesValues }}
            />
          </div>
        )
      })}
    </div>
  )
}

export default ProductVariantComponent
