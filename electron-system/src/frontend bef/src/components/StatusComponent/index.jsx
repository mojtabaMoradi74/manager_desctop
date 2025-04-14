import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'
import {Chip} from '@mui/material'
import Check from '@mui/icons-material/Check'
import {StatusData} from './types'

const StatusComponent = ({param, data, status, size = 'small', style = {}, onClick}) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const statusData = React.useMemo(() => {
    return status || Object.values(StatusData)
  }, [])

  const selectedStatus = status?.find((x) => x.value === data) || StatusData[data]
  return (
    <div>
      <Chip
        label={selectedStatus?.label || selectedStatus?.value}
        color={selectedStatus?.bg || 'default'}
        size={size}
        sx={{minWidth: '70px', textAlign: 'center', textTransform: 'capitalize'}}
        style={style}
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      />
      <Menu
        id='fade-menu'
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        // sx={{
        //   width: '150px',
        // }}
      >
        {statusData?.map((x) => (
          <MenuItem
            disabled={data === x?.value}
            onClick={() => {
              onClick({data: [param], status: x})
              handleClose()
            }}
            sx={{
              width: '150px',
              gap: 2,
            }}
            color={selectedStatus?.value === x?.value ? x?.bg : 'default'}
          >
            <div className='w-[20px]'>
              {selectedStatus?.value === x?.value ? <Check fontSize='small' /> : ''}
            </div>
            {x.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default StatusComponent
