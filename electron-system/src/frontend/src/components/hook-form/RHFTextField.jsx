import PropTypes from 'prop-types'
// form
import {useFormContext, Controller} from 'react-hook-form'
// @mui
import {IconButton, InputAdornment, TextField} from '@mui/material'
import {separateNumberWithComma} from '../../utils/index'
import persianToEnglishNumber from '../../utils/persianToEnglishNumber'
import Iconify from '../Iconify'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
}

export default function RHFTextField({name, type, min, max, label, required, onChange, ...other}) {
  const [showPassword, setShowPassword] = useState(false)
  const {control} = useFormContext()
  const {t} = useTranslation()

  const isNumber = type === 'number'
  if (isNumber) type = 'string'

  const isPassword = type === 'password'

  return (
    <Controller
      name={name}
      control={control}
      render={({field: {onChange: change, value, ...field}, fieldState: {error}}) => {
        const changeValue = isNumber ? separateNumberWithComma(value) : value || ''
        // console.log(`RHFTextField - ${name}`, {changeValue})
        const handleChange = (e) => {
          if (isNumber) {
            let newValue = e.target.value?.replace(/,/g, '')?.trim()
            if (newValue) newValue = persianToEnglishNumber(newValue)
            // const regex = /^[0-9]+$/
            // const regex = /^[0-9]+([.,][0-9]+)?$/
            const regex = /^([0-9]+(\.[0-9]*)?)$/

            // const regex = /^[0-9\u0660-\u0669\u06F0-\u06F9]+$/;
            // console.log(
            //   `RHFTextField - ${name} - handleChange`,
            //   {newValue, min, max},
            //   Number.isNaN(newValue),
            //   regex.test(newValue)
            // )
            if ((regex.test(newValue) || !newValue) && !Number.isNaN(newValue)) {
              // console.log(`RHFTextField - ${name} - handleChange ok`)
              if (min >= 0) {
                if (newValue < min) {
                  newValue = min
                }
              }
              if (max >= 0) {
                if (newValue > max) {
                  newValue = max
                }
              }
              onChange?.(newValue)
              return change(newValue)
            }
          } else {
            onChange?.(e)
            change(e)
          }
        }

        return (
          <TextField
            label={`${t(label)}${required ? ' *' : ''}`}
            {...field}
            // inputProps={{
            //   max: 2,
            // }}

            value={changeValue}
            fullWidth
            error={!!error}
            helperText={error?.message}
            {...other}
            onChange={handleChange}
            // pattern={isNumber ? '/^[0-9۰-۹]+$/' : undefined}
            onWheel={(e) => {
              if (e.target.type === 'number') {
                e.preventDefault()
              }
              // e.target.blur();
              // setTimeout(() => e.target.focus(), 0);
            }}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            InputProps={{
              endAdornment: isPassword && (
                <InputAdornment position='end'>
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )
      }}
    />
  )
}
