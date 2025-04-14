import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// @mui
import { Tooltip, TextField, IconButton, InputAdornment, Box, Typography, Button } from '@mui/material';
//
import Iconify from './Iconify';

// ----------------------------------------------------------------------

CopyClipboard.propTypes = {
  value: PropTypes.string,
};

export default function CopyClipboard({ value, label, active }) {
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    value,
    copied: false,
  });

  const handleChange = (event) => {
    setState({ value: event.target.value, copied: false });
  };

  const onCopy = () => {
    setState({ ...state, copied: true });
    setTimeout(() => {
      setState({ ...state, copied: false });
    }, 2000);
    // if (state.value) {
    //   enqueueSnackbar('Copied!');
    // }
  };

  return (
    <Box>
      {label ? (
        <Typography
          sx={{
            mb: 1,
            color: 'grey.700',
            fontSize: '0.8rem',
          }}
        >
          {label}
        </Typography>
      ) : (
        ''
      )}
      <CopyToClipboard text={state.value} onCopy={onCopy}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          {active?.tooltip ? (
            <Tooltip title={state?.copied ? 'کپی شد' : 'کپی'}>
              <Box
                sx={{
                  bgcolor: 'grey.200',
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '8px',
                }}
              >
                <Box>{value}</Box>
                <IconButton>
                  <Iconify icon={'eva:copy-fill'} width={24} height={24} />
                </IconButton>
              </Box>
            </Tooltip>
          ) : (
            <Box
              sx={{
                bgcolor: 'grey.200',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                borderRadius: '8px',
              }}
            >
              <Box>{value}</Box>
              <IconButton>
                <Iconify icon={'eva:copy-fill'} width={24} height={24} />
              </IconButton>
              <Button variant={'contained'} color="success">
                {state?.copied ? 'کپی شد' : 'کپی'}
              </Button>
            </Box>
          )}
        </Box>
      </CopyToClipboard>
    </Box>
    // <TextField
    //   fullWidth
    //   value={state.value}
    //   onChange={handleChange}
    //   InputProps={{
    //     endAdornment: (
    //       <InputAdornment position="end">
    //         <CopyToClipboard text={state.value} onCopy={onCopy}>
    //           <Tooltip title="Copy">
    //             <IconButton>
    //               <Iconify icon={'eva:copy-fill'} width={24} height={24} />
    //             </IconButton>
    //           </Tooltip>
    //         </CopyToClipboard>
    //       </InputAdornment>
    //     ),
    //   }}
    //   {...other}
    // />
  );
}
