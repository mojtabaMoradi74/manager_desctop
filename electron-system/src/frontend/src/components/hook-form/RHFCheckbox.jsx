import PropTypes from 'prop-types'
// form
import {useFormContext, Controller} from 'react-hook-form'
// @mui
import {Checkbox, FormGroup, FormControlLabel, Skeleton} from '@mui/material'
import {useTranslation} from 'react-i18next'
import React from 'react'

// ----------------------------------------------------------------------

export const RHFCheckbox = React.memo(({name, disabled, loading, label, ...other}) => {
  const {control} = useFormContext()
  const {t} = useTranslation()

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({field}) => {
            console.log('* * * RHFCheckbox : ', {field, name})
            return loading ? (
              <Skeleton variant='text' width={40} height={40} />
            ) : (
              <Checkbox
                disabled={disabled}
                {...field}
                onChange={(e) => {
                  console.log('* * * RHFCheckbox : ', {checked: e?.target?.checked})
                  field.onChange(e)
                }}
                checked={field.value || false}
                color={'success'}
              />
            )
          }}
        />
      }
      label={t(label)}
      {...other}
    />
  )
})
RHFCheckbox.propTypes = {
  name: PropTypes.string,
}

// ----------------------------------------------------------------------

RHFMultiCheckbox.propTypes = {
  name: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
}

export function RHFMultiCheckbox({name, options, ...other}) {
  const {control} = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => {
        const onSelected = (option) =>
          field.value.includes(option)
            ? field.value.filter((value) => value !== option)
            : [...field.value, option]

        return (
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={field.value.includes(option)}
                    onChange={() => field.onChange(onSelected(option))}
                    color={'success'}
                  />
                }
                label={option}
                {...other}
              />
            ))}
          </FormGroup>
        )
      }}
    />
  )
}
