import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useWatch, useFormContext } from 'react-hook-form';

const SubmitComponent = ({ onReset, roleData, disabled, isLoading, allPermissions }) => {
  const { control } = useFormContext();

  const forms = useWatch({ control });
  const formArray = Object.keys(forms || {})?.filter((x) => forms[x]);
  //   const isChange = roleData?.data?.permission?.length !== formArray?.length;

  const isChangedAdded = formArray?.filter((x) => !roleData?.data?.permission?.some((y) => y.id === +x));
  const isChangedLower = roleData?.data?.permission?.filter((x) => !forms[x.id]);
  const isChange = !!(isChangedLower?.length || isChangedAdded?.length);

  // console.log('* * * SubmitComponent : ', { isChange, isChangedLower, isChangedAdded });
  // console.log('* * * SubmitComponent : ', { forms, roleData }, formArray?.length, roleData?.data?.permission?.length);

  return isChange ? (
    <Box
      sx={{
        display: 'flex',
        mt: 3,
        gap: 3,
        justifyContent: 'flex-end',
      }}
    >
      <>
        <LoadingButton
          sx={{
            minWidth: '200px',
          }}
          // type="click"
          variant="outlined"
          color="success"
          onClick={onReset}
          disabled={disabled || isLoading}
        >
          {'لغو'}
        </LoadingButton>
        <LoadingButton
          sx={{
            minWidth: '200px',
          }}
          type="submit"
          variant="contained"
          color={'success'}
          loading={isLoading}
          disabled={disabled}
        >
          {'ذخیره'}
        </LoadingButton>
      </>
    </Box>
  ) : (
    <></>
  );
};

export default SubmitComponent;
