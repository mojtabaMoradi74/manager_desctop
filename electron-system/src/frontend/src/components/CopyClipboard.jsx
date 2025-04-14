import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Tooltip, TextField, IconButton, InputAdornment, Box, Typography, Button } from '@mui/material';
import { Copy } from 'iconsax-react';
import { copyText } from 'src/utils/common';
//

// ----------------------------------------------------------------------

CopyClipboard.propTypes = {
  value: PropTypes.string,
};

export default function CopyClipboard({ value, label, size }) {
  const [state, setState] = useState({
    value,
    copied: false,
  });

  const onCopy = (e) => {
    e.preventDefault();
    copyText(value);
    setState({ ...state, copied: true });
    setTimeout(() => {
      setState({ ...state, copied: false });
    }, 2000);
  };

  return (
    <Box className={'w-full'}>
      <Typography
        className="flex items-center gap-2"
        sx={{
          mb: 0,
          // color: "grey.700",
          fontSize: '0.8rem',
        }}
      >
        {label}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: '25px',
          }}
        >
          <Tooltip onClick={onCopy} className="bg-gray-50" title={state?.copied ? 'Copied' : 'Copy'}>
            <IconButton className="">
              <Copy size={'15'} />
            </IconButton>
          </Tooltip>
        </Box>
      </Typography>
    </Box>
  );
}
