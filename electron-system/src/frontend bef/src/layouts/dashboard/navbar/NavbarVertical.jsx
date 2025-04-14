import PropTypes from 'prop-types'
import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'
// @mui
import {styled, useTheme} from '@mui/material/styles'
import {Box, Stack, Drawer} from '@mui/material'
// hooks
import useResponsive from '../../../hooks/useResponsive'
import useCollapseDrawer from '../../../hooks/useCollapseDrawer'
// utils
import cssStyles from '../../../utils/cssStyles'
// config
import {NAVBAR} from '../../../config'
// components
import Logo from '../../../components/Logo'
import Scrollbar from '../../../components/Scrollbar'
import {NavSectionVertical} from '../../../components/nav-section'
//
// import navConfig from './NavConfig';
import NavbarDocs from './NavbarDocs'
import NavbarAccount from './NavbarAccount'
import CollapseButton from './CollapseButton'
import {routes} from '../../../routes/paths'
import useNavConfig from './useNavConfig'
import useAuth from '../../../hooks/useAuth'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({theme}) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter,
    }),
  },
}))

// ----------------------------------------------------------------------

NavbarVertical.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
}

export default function NavbarVertical({isOpenSidebar, onCloseSidebar, isPublic}) {
  const closeSidebar = [
    // routes.record.list,
    // routes.tournament.list,
    // routes.reportage.publish.list,
    // routes.backlink.publish.list,
    // routes.systemLog.list,
    // routes.newsAgency.plans(""),
  ]

  const theme = useTheme()

  const navConfig = useNavConfig()

  const {pathname} = useLocation()

  const isDesktop = useResponsive('up', 'lg')

  const {isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave} =
    useCollapseDrawer()

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar()
    }

    if (closeSidebar.findIndex((item) => pathname.search(item) > -1) > -1) {
      if (!collapseClick) {
        onToggleCollapse()
      }
    } else if (collapseClick) {
      onToggleCollapse()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
          // bgcolor: '#fff',
        },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
          ...(isCollapse && {alignItems: 'center'}),
        }}
      >
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <Logo link={isPublic ? routes.root : routes.root} />

          {isDesktop && !isCollapse && (
            <CollapseButton onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />
          )}
        </Stack>

        {/* <NavbarAccount isCollapse={isCollapse} /> */}
      </Stack>

      <NavSectionVertical navConfig={navConfig} isCollapse={isCollapse} />

      <Box sx={{flexGrow: 1}} />

      {/* {!isCollapse && <NavbarDocs />} */}
    </Scrollbar>
  )

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH : NAVBAR.DASHBOARD_WIDTH,
        },
        ...(collapseClick && {
          position: 'absolute',
        }),
      }}
    >
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{sx: {width: NAVBAR.DASHBOARD_WIDTH}}}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant='persistent'
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: NAVBAR.DASHBOARD_WIDTH,
              borderRightStyle: 'dashed',
              bgcolor: 'background.default',
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.standard,
                }),
              ...(isCollapse && {
                width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
              }),
              ...(collapseHover && {
                ...cssStyles(theme).bgBlur(),
                boxShadow: (theme) => theme.customShadows.z24,
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  )
}
