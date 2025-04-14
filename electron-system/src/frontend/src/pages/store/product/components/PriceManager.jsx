import {Grid} from '@mui/material'
import Decimal from 'decimal.js'
import {useFormContext} from 'react-hook-form'
import {RHFTextField} from 'src/components/hook-form'
import calcDiscountNumber from 'src/utils/calcDiscountNumber'
import validation from '../Add/validation'

const PriceManager = () => {
  const {setValue, getValues} = useFormContext()

  const handleChangeSalePrice = (e) => {
    const values = getValues()
    setValue(validation.fieldNames.discount, e > 0 ? calcDiscountNumber(values?.price, e) : 0)
  }

  const handleChangePrice = (e) => {
    const values = getValues()
    const discount = new Decimal(values?.discount || 0)
    const price = new Decimal(e || 0)
    const salePrice =
      price.gt(0) && discount.gt(0) ? price.minus(price.mul(discount).div(100)) : new Decimal(0)
    setValue(validation.fieldNames.salePrice, salePrice.toNumber())
  }

  const handleChangeDiscount = (e) => {
    const values = getValues()
    const price = new Decimal(values?.price || 0)
    const discount = new Decimal(e || 0)
    const salePrice = discount.gt(0) ? price.minus(price.mul(discount).div(100)) : new Decimal(0)
    setValue(validation.fieldNames.salePrice, salePrice.toNumber())
  }

  // const handleChangeSalePrice = (e) => {
  //   const values = getValues()
  //   setValue(validation.fieldNames.discount, e > 0 ? calcDiscountNumber(values?.price, e) : 0)
  // }

  // const handleChangePrice = (e) => {
  //   const values = getValues()
  //   setValue(
  //     validation.fieldNames.salePrice,
  //     e && values?.discount > 0 ? (e * values?.discount) / 100 : 0
  //   )
  // }

  // const handleChangeDiscount = (e) => {
  //   const values = getValues()
  //   setValue(
  //     validation.fieldNames.salePrice,
  //     e > 0 ? (values?.price || 0) - (e * values?.price) / 100 : 0
  //   )
  // }

  return (
    <>
      <Grid className='' xs={12} md={12} item>
        <RHFTextField
          require
          {...{
            name: validation.fieldNames.price,
            // placeholder: 'price',
            label: 'regularPrice',
            onChange: handleChangePrice,
            type: 'number',
          }}
        />
      </Grid>
      <Grid className='' xs={12} md={12} item>
        <RHFTextField
          require
          {...{
            name: validation.fieldNames.salePrice,
            // placeholder: 'salePrice',
            label: 'salePrice',
            onChange: handleChangeSalePrice,
            type: 'number',
          }}
        />
      </Grid>

      <Grid className='' xs={12} md={12} item>
        <RHFTextField
          {...{
            name: validation.fieldNames.discount,
            // placeholder: '20',
            label: 'discount',
            onChange: handleChangeDiscount,
            type: 'number',
          }}
        />
      </Grid>
    </>
  )
}

export default PriceManager
