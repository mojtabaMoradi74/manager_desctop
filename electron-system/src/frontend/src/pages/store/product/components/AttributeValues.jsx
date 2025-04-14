import validation from '../Add/validation'
import {useFormContext} from 'react-hook-form'
import attributeValuesSelector from '../../attributeValues/selector'

const ProductAttributeValuesComponent = ({label, value, index}) => {
  const {watch, control, register, errors} = useFormContext()

  // const state = watch(fieldNames.attributeValues)
  // const stateattributes = watch(fieldNames.attributes)
  // console.log({ ProductAttributeValuesComponent: state, value }, `${fieldNames.attributeValues}.[${value}]`);
  // console.log({ ProductAttributeValuesComponent: state?.[value], value }, `${fieldNames.attributeValues}.[${value}]`);
  // console.log({ stateattributes });

  return (
    <div className='mt-0'>
      <attributeValuesSelector.Element
        isMulti
        {...{
          name: `${validation.fieldNames.attributes}.${index}.${validation.fieldNames.attributeValues}`, //`${fieldNames.attributeValues}.[${value}]`
          register,
          // label: label,
          placeholder: 'Select multi attribute',
          apiParams: {parent: value},
          multiple: true,
        }}
      />
    </div>
  )
}

export default ProductAttributeValuesComponent
