/* eslint-disable camelcase */
import PropTypes from 'prop-types'
import {useState} from 'react'
// @mui
import {useTheme} from '@mui/material/styles'
import {
  Avatar,
  Checkbox,
  TableRow,
  TableCell,
  Typography,
  MenuItem,
  Stack,
  Button,
} from '@mui/material'
// components
import Label from '../../../../components/Label'
import Iconify from '../../../../components/Iconify'
import {TableMoreMenu} from '../../../../components/table'
import {toPersianDate} from '../../../../utils/formatTime'
import {handleGenerateLink} from '../../../../utils'
import {hasAccess} from '../../../../permission/utiles'
import {newsAgencyPermission} from '../../../../permission'
import {HOST_API_STORAGE} from '../../../../config'
import Image from '../../../../components/Image'

// ----------------------------------------------------------------------

TableRowItems.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onAddReportage: PropTypes.func,
  onShowPlans: PropTypes.func,
}

export default function TableRowItems({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onAddReportage,
  onShowPlans,
}) {
  const theme = useTheme()

  const {title, thumbnails, images, _id, status, isHome, createdAt} = row

  const [openMenu, setOpenMenuActions] = useState(null)

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenuActions(null)
  }

  return (
    <TableRow
      hover
      selected={selected}
      sx={{
        borderBottom: `2px solid rgba(145, 158, 171, 0.08)`,
      }}
    >
      {/* <TableCell padding="checkbox">
        {id}
      </TableCell>
      <TableCell padding="checkbox">
        {first_name} {last_name}
      </TableCell> */}
      {/* <TableCell padding="checkbox">
        {username}
      </TableCell> */}

      <TableCell sx={{display: 'flex', alignItems: 'center'}}>
        <Image
          alt={title}
          src={thumbnails?.[0]?.location ? HOST_API_STORAGE + thumbnails?.[0]?.location : ''}
          sx={{borderRadius: 1.5, width: 48, height: 48, mr: 2}}
        />
        <Typography variant='subtitle2' noWrap sx={{mt: 0}}>
          {title}
        </Typography>
      </TableCell>

      <TableCell align='center'>
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(status === 'INACTIVE' && 'error') || 'success'}
          sx={{textTransform: 'capitalize'}}
        >
          {status}
        </Label>
      </TableCell>
      <TableCell align='center'>{isHome ? 'Yes' : 'No'}</TableCell>

      <TableCell align='left'>{createdAt && toPersianDate(createdAt)}</TableCell>

      {/* <Label
        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
        color={(status === 'banned' && 'error') || 'success'}
        sx={{ textTransform: 'capitalize' }}
      >
        {status}
      </Label> */}

      <TableCell align='right'>
        <Stack direction={'row'} gap={1} justifyContent={'end'}>
          <Button variant='contained' color='grey' onClick={onEditRow}>
            Edit
          </Button>
          <Button variant='contained' color='grey' onClick={onDeleteRow}>
            Delete
          </Button>
          {/* {hasAccess(newsAgencyPermission.update) &&
            <>
            </>
          }
          {hasAccess(newsAgencyPermission.update) &&
            <>
            </>
          } */}
        </Stack>

        {/* <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onShowPlans();
                  handleCloseMenu();
                }}
              // sx={{ color: 'error.main' }}
              >
                <Iconify icon={'mdi:show-outline'} />
                show
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                delete
              </MenuItem>
            </>
          }
        /> */}
      </TableCell>
    </TableRow>
  )
}
