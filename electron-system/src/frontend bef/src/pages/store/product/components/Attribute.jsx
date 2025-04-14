import {Grid} from '@mui/material'
import {useMemo} from 'react'
import {useFormContext, useWatch} from 'react-hook-form'
import CloseIcon from '@mui/icons-material/Close'
import attributeSelector from '../../attribute/selector'
import validation from '../Add/validation'
import ProductAttributeValuesComponent from './AttributeValues'
import SortableList from './SortableList'
import {RHFCheckbox} from '../../../../components/hook-form/RHFCheckbox'

const ProductAttributeComponent = () => {
  const {control, register, errors, watch, setValue, reset} = useFormContext()

  const state = useWatch({control, name: validation.fieldNames.attributes})
  const variants = watch(validation.fieldNames.variants)

  const attributeKey = useMemo(() => {
    return state?.reduce((accumulator, currentValue) => {
      accumulator[currentValue.value] = currentValue
      return accumulator
    }, {})
  }, [state])

  console.log('* * * ProductAttributeComponent * * *', {state, variants})
  console.log('* * * ProductAttributeComponent * * *', {attributeKey})

  const handleClear = (i) => {
    // console.log({ i, state }, state.splice(+i, 1));
    const newState = [...state]
    newState.splice(+i, 1)
    setValue(validation.fieldNames.attributes, newState)
  }

  return (
    <div className='w-full'>
      <Grid container spacing={3}>
        <Grid xs={12} md={12} item>
          <attributeSelector.Element
            multiple
            name={validation.fieldNames.attributes}
            label={'attributes'}
            onChange={(_, params) => {
              const newParams = params?.map((x) => {
                const {label, value, ...options} = attributeKey?.[x.value] || {}
                return {...x, ...options}
              })
              console.log('* * * ProductAttributeComponent * * *', {params, newParams})
              setValue(validation.fieldNames.attributes, newParams)
            }}
          />
        </Grid>

        <Grid xs={12} md={12} item>
          <SortableList
            className='list flex flex-col gap-3'
            value={state}
            onChange={(newState) => {
              setValue(validation.fieldNames.attributes, newState)
              // let newVariants = variants?.map((x) => {
              //     x.attributes = compareArray(newState, x.attributes, "value")
              //     return x
              // })
              // console.log("* * * ProductAttributeComponent ", { newState, state, variants, newVariants });
              // console.log("* * * ProductAttributeComponent ", { newVariants });
              // reset({ [fieldNames.attributes]: newState })
            }}
          >
            {({options}) => {
              // console.log({ options });
              return state?.map((x, i) => {
                const {dragging, dragged, ...rest} = options(i)
                // console.log({dragging, dragged, rest, state, x}, i)

                return (
                  <div
                    {...rest}
                    key={'select-attribute-' + x.value}
                    className='border rounded-[8px] bg-grey-50'
                  >
                    <div className='p-4 flex justify-between items-center bg-gray-50'>
                      <div> {x.label} </div>
                      <CloseIcon fontSize='11' onClick={() => handleClear(i)} />
                    </div>
                    <div className='p-4 '>
                      <Grid container spacing={3}>
                        <Grid xs={12} md={12} item>
                          <ProductAttributeValuesComponent {...{index: i}} {...x} />
                        </Grid>
                        <Grid xs={12} md={12} item>
                          <RHFCheckbox
                            name={`${validation.fieldNames.attributes}.[${i}].${validation.fieldNames.usedForVariation}`}
                            label={'Used for variation'}
                          />
                        </Grid>
                        <Grid xs={12} md={12} item>
                          <RHFCheckbox
                            name={`${validation.fieldNames.attributes}.[${i}].${validation.fieldNames.showInProduct}`}
                            label={'Show In Product'}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                )
              })
            }}
          </SortableList>
        </Grid>
      </Grid>
    </div>
  )
}

export default ProductAttributeComponent
