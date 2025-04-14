import {Autocomplete, Chip, TextField} from '@mui/material'
import {Controller, useFormContext} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {useMemo, useState} from 'react'
import LazyImageComponent from '../LazyImageComponent'

const RHFSelector = ({
  options = [],
  label,
  required,
  name,
  inputProps,
  onChange,
  multiple = false,
  custom,
  ...other
}) => {
  const {t} = useTranslation()
  const {control} = useFormContext() || {}
  // const [inputValue, setInputValue] = useState('')

  let availableOptions = useMemo(() => {
    if (!custom) return
    return options?.filter(
      (x) => !(multiple ? other?.value : [other?.value])?.some((y) => x?.value === y?.value)
    )
  }, [other?.value])

  return !custom ? (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => {
        availableOptions = options?.filter(
          (x) => !(multiple ? field?.value : [field?.value])?.some((y) => x?.value === y?.value)
        )

        return (
          <Autocomplete
            ref={field.ref}
            onBlur={field.onBlur}
            noOptionsText={<div className='text-[15px] text-grey-500'>{t('not found')}</div>}
            multiple
            id={name}
            // inputValue={inputValue}
            // onInputChange={(_, newInputValue) => {
            //   setInputValue(newInputValue)
            // }}
            loadingText={<div className='text-[15px] text-grey-500'>{t('please wait')}</div>}
            onChange={(_, newValue) => {
              if (multiple) {
                newValue = newValue?.filter((x) => x.label || x.value) || []
              } else {
                newValue = newValue?.length ? newValue[newValue?.length - 1] : null
              }
              // setInputValue('')
              onChange?.(newValue)
              field.onChange(newValue)
            }}
            options={availableOptions}
            renderOption={(props, option, {selected}) => {
              console.log({selected, option})
              return (
                <li
                  {...props}
                  className={[
                    'p-[10px] flex items-center gap-2 cursor-pointer hover:bg-gray-50',
                    selected ? 'text-gray-300 ' : '',
                  ].join(' ')}
                >
                  {option?.image ? (
                    <LazyImageComponent
                      className={{
                        container: 'w-[50px] rounded-full overflow-hidden border bg-white',
                      }}
                      file={option.image}
                    />
                  ) : (
                    ''
                  )}
                  <span className={[selected ? ' font-bold' : 'font-normal'].join(' ')}>
                    {option.label}
                  </span>
                </li>
              )
            }}
            renderTags={(value, getTagProps) =>
              value?.map((option, index) => (
                <Chip
                  {...getTagProps({index})}
                  sx={{
                    overflow: 'unset',
                    '.css-t3ycia-MuiChip-label': {
                      overflow: 'unset',
                    },
                  }}
                  key={option?.value}
                  size='small'
                  label={
                    <div className='flex items-center gap-2'>
                      {option?.image ? (
                        <div className='w-[40px] relative flex justify-center items-center'>
                          <div className='absolute'>
                            <LazyImageComponent
                              className={{
                                container: 'w-[40px] rounded-full overflow-hidden border  bg-white',
                              }}
                              file={option.image}
                            />
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                      <span>{option.label}</span>
                    </div>
                  }
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={`${t(label)}${required ? ' *' : ''}`}
                variant='outlined'
                error={error}
                helperText={error?.message}
                InputProps={{
                  ...params.InputProps,
                  ...inputProps,
                  // startAdornment: (
                  //   <>
                  //     {field.value && !multiple && (
                  //       <Chip
                  //         size='small'
                  //         label={field.value?.label}
                  //         onDelete={() => {
                  //           field.onChange(null)
                  //           setInputValue('')
                  //         }}
                  //       />
                  //     )}
                  //   </>
                  // ),
                }}
              />
            )}
            {...other}
            value={multiple ? field.value || [] : field.value ? [field.value] : []}
          />
        )
      }}
    />
  ) : (
    <Autocomplete
      noOptionsText={<div className='text-[15px] text-grey-500'>{t('not found')}</div>}
      multiple
      id={name}
      // inputValue={inputValue}
      // onInputChange={(_, newInputValue) => {
      //   setInputValue(newInputValue)
      // }}
      loadingText={<div className='text-[15px] text-grey-500'>{t('please wait')}</div>}
      onChange={(_, newValue) => {
        if (multiple) {
          newValue = newValue?.filter((x) => x.label || x.value) || []
        } else {
          newValue = newValue?.length ? newValue[newValue?.length - 1] : null
        }
        // setInputValue('')
        onChange?.(newValue)
      }}
      options={availableOptions}
      renderOption={(props, option, {selected}) => {
        console.log({selected, option})
        return (
          <li
            {...props}
            className={[
              'p-[10px] flex items-center gap-2 cursor-pointer hover:bg-gray-50',
              selected ? 'text-gray-300 ' : '',
            ].join(' ')}
          >
            {option?.image ? (
              <LazyImageComponent
                className={{
                  container: 'w-[50px] rounded-full overflow-hidden border bg-white',
                }}
                file={option.image}
              />
            ) : (
              ''
            )}
            <span className={[selected ? ' font-bold' : 'font-normal'].join(' ')}>
              {option.label}
            </span>
          </li>
        )
      }}
      renderTags={(value, getTagProps) =>
        value?.map((option, index) => (
          <Chip
            {...getTagProps({index})}
            sx={{
              overflow: 'unset',
              '.css-t3ycia-MuiChip-label': {
                overflow: 'unset',
              },
            }}
            key={option?.value}
            size='small'
            label={
              <div className='flex items-center gap-2'>
                {option?.image ? (
                  <div className='w-[40px] relative flex justify-center items-center'>
                    <div className='absolute'>
                      <LazyImageComponent
                        className={{
                          container: 'w-[40px] rounded-full overflow-hidden border  bg-white',
                        }}
                        file={option.image}
                      />
                    </div>
                  </div>
                ) : (
                  ''
                )}
                <span>{option.label}</span>
              </div>
            }
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={`${t(label)}${required ? ' *' : ''}`}
          variant='outlined'
          error={other.error}
          helperText={other?.error?.message}
          InputProps={{
            ...params.InputProps,
            ...inputProps,
          }}
        />
      )}
      value={multiple ? other.value || [] : other.value ? [other.value] : []}
    />
  )
}

export default RHFSelector
