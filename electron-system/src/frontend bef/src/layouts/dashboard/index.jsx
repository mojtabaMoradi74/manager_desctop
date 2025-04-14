import {useState} from 'react'
import {Outlet} from 'react-router-dom'
// @mui
import {styled} from '@mui/material/styles'
import {Box} from '@mui/material'
// hooks
import useSettings from '../../hooks/useSettings'
import useResponsive from '../../hooks/useResponsive'
import useCollapseDrawer from '../../hooks/useCollapseDrawer'
// config
import {HEADER, NAVBAR} from '../../config'
//
import DashboardHeader from './header'
import NavbarVertical from './navbar/NavbarVertical'
import NavbarHorizontal from './navbar/NavbarHorizontal'

// ----------------------------------------------------------------------

const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})(({collapseClick, theme}) => ({
  flexGrow: 1,
  paddingTop: HEADER.MOBILE_HEIGHT + 24,
  paddingBottom: HEADER.MOBILE_HEIGHT + 24,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
    height: `100vh`,
    overflow: 'auto',
    transition: theme.transitions.create('margin-left', {
      duration: theme.transitions.duration.shorter,
    }),
    ...(collapseClick && {
      marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
    }),
    // Custom scrollbar styles
    '&::-webkit-scrollbar': {
      width: '3px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      '&:hover': {
        background: '#555',
      },
    },
    // Custom scrollbar styles for Firefox
    '&': {
      scrollbarWidth: 'thin', // Firefox only property
      scrollbarColor: `#888 #f1f1f1`, // thumb color track color
    },
    '&::-moz-scrollbar': {
      width: '3px',
    },
    '&::-moz-scrollbar-track': {
      background: '#f1f1f1',
    },
    '&::-moz-scrollbar-thumb': {
      background: '#888',
      '&:hover': {
        background: '#555',
      },
    },
  },
}))

// ----------------------------------------------------------------------

export default function DashboardLayout(props) {
  const {collapseClick, isCollapse} = useCollapseDrawer()

  const {themeLayout} = useSettings()

  const isDesktop = useResponsive('up', 'lg')

  const [open, setOpen] = useState(false)

  const verticalLayout = themeLayout === 'vertical'

  if (verticalLayout) {
    return (
      <>
        <DashboardHeader
          onOpenSidebar={() => setOpen(true)}
          verticalLayout={verticalLayout}
          {...props}
        />

        {isDesktop ? (
          <NavbarHorizontal {...props} />
        ) : (
          <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} {...props} />
        )}

        <Box
          component='main'
          sx={{
            px: {lg: 2},
            pt: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 80}px`,
            },
            pb: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 24}px`,
            },
          }}
        >
          <Outlet />
        </Box>
      </>
    )
  }

  return (
    <Box
      sx={{
        display: {lg: 'flex'},
        minHeight: {lg: 1},
      }}
    >
      <DashboardHeader isCollapse={isCollapse} onOpenSidebar={() => setOpen(true)} {...props} />

      <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} {...props} />

      <MainStyle collapseClick={collapseClick}>
        <Outlet />
      </MainStyle>
    </Box>
  )
}
