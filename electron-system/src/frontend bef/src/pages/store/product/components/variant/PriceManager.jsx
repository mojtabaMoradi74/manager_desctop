import {Grid} from '@mui/material'
import {useFormContext} from 'react-hook-form'
import {RHFTextField} from 'src/components/hook-form'
import calcDiscountNumber from 'src/utils/calcDiscountNumber'
import validation from '../../Add/validation'

const PriceManagerVariant = ({baseName = '', index}) => {
  const {setValue, getValues} = useFormContext()

  const handleChangeSalePrice = (e) => {
    const values = getValues()
    setValue(
      baseName + validation.fieldNames.discount,
      e > 0 ? calcDiscountNumber(values?.variants?.[index]?.price, e) : 0
    )
  }

  const handleChangePrice = (e) => {
    const values = getValues()
    setValue(
      baseName + validation.fieldNames.salePrice,
      e && values?.variants?.[index]?.discount > 0
        ? (e * values?.variants?.[index]?.discount) / 100
        : 0
    )
  }

  const handleChangeDiscount = (e) => {
    const values = getValues()
    setValue(
      baseName + validation.fieldNames.salePrice,
      e > 0
        ? (values?.variants?.[index]?.price || 0) - (e * values?.variants?.[index]?.price) / 100
        : 0
    )
  }

  return (
    <>
      <Grid className='' xs={12} md={12} item>
        <RHFTextField
          require
          {...{
            name: baseName + validation.fieldNames.price,
            placeholder: 'price',
            label: 'regular price',
            onChange: handleChangePrice,
            type: 'number',
          }}
        />
      </Grid>
      <Grid className='' xs={12} md={12} item>
        <RHFTextField
          require
          {...{
            name: baseName + validation.fieldNames.salePrice,
            placeholder: 'sale price',
            label: 'sale price',
            onChange: handleChangeSalePrice,
            type: 'number',
          }}
        />
      </Grid>

      <Grid className='' xs={12} md={12} item>
        <RHFTextField
          {...{
            name: baseName + validation.fieldNames.discount,
            placeholder: '20',
            label: 'discount %',
            onChange: handleChangeDiscount,
            type: 'number',
          }}
        />
      </Grid>
    </>
  )
}

export default PriceManagerVariant
