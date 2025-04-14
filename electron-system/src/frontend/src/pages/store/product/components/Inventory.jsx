import {Grid} from '@mui/material'
import {useFormContext} from 'react-hook-form'
import {RHFCheckbox, RHFTextField} from 'src/components/hook-form'
import calcDiscountNumber from 'src/utils/calcDiscountNumber'
import validation from '../Add/validation'

const InventoryComponent = () => {
  const {watch} = useFormContext()
  const watchStock = watch(validation.fieldNames.manageStock)

  return (
    <div className=''>
      <Grid className='' container spacing={4}>
        <Grid className='' xs={12} md={12} item>
          <RHFTextField
            require
            {...{
              name: validation.fieldNames.sku,
              placeholder: 'sku',
              label: 'sku',
            }}
          />
        </Grid>
        <Grid className='' xs={12} md={12} item>
          <RHFCheckbox
            require
            {...{
              name: validation.fieldNames.manageStock,
              placeholder: 'manageStock',
              label: 'manageStock',
            }}
          />
        </Grid>
        {watchStock ? (
          <>
            <Grid className='' xs={12} md={6} item>
              <RHFTextField
                require
                {...{
                  name: validation.fieldNames.stockCount,
                  placeholder: 'stockCount',
                  label: 'stockCount',
                  type: 'number',
                }}
              />
            </Grid>

            <Grid className='' xs={12} md={6} item>
              <RHFTextField
                {...{
                  name: validation.fieldNames.lowStockAmount,
                  placeholder: 'lowStockAmount',
                  label: 'lowStockAmount',
                  type: 'number',
                }}
              />
            </Grid>
          </>
        ) : (
          ''
        )}
      </Grid>
    </div>
  )
}

export default InventoryComponent
