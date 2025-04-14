import { cloneElement, forwardRef, isValidElement, useImperativeHandle, useState } from 'react';
import { Modal } from '@mui/material';

const ModalLayout = ({ children, sx, ...props }, ref) => {
  const [open, setOpen] = useState(null);
  const [useProps, setUseProps] = useState({});
  const [disableBackDropClose, setDisableBackdropClose] = useState(false);
  // const state=useSelector(state=>state)

  useImperativeHandle(ref, (...rest) => ({
    show: (show, prop, { disableBackDrop } = {}) => {
      setOpen(show);
      setDisableBackdropClose(disableBackDrop);
      setUseProps(prop);
      console.log({ rest });
    },
    hide() {
      setOpen(null);
    },
  }));

  const closeHandler = (e, reason) => {
    if (!disableBackDropClose) {
      setOpen(null);
    } else if (reason !== 'backdropClick') {
      setOpen(null);
    }
  };
  console.log({ children, useProps });

  const appendedChildren = () => {
    if (isValidElement(children)) {
      return cloneElement(children, {
        // Append new prop
        onClose: closeHandler,
        ...(useProps && useProps),
      });
    }
    return <>{children || ' '}</>;
  };
  return (
    <Modal
      open={!!open}
      onClose={closeHandler}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
      {...props}
    >
      {children ? appendedChildren() : <> </>}
    </Modal>
  );
};

export default forwardRef(ModalLayout);
