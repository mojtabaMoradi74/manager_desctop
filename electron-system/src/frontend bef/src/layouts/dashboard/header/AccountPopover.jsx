import {useSnackbar} from 'notistack'
import {useState} from 'react'
import {Link as RouterLink, useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
// @mui
import {alpha} from '@mui/material/styles'
import {Box, Divider, Typography, Stack, MenuItem} from '@mui/material'
// routes
import {routes, PATH_AUTH} from '../../../routes/paths'
// hooks
import useAuth from '../../../hooks/useAuth'
import useIsMountedRef from '../../../hooks/useIsMountedRef'
// components
import MyAvatar from '../../../components/MyAvatar'
import MenuPopover from '../../../components/MenuPopover'
import {IconButtonAnimate} from '../../../components/animate'

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: routes.user.profile,
  },
  {
    label: 'Settings',
    linkTo: routes.user.account,
  },
]

// ----------------------------------------------------------------------

export default function AccountPopover({isPublic}) {
  const navigate = useNavigate()

  const admin = useSelector((store) => store.admin.data)

  const {user, logout} = useAuth()

  const isMountedRef = useIsMountedRef()

  const {enqueueSnackbar} = useSnackbar()

  const [open, setOpen] = useState(null)

  const handleOpen = (event) => {
    setOpen(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(null)
  }

  const handleLogout = async () => {
    try {
      await logout()
      if (!isPublic) navigate(PATH_AUTH.login, {replace: true})

      if (isMountedRef.current) {
        handleClose()
      }
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Unable to logout!', {variant: 'error'})
    }
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
        }}
        onClick={handleOpen}
      >
        <Box>
          {' '}
          <Typography
            sx={{
              fontSize: '12px',
            }}
          >
            {admin?.name
              ? `${admin?.name} ${admin?.last_name}`
              : admin?.code_melli || admin?.phone || admin?.email}
          </Typography>
          {admin?.role ? (
            <Typography
              sx={{
                fontSize: '12px',
                color: 'secondary.main',
              }}
            >
              {admin?.role?.title}
            </Typography>
          ) : (
            ''
          )}
        </Box>
        <IconButtonAnimate
          sx={{
            p: 0,
            ...(open && {
              '&:before': {
                zIndex: 1,
                content: "''",
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
              },
            }),
          }}
        >
          <MyAvatar />
        </IconButtonAnimate>
      </Box>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{my: 1.5, px: 2.5}}>
          <Typography variant='subtitle2' noWrap>
            {/* {admin?.email?.split("@")?.[0] || "Admin"} */}
            {/* ادمین */}
            {admin?.name
              ? `${admin?.name} ${admin?.last_name}`
              : admin?.code_melli || admin?.phone || admin?.email}
          </Typography>
          <Typography variant='body2' sx={{color: 'text.secondary'}} noWrap>
            {admin?.role?.title || ''}
            {/* {admin?.role?.title || 'بدون نقش'} */}
          </Typography>
        </Box>

        <Divider sx={{borderStyle: 'dashed'}} />

        {/* <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack> */}

        <Divider sx={{borderStyle: 'dashed'}} />

        <MenuItem onClick={handleLogout} sx={{m: 1, color: 'red'}}>
          Exit
        </MenuItem>
      </MenuPopover>
    </>
  )
}
