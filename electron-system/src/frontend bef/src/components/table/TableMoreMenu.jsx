import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Box, IconButton } from '@mui/material';
//
import Iconify from '../Iconify';
import MenuPopover from '../MenuPopover';

// ----------------------------------------------------------------------

TableMoreMenu.propTypes = {
  actions: PropTypes.node,
  open: PropTypes.object,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
};

export default function TableMoreMenu({ actions }) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((p) => !p);

  return (
    <Box
      sx={{
        position: 'relative',
      }}
    >
      <IconButton onClick={handleToggle}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleToggle}
        // anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        // transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        // arrow="right-top"
        // sx={{
        //   mt: -1,
        //   width: 160,
        //   '& .MuiMenuItem-root': {
        //     px: 1,
        //     typography: 'body2',
        //     borderRadius: 0.75,
        //     '& svg': { mr: 2, width: 20, height: 20 },
        //   },
        // }}
      >
        {actions}
      </MenuPopover>
    </Box>
  );
}
