import {Grid} from '@mui/material'
import {useFormContext} from 'react-hook-form'
import {RHFCheckbox, RHFTextField} from 'src/components/hook-form'
import calcDiscountNumber from 'src/utils/calcDiscountNumber'
import validation from '../Add/validation'
import shippingClassSelector from 'src/pages/shippings/shippingClass/selector'
import {useTranslation} from 'react-i18next'

const ProductShippingComponent = () => {
  // const {watch} = useFormContext()
  const {t} = useTranslation()

  return (
    <div className='flex flex-col gap-4'>
      <Grid className='' container spacing={4}>
        <Grid className='' xs={12} md={12} item>
          <shippingClassSelector.Element
            require
            {...{
              name: validation.fieldNames.shippingClass,
              placeholder: 'shipping class',
              label: 'shipping class',
            }}
          />
        </Grid>

        <Grid className='' xs={12} item>
          <RHFTextField
            require
            {...{
              name: validation.fieldNames.weight,
              // placeholder: 'weight',
              label: 'weight (kg)',
              type: 'number',
            }}
          />
        </Grid>
      </Grid>
      <div className='flex flex-col gap-3'>
        <div>{t('dimensions')} (cm)</div>
        <Grid className='' container spacing={4}>
          <Grid className='' xs={12} md={4} item>
            <RHFTextField
              require
              {...{
                name: validation.fieldNames.length,
                placeholder: 'length',
                label: 'length',
                type: 'number',
              }}
            />
          </Grid>
          <Grid className='' xs={12} md={4} item>
            <RHFTextField
              require
              {...{
                name: validation.fieldNames.width,
                placeholder: 'width',
                label: 'width',
                type: 'number',
              }}
            />
          </Grid>
          <Grid className='' xs={12} md={4} item>
            <RHFTextField
              require
              {...{
                name: validation.fieldNames.height,
                placeholder: 'height',
                label: 'height',
                type: 'number',
              }}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default ProductShippingComponent
