import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { Box, Typography, Grid, Stack } from '@mui/material';

import { useMutationCustom } from '../../../../utils/reactQueryHooks';
import validation from './validation';
import api from '../../../../services/api';
import axiosInstance from '../../../../utils/axios';
import EForm from '../../enum';
import FormProvider from '../../../../components/hook-form/FormProvider';
import RHFTextField from '../../../../components/hook-form/RHFTextField';

const AddSection = ({ onClose, data }) => {
  const { t } = useTranslation();
  const { id } = useParams();

  const [selectedType, setSelectedType] = useState();

  const methods = useForm({
    resolver: yupResolver(validation.schema(selectedType?.value)),
    shouldUnregister: false,
    mode: 'all',
  });

  const {
    reset,
    watch,
    control,
    setValue,
    setError,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = methods;

  //---
  // const watchType = watch(validation.fieldNames.type);

  // ----------------------------------------------------------------------------- SERVICE
  const creating = (params) => axiosInstance().post(api.section.base, params);
  const updating = (params) => axiosInstance().put(`${api.section.base}/${data.id}`, params);
  // const getById = () => axiosInstance().get(`${api.input.base}/${data}`);
  // ------------------------------------------------------------------------------ Mutation
  const onSuccessMutating = () => {
    toast.success(t('successfully'));
    reset({
      [validation.fieldNames.label]: '',
    });
    onClose();
  };

  const onErrorMutating = (error) => {
    console.log({ error });
    const errorTitle = error.response.data.message || t('errorTryAgain');

    const errors = Object.values(error?.response?.data?.errors || {});
    if (errors?.length) {
      errors?.map((x) => {
        return toast.error(x?.[0]);
      });
    } else toast.error(errorTitle);
  };

  const { isLoading, mutate } = useMutationCustom({
    url: data ? updating : creating,
    name: `${api.section.base}_add`,
    invalidQuery: `${EForm.api.base}_get_${id}`,
    onSuccess: onSuccessMutating,
    onError: onErrorMutating,
  });
  // ---------------------------------------
  const onSuccessDataById = (resData) => {
    console.log({ resData });
    // reset(resetParam);
  };
  // const dataById = useQueryCustom({
  //   name: `getById_${Enum?.api?.base}_${data}`,
  //   url: getById,
  //   onSuccess: onSuccessDataById,
  //   enabled: !!data,
  // });

  const onSubmit = async () => {
    const values = getValues();

    const reqData = {
      [validation.fieldNames.label]: values[validation.fieldNames.label],
    };

    if (!data) reqData.form_id = id;

    console.log({ reqData, values });

    // const formData = new FormData();

    // Object.keys(reqData).forEach((key) => {
    //   formData.append(key, reqData[key]);
    // });

    mutate(reqData);
  };

  useEffect(() => {
    if (!data) return;
    const { options: dataOptions, ...resetData } = data || {};
    // let resetParam = {};
    const { required, ...options } = JSON.parse(dataOptions || `{}`) || {};
    console.log('* * * AddSection : ', { options, data, required });
    // switch (data?.type) {
    //   case formTypesObject.NUMBER.value:
    //     resetParam = {
    //       min: null,
    //       max: null,
    //     };
    //     break;

    //   default:
    //     break;
    // }
    const resetParam = {
      label: data?.label,
    };
    console.log('* * * AddSection : ', { resetParam });

    reset(resetParam);
  }, [data]);

  const values = getValues();

  console.log('* * * AddSection : ', { data, values });
  const label = `شما در حال ${!data ? 'ایجاد' : 'ویرایش'} دسته سوال ${data?.label || ' '} هستید`;

  return (
    <Box
      sx={{
        width: '100%',
        // maxWidth: '750px',
        // display: { xs: 'block', md: 'flex' },
        gap: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        p: 4,
        m: 4,
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography>{label}</Typography>
          </Box>
          <RHFTextField name={validation.fieldNames.label} label={selectedType?.title} />

          <Grid
            container
            // sx={{
            //   display: 'flex',
            //   // justifyContent: 'flex-end',
            //   justifyContent: 'space-between',
            //   alignItems: 'center',
            // }}
          >
            <Grid
              item
              md={6}
              xs={12}
              sx={{
                display: 'flex',
                mt: 3,
                gap: 3,
                // maxWidth: '400px',
              }}
            >
              <LoadingButton
                fullWidth
                // type="click"
                variant="contained"
                loading={isLoading}
                color="grey"
                onClick={onClose}
              >
                {'لغو'}
              </LoadingButton>

              <LoadingButton fullWidth type="submit" variant="contained" loading={isLoading}>
                {'تایید'}
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default AddSection;
