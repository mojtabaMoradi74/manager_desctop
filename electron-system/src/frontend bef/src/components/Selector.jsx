/* eslint-disable */

import clsx from 'clsx'
import _ from 'lodash'
import SelectorComponent from './hook-form/Selector'

export const Selector = ({
  label,
  name,
  error,
  valid,
  required = false,
  disabledCondition = false,
  value,
  data,
  setSelector,
  formik,
  ...rest
}) => {
  return (
    <>
      <SelectorComponent label={label} options={data} value={value} />
      {/*
      <label className='form-label'>{label}</label>
      <select
        autoComplete={name}
        required={required}
        name={name}
        value={value}
        className={clsx(
          'form-control form-control-lg form-control',
          {'is-invalid': error},
          {
            'is-valid': valid,
          }
        )}
        {...rest}
      >
        <option selected disabled hidden className='hidden' value=''>
          {' '}
          Select Options ...
        </option>

        {data.map((item, i) => (
          <>
            <option value={_.isObject(item) ? item.value : item} key={i}>
              {' '}
              {_.isObject(item) ? item.name : item}
            </option>
          </>
        ))}
      </select> */}
    </>
  )
}
