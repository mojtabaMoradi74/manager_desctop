import {Grid} from '@mui/material'
import {useFormContext, useWatch} from 'react-hook-form'
import RHFSelector from 'src/components/hook-form/RHFSelector'
import validation from '../../Add/validation'

const DefaultVariable = () => {
  const useForm = useFormContext()
  const {control, register, errors} = useForm
  const watchAttributes = useWatch({control, name: validation.fieldNames.attributes})

  return (
    <Grid spacing={2} container>
      {watchAttributes?.map((x, i) => {
        if (!x.usedForVariation) return <></>

        return (
          <Grid xs={12} md={6} key={'default-variant-attribute-' + x.value} item>
            <RHFSelector
              {...{
                name: `${validation.fieldNames.defaultVariant}.${i}.${validation.fieldNames.attributeValues}`,
                options: x?.attributeValues,
                label: x.label,
              }}
            />
          </Grid>
        )
      })}
    </Grid>
  )
}

export default DefaultVariable
