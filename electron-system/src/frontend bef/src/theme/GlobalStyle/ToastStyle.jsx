// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';
// utils

// ----------------------------------------------------------------------

export default function ToastStyle() {
  const theme = useTheme();

  return (
    <GlobalStyles
      styles={{
        '&.siteTempToast': {
          fontFamily: theme.typography.fontFamily,
        },
      }}
    />
  );
}
