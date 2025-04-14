import {useState} from 'react'
import PropTypes from 'prop-types'
// @mui
import {styled} from '@mui/material/styles'
import {List, Box, ListSubheader} from '@mui/material'
//
import {NavListRoot} from './NavList'
import {hasAccess} from '../../../permission/utiles'

// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props) => (
  <ListSubheader disableSticky disableGutters {...props} />
))(({theme}) => ({
  ...theme.typography.overline,
  paddingTop: theme.spacing(3),
  paddingLeft: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}))

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  isCollapse: PropTypes.bool,
  navConfig: PropTypes.array,
}

export default function NavSectionVertical({navConfig, isCollapse = false, ...other}) {
  const [open, setOpen] = useState()

  return (
    <Box
      sx={
        {
          // bgcolor: '#fff',
        }
      }
      {...other}
    >
      {navConfig?.map((group) => (
        <List key={group.subheader} disablePadding sx={{px: 2}}>
          {/* <ListSubheaderStyle
            sx={{
              ...(isCollapse && {
                opacity: 0,
              }),
            }}
          >
            {group.subheader}
          </ListSubheaderStyle> */}

          {group.items.map((list, i) => (
            <>
              {hasAccess(list?.permission, list?.type) && (
                <>
                  <NavListRoot
                    key={list.title}
                    list={list}
                    isCollapse={isCollapse}
                    open={open?.[i]}
                    setOpen={(x) => setOpen({[i]: x})}
                  />
                </>
              )}
            </>
          ))}
        </List>
      ))}
    </Box>
  )
}
