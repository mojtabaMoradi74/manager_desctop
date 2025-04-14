import * as React from 'react'
import Popover from '@mui/material/Popover'
import {IconButton} from '@mui/material'
import {Link} from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {useTranslation} from 'react-i18next'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import {StatusData} from '../StatusComponent/types'
import Iconify from '../Iconify'

const TableActions = ({route, param, onClick, active, onClose, supplementIds, ...props}) => {
  supplementIds = supplementIds || []
  supplementIds.unshift(param?.id)

  console.log({supplementIds})
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const {t} = useTranslation()

  return (
    <div>
      <IconButton aria-describedby={id} onClick={handleClick}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Paper sx={{width: 200, maxWidth: '100%'}} onClick={handleClose}>
          <div className='px-[20px] py-[10px]'>{t('actions')}</div>
          <Divider />
          <MenuList>
            {active?.update || true ? (
              <Link to={route?.editing(...supplementIds)}>
                <MenuItem>
                  <ListItemIcon>
                    <EditIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>{t('edit')}</ListItemText>
                </MenuItem>
              </Link>
            ) : (
              ''
            )}
            {/* {active?.duplicate || true ? (
            <MenuItem disabled={active.duplicate?.disabled}>
              <ListItemIcon>
                <ContentCopy fontSize='small' />
              </ListItemIcon>
              <ListItemText>{active.duplicate?.label || t('duplicate')}</ListItemText>
            
            </MenuItem>
          ) : (
            ''
          )} */}

            {/* <Divider /> */}
            {active?.delete || true ? (
              <MenuItem onClick={() => onClick({data: [param], status: StatusData.delete})}>
                <ListItemIcon>
                  <DeleteIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText>{t('delete')}</ListItemText>
              </MenuItem>
            ) : (
              ''
            )}
          </MenuList>
        </Paper>
      </Popover>
    </div>
  )
}

export default TableActions
