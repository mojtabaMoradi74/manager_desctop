import {Link as RouterLink, useNavigate} from 'react-router-dom'
// @mui
import {styled} from '@mui/material/styles'
import {Box, Button, Link, Container, Typography} from '@mui/material'
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout'
// routes
import {PATH_AUTH} from '../../routes/paths'
// components
import Page from '../../components/Page'
import Iconify from '../../components/Iconify'
// sections
import {VerifyCodeForm} from '../../sections/auth/verify-code'
import {useEffect, useState} from 'react'
import useTimer from 'src/hooks/useTimer'
import {tokenMsAge} from 'src/utils/jwt'
import tokenSlice from 'src/redux/slices/token'
import {getAdminProfile} from 'src/redux/slices/user'
import axiosInstance from 'src/utils/axios'
import {useDispatch} from 'react-redux'
import {routes} from 'src/routes/paths'
import api from 'src/services/api.jsx'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({theme}) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0),
}))

// ----------------------------------------------------------------------

export default function VerifyCode({goToLogin, expired, email}) {
  const {handleStart, timer, isActive} = useTimer()
  const [loading, setLoading] = useState()
  useEffect(() => {
    if (expired) handleStart((+new Date(expired) - +new Date()) / 1000)
  }, [email])

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    try {
      const code = Object.values(data).join('')
      console.log('* * * onSubmit :', {code, data})

      // enqueueSnackbar('Verify success!');
      const response = await axiosInstance().post(api.code.verify, {
        code: code,
        email: email,
      })
      console.log({response})

      // response?.data?.result
      const accessToken = response.data?.result?.accessToken
      const refreshToken = response.data?.result?.refreshToken

      // const exTimeAccess = Math.abs(Math.floor(tokenMsAge(accessToken)?.s))
      // const exTimeRefresh = Math.abs(Math.floor(tokenMsAge(refreshToken)?.s))
      const exTimeAccess = tokenMsAge(accessToken)?.expTime
      const exTimeRefresh = tokenMsAge(refreshToken)?.expTime

      // dispatch(tokenSlice.actions.setRefresh({token: refreshToken, expiresAt: exTimeRefresh}))
      // dispatch(tokenSlice.actions.setAccess({token: accessToken, expiresAt: exTimeAccess}))
      dispatch(
        tokenSlice.actions.setData({
          access: {token: accessToken, expiresAt: exTimeAccess},
          refresh: {token: refreshToken, expiresAt: exTimeRefresh},
        })
      )

      dispatch(getAdminProfile({token: accessToken}))
      navigate(routes.root, {replace: true})
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Page title='Verify' sx={{height: 1}}>
      <RootStyle>
        <LogoOnlyLayout />

        <Container>
          <Box sx={{maxWidth: 480, mx: 'auto'}}>
            <Button
              size='small'
              // component={RouterLink}
              // to={PATH_AUTH.login}
              startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} width={20} height={20} />}
              sx={{mb: 3}}
              onClick={goToLogin}
            >
              Back
            </Button>

            <Typography variant='h3' paragraph>
              Please check your email!
            </Typography>
            <Typography sx={{color: 'text.secondary'}}>
              We have emailed a 4-digit confirmation code to acb@domain, please enter the code in
              below box to verify your email.
            </Typography>

            <Box sx={{mt: 5, mb: 3}}>
              <VerifyCodeForm {...{onSubmit, isActive}} />
            </Box>
            {isActive ? (
              <Box
                sx={{
                  cursor: 'pointer',
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {`Remaining time: ${timer?.minutes}:${timer.seconds}`}
              </Box>
            ) : (
              <Typography variant='body2' align='center'>
                Don’t have a code? &nbsp;
                <Link variant='subtitle2' underline='none' onClick={() => {}}>
                  Resend code
                </Link>
              </Typography>
            )}
          </Box>
        </Container>
      </RootStyle>
    </Page>
  )
}
