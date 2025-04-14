import * as Yup from 'yup'
// import { useSnackbar } from 'notistack';
import {Link, useNavigate} from 'react-router-dom'
import {useEffect, useState} from 'react'
import AutorenewIcon from '@mui/icons-material/Autorenew'
// form
import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
// @mui
import {useDispatch} from 'react-redux'
import {OutlinedInput, Stack, Box, Typography} from '@mui/material'
import {LoadingButton} from '@mui/lab'
// routes
import {routes} from '../../../../routes/paths'
import useAuth from '../../../../hooks/useAuth'
import {getAdminProfile} from '../../../../redux/slices/user'
import useTimer from '../../../../hooks/useTimer'

// ----------------------------------------------------------------------

export default function VerifyCodeForm({goToVerify, goToLogin, codeMelli, expireDate, phone}) {
  const navigate = useNavigate()
  const {publicLogin, publicVerify} = useAuth()
  const [loading, setLoading] = useState()
  const dispatch = useDispatch()

  const {handleStart, timer, isActive} = useTimer()

  console.log({expireDate, timer, isActive})
  useEffect(() => {
    if (expireDate) handleStart((+new Date(expireDate) - +new Date()) / 1000)
  }, [codeMelli, expireDate, phone])

  // const { enqueueSnackbar } = useSnackbar();

  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.string().nullable().required('Code is required'),
    code2: Yup.string().nullable().required('Code is required'),
    code3: Yup.string().nullable().required('Code is required'),
    code4: Yup.string().nullable().required('Code is required'),
    // code5: Yup.string().nullable().required('Code is required'),
    // code6: Yup.string().nullable().required('Code is required'),
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
    formState: {isSubmitting, isValid},
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

  const onSubmit = async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      const code = Object.values(data).join('')
      console.log('* * * onSubmit :', {code})

      // enqueueSnackbar('Verify success!');

      const resData = await publicVerify(codeMelli, code)
      console.log({resData})
      dispatch(getAdminProfile({isClient: true}))
      navigate(routes.root, {replace: true})
    } catch (error) {
      console.error(error)
    }
  }

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

  const onResendSubmit = async () => {
    try {
      setLoading(true)
      const resData = await publicLogin(codeMelli, phone)
      console.log({resData})
      goToVerify({
        codeMelli,
        phone,
        expireDate: +new Date() + 120000,
      })
      setLoading(false)
    } catch (error) {
      console.log({error})
      setLoading(false)

      // setError('afterSubmit', { ...error, message: error?.response?.data?.message });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          direction: 'rtl !important',
        }}
      >
        <Stack
          sx={{
            direction: 'rtl',
          }}
          direction='row'
          alignItems={'center'}
          spacing={2}
          gap={2}
          justifyContent='center'
        >
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
                  sx={{
                    mr: '0px !important',
                    ml: '0px !important',
                  }}
                  inputProps={{
                    maxLength: 1,
                    sx: {
                      p: 0,
                      textAlign: 'center',
                      width: {xs: 36, sm: 56},
                      height: {xs: 36, sm: 56},
                      mr: '0px !important',
                      ml: '0px !important',
                    },
                  }}
                />
              )}
            />
          ))}
        </Stack>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 3,
        }}
      >
        {loading ? (
          <Box
            sx={{
              cursor: 'pointer',
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <AutorenewIcon />
            {'Please waite !'}
          </Box>
        ) : isActive ? (
          <Box
            sx={{
              cursor: 'pointer',
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {`Remaining ${timer?.minutes}:${timer.seconds}`}
          </Box>
        ) : (
          <Box
            sx={{
              cursor: 'pointer',
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
            onClick={onResendSubmit}
          >
            <AutorenewIcon />
            {'ارسال مجدد'}
          </Box>
        )}

        {/* <Typography 
  onClick={goToLogin}
  sx={{
    cursor:"pointer",
color: 'text.secondary'
  }}>
  {"بازگشت"}
  </Typography> */}
      </Box>
      <LoadingButton
        fullWidth
        size='large'
        type='submit'
        variant='contained'
        color='success'
        loading={isSubmitting}
        disabled={!isValid || !isActive}
        sx={{mt: 3}}
      >
        {'ورود'}
      </LoadingButton>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 3,
        }}
      >
        <Typography>{/* {"ارسال مجدد"} */}</Typography>

        <Typography
          onClick={goToLogin}
          sx={{
            cursor: 'pointer',
            color: 'text.secondary',
          }}
        >
          {'بازگشت'}
        </Typography>
      </Box>
    </form>
  )
}
