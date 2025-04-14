import * as Yup from 'yup'
import {useState} from 'react'
import {Link as RouterLink, useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux'
// form
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
// @mui
import {Link, Stack, Alert, IconButton, InputAdornment} from '@mui/material'
import {LoadingButton} from '@mui/lab'
// routes
import {PATH_AUTH, routes} from '../../../../routes/paths'
// hooks
import useAuth from '../../../../hooks/useAuth'
import useIsMountedRef from '../../../../hooks/useIsMountedRef'
// components
import Iconify from '../../../../components/Iconify'
import {FormProvider, RHFTextField, RHFCheckbox} from '../../../../components/hook-form'
import {getAdminProfile} from '../../../../redux/slices/user'
import errorsText from '../../../../utils/errorsText'

// ----------------------------------------------------------------------

export default function LoginFormPublic({goToVerify}) {
  const {publicLogin} = useAuth()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isMountedRef = useIsMountedRef()

  const [showPassword, setShowPassword] = useState(false)

  const LoginSchema = Yup.object().shape({
    code_melli: Yup.string().required(errorsText.blankError()),
    phone: Yup.string().required(errorsText.blankError()),
    // password: Yup.string().required(errorsText.blankError()),
  })

  const defaultValues = {
    // email: 'admin@gmail.com',
    code_melli: '',
    phone: '',
  }

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  })

  const {
    reset,
    setError,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = methods

  const onSubmit = async (data) => {
    try {
      console.log({data})
      const resData = await publicLogin(data.code_melli, data.phone)
      console.log({resData})
      goToVerify({
        phone: data.phone,
        codeMelli: data.code_melli,
        expireDate: +new Date() + 120000,
      })
      // dispatch(getAdminProfile());
      // navigate(routes.auth.verify)
    } catch (error) {
      console.log({error})
      // reset();
      // if (isMountedRef.current) {
      setError('afterSubmit', {...error, message: error?.response?.data?.message})
      // }
    }
  }
  console.log({errors})

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}

        <RHFTextField name={'code_melli'} label='username' />

        <RHFTextField
          name='phone'
          label='password'
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
          Forgot password?
        </Link>
      </Stack> */}

      <LoadingButton
        fullWidth
        size='large'
        type='submit'
        color='success'
        variant='contained'
        loading={isSubmitting}
        sx={{mt: 2}}
      >
        ورود
      </LoadingButton>
    </FormProvider>
  )
}
