// import * as React from 'react'
// import Popover from '@mui/material/Popover'
// import {IconButton} from '@mui/material'
// import Iconify from '../components/Iconify'

// export default function MoreItem(Component) {
//   return function WrappedComponent(props) {
//     const [anchorEl, setAnchorEl] = React.useState(null)

//     const handleClick = (event) => {
//       setAnchorEl(event.currentTarget)
//     }

//     const handleClose = () => {
//       setAnchorEl(null)
//     }

//     const open = Boolean(anchorEl)
//     const id = open ? 'simple-popover' : undefined

//     return (
//       <div>
//         <IconButton aria-describedby={id} onClick={handleClick}>
//           <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
//         </IconButton>

//         <Popover
//           id={id}
//           open={open}
//           anchorEl={anchorEl}
//           onClose={handleClose}
//           anchorOrigin={{
//             vertical: 'bottom',
//             horizontal: 'right',
//           }}
//         >
//           <Component {...props} onClose={handleClose} />
//         </Popover>
//       </div>
//     )
//   }
// }
