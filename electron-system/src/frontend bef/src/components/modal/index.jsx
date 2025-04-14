import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import {forwardRef, useImperativeHandle, useState} from 'react'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'card.dark' : 'background.paper'),
  boxShadow: 24,
  maxHeight: '95vh',
  overflowY: 'auto',
  borderRadius: 3,
  width: {xs: '95%', lg: 'auto'},
}

const AppModal = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false)
  const [component, setComponent] = useState(null)
  const [disableBackDropClose, setDisableBackdropClose] = useState(false)

  useImperativeHandle(ref, () => {
    let isOpen = false
    return {
      show(component, disableBackDropClose = false) {
        setComponent(component)
        setDisableBackdropClose(disableBackDropClose)
        setOpen(true)
        isOpen = true
      },
      hide() {
        setOpen(false)
        isOpen = false
      },
      isOpen() {
        return isOpen
      },
    }
  })

  const closeHandler = (e, reason) => {
    if (!disableBackDropClose || reason !== 'backdropClick') {
      ref?.current?.hide?.()
    }
  }

  return (
    <Modal open={open} onClose={closeHandler}>
      <Box sx={style}>{component}</Box>
    </Modal>
  )
})

export default AppModal
