import * as Yup from 'yup'
import {useSnackbar} from 'notistack'
import {useNavigate} from 'react-router-dom'
import {useEffect, useState} from 'react'
// form
import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
// @mui
import {Alert, Box, OutlinedInput, Stack, Typography} from '@mui/material'
import {LoadingButton} from '@mui/lab'
// routes
import {routes} from '../../../routes/paths'
import useTimer from 'src/hooks/useTimer'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import api from 'src/services/api.jsx'
import {useDispatch} from 'react-redux'
import {getAdminProfile} from 'src/redux/slices/user'
import axiosInstance from 'src/utils/axios'
import {tokenMsAge} from 'src/utils/jwt'
import tokenSlice from 'src/redux/slices/token'

// ----------------------------------------------------------------------

export default function VerifyCodeForm({isActive, onSubmit}) {
  const {enqueueSnackbar} = useSnackbar()
  const dispatch = useDispatch()

  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.string().nullable().required('Code is required'),
    code2: Yup.string().nullable().required('Code is required'),
    code3: Yup.string().nullable().required('Code is required'),
    code4: Yup.string().nullable().required('Code is required'),
  })

  const defaultValues = {
    code1: '',
    code2: '',
    code3: '',
    code4: '',
  }

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: {isSubmitting, isValid, errors},
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  })

  const values = watch()

  useEffect(() => {
    document.addEventListener('paste', handlePasteClipboard)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePasteClipboard = (event) => {
    let data = event?.clipboardData?.getData('Text') || ''

    data = data.split('')
    ;[].forEach.call(document.querySelectorAll('#field-code'), (node, index) => {
      node.value = data[index]
      const fieldIndex = `code${index + 1}`
      setValue(fieldIndex, data[index])
    })
  }

  const handleChangeWithNextField = (event, handleChange) => {
    const {maxLength, value, name} = event.target
    const fieldIndex = name.replace('code', '')

    const fieldIntIndex = Number(fieldIndex)

    if (value.length >= maxLength) {
      if (fieldIntIndex < 6) {
        const nextfield = document.querySelector(`input[name=code${fieldIntIndex + 1}]`)

        if (nextfield !== null) {
          nextfield.focus()
        }
      }
    }

    handleChange(event)
  }

  // const onResendSubmit = async () => {
  //   try {
  //     setLoading(true)
  //     // const resData = await publicLogin(codeMelli, phone)
  //     // console.log({resData})
  //     // goToVerify({
  //     //   codeMelli,
  //     //   phone,
  //     //   expired: +new Date() + 120000,
  //     // })
  //     setLoading(false)
  //   } catch (error) {
  //     console.log({error})
  //     setLoading(false)

  //     // setError('afterSubmit', { ...error, message: error?.response?.data?.message });
  //   }
  // }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}
      <Stack direction='row' spacing={2} justifyContent='center'>
        {Object.keys(values).map((name, index) => (
          <Controller
            key={name}
            name={`code${index + 1}`}
            control={control}
            render={({field}) => (
              <OutlinedInput
                {...field}
                id='field-code'
                autoFocus={index === 0}
                placeholder='-'
                onChange={(event) => handleChangeWithNextField(event, field.onChange)}
                inputProps={{
                  maxLength: 1,
                  sx: {
                    p: 0,
                    textAlign: 'center',
                    width: {xs: 36, sm: 56},
                    height: {xs: 36, sm: 56},
                  },
                }}
              />
            )}
          />
        ))}
      </Stack>

      <LoadingButton
        fullWidth
        size='large'
        type='submit'
        variant='contained'
        loading={isSubmitting}
        disabled={!isValid || !isActive}
        sx={{mt: 3}}
      >
        Verify
      </LoadingButton>
    </form>
  )
}
