import { CircularProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';

const WaitingBox = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
      }}
    >
      <CircularProgress />
      <Typography>{'Please waite !'}</Typography>
    </Box>
  );
};

export default WaitingBox;
