import { useSnackbar } from 'notistack';

export const useNotification = () => {
  const { enqueueSnackbar } = useSnackbar();
  
  const showError = (message) => {
      enqueueSnackbar(message, { variant: 'error' });
    };
    
    
    return { showError };
};

export const ShowNotistack = (message) => {
    const { enqueueSnackbar } = useSnackbar();
    enqueueSnackbar(message, { variant: 'error' });
}
