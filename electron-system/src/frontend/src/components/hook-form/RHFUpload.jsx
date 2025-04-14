import PropTypes from 'prop-types'
// form
import {useFormContext, Controller} from 'react-hook-form'
// @mui
import {FormHelperText} from '@mui/material'
// type
import {UploadAvatar, UploadMultiFile, UploadSingleFile} from '../upload'
import {UploadSingleFile1} from '../upload/UploadSingleFile'

// ----------------------------------------------------------------------

RHFUploadAvatar.propTypes = {
  name: PropTypes.string,
}

export function RHFUploadAvatar({name, ...other}) {
  const {control} = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => {
        const checkError = !!error && !field.value

        return (
          <div>
            <UploadAvatar error={checkError} {...other} file={field.value} />
            {checkError && (
              <FormHelperText error sx={{px: 2, textAlign: 'center'}}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        )
      }}
    />
  )
}

// ----------------------------------------------------------------------

RHFUploadSingleFile.propTypes = {
  name: PropTypes.string,
}

export function RHFUploadSingleFile({name, ...other}) {
  const {control, setValue} = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => {
        const checkError = !!error && !field.value

        console.log({field})
        const handleDrop = (acceptedFiles) => {
          const file = acceptedFiles[0]
          console.log('test')

          if (file) {
            field.onChange(
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            )
            // setValue(
            //   name,
            //   Object.assign(file, {
            //     preview: URL.createObjectURL(file),
            //   })
            // );
          }
        }

        return (
          <UploadSingleFile
            accept='image/*'
            file={field.value}
            error={checkError}
            helperText={
              checkError && (
                <FormHelperText error sx={{px: 2}}>
                  {error.message}
                </FormHelperText>
              )
            }
            onDrop={handleDrop}
            {...other}
          />
        )
      }}
    />
  )
}

// ----------------------------------------------------------------------

RHFUploadSingleFile1.propTypes = {
  name: PropTypes.string,
}

export function RHFUploadSingleFile1({name, ...other}) {
  const {control} = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => {
        const checkError = !!error && !field.value

        return (
          <UploadSingleFile1
            accept='image/*'
            file={field.value}
            error={checkError}
            helperText={
              checkError && (
                <FormHelperText error sx={{px: 2}}>
                  {error.message}
                </FormHelperText>
              )
            }
            {...other}
          />
        )
      }}
    />
  )
}

// ----------------------------------------------------------------------

RHFUploadMultiFile.propTypes = {
  name: PropTypes.string,
}

export function RHFUploadMultiFile({name, ...other}) {
  const {control} = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => {
        const checkError = !!error && field.value?.length === 0

        const handleDrop = (acceptedFiles) => {
          const file = acceptedFiles
          console.log('test')

          if (file) {
            field.onChange(
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            )
            // setValue(
            //   name,
            //   Object.assign(file, {
            //     preview: URL.createObjectURL(file),
            //   })
            // );
          }
        }

        return (
          <UploadMultiFile
            accept='image/*'
            files={field.value}
            error={checkError}
            helperText={
              checkError && (
                <FormHelperText error sx={{px: 2}}>
                  {error?.message}
                </FormHelperText>
              )
            }
            onDrop={handleDrop}
            {...other}
          />
        )
      }}
    />
  )
}
