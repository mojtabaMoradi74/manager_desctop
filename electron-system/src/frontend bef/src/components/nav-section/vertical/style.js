// @mui
import {alpha, styled} from '@mui/material/styles'
import {ListItemText, ListItemButton, ListItemIcon} from '@mui/material'
// config
import {ICON, NAVBAR} from '../../../config'

// ----------------------------------------------------------------------

export const ListItemStyle = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'activeRoot' && prop !== 'activeSub' && prop !== 'subItem',
})(({activeRoot, activeSub, subItem, isChildren, theme}) => ({
  ...theme.typography.body1,
  position: 'relative',
  height: NAVBAR.DASHBOARD_ITEM_ROOT_HEIGHT,
  textTransform: 'capitalize',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1.5),
  marginBottom: theme.spacing(0.5),
  // color: theme.palette.grey[800],
  borderRadius: theme.shape.borderRadius,
  // p: 1,
  // border: '1px solid',
  // activeRoot
  ...(activeRoot && {
    ...theme.typography.subtitle2,
    color: theme.palette.grey[100],
    backgroundColor: theme.palette.grey[800],
    '&:hover': {
      color: theme.palette.grey[100],
      backgroundColor: theme.palette.grey[800],
    },
    // backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
  }),
  // activeSub
  ...(activeSub && {
    // color: theme.palette.text.primary,
    // color: theme.palette.grey[900],
    ...(isChildren
      ? {
          backgroundColor: theme.palette.grey[800],
          '&:hover': {
            color: theme.palette.grey[100],
            backgroundColor: theme.palette.grey[800],
          },
        }
      : {
          backgroundColor: theme.palette.grey[300],
          color: theme.palette.grey[900],
          '&:hover': {
            color: theme.palette.grey[900],
            backgroundColor: theme.palette.grey[300],
          },
        }),
  }),
  // subItem
  ...(subItem && {
    ...theme.typography.subtitle2,
    fontWeight: '300',
    height: NAVBAR.DASHBOARD_ITEM_SUB_HEIGHT,
    marginLeft: '30px',
  }),
}))

export const ListItemTextStyle = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== 'isCollapse',
})(({isCollapse, theme}) => ({
  whiteSpace: 'nowrap',
  fontSize: '16px',
  transition: theme.transitions.create(['width', 'opacity'], {
    duration: theme.transitions.duration.shorter,
  }),
  ...(isCollapse && {
    width: 0,
    opacity: 0,
  }),
}))

export const ListItemIconStyle = styled(ListItemIcon)({
  width: ICON.NAVBAR_ITEM,
  height: ICON.NAVBAR_ITEM,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {width: '100%', height: '100%'},
})

export const ListCircleItemIconStyle = styled(ListItemIcon)(({active, theme}) => ({
  width: '15px',
  height: '15px',
  display: 'flex',
  borderRadius: '100%',
  background: active ? theme.palette.grey[900] : 'transparent',
  border: '3px solid',
  borderColor: active ? theme.palette.grey[900] : '#7a7a7a7a',
}))
