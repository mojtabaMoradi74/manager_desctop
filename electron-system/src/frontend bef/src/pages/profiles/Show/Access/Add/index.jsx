import { Box, Grid, Stack, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import RHFTextField from '../../../../../components/hook-form/RHFTextField';
import FormProvider from '../../../../../components/hook-form/FormProvider';

import validation from './validation';
// import RHFSelectStatic from '../../../components/hook-form/RHFSelectStatic';
import RHFSelector from '../../../../../components/hook-form/RHFSelector';
import RHFDatePicker from '../../../../../components/hook-form/RHFDatePicker';
import Enum from '../../../enum';
import { useMutationCustom, useQueryCustom } from '../../../../../utils/reactQueryHooks';
import axiosInstance from '../../../../../utils/axios';
import { fDateForApi } from '../../../../../utils/formatTime';
import { statusType } from '../../../../../enumeration/index';
import persianToEnglishNumber from '../../../../../utils/persianToEnglishNumber';
import { RHFCheckbox } from '../../../../../components/hook-form/RHFCheckbox';
import DashboardPermissions from './Dashboard';
import TravelsPermissions from './Travels';
import RemoveNullObjectValue from '../../../../../utils/RemoveNullObjectValue';
import api from '../../../../../services/api';
import SubmitComponent from './SubmitComponent';
import BasePermissions from './Base';

const AddCourse = ({ permissions, roleData, user, allPermissions, loading }) => {
  // const [disabled, setDisabled] = useState(false);
  const { Admin, Client, ...otherPermissions } = permissions || {};
  const queryParams = useParams();

  const { t } = useTranslation();

  const methods = useForm({
    resolver: yupResolver(validation.schema()),
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

  // ----------------------------------------------------------------------------- SERVICE
  const getting = async () => axiosInstance().get(`${api.role.base}/${user?.role?.id}`);
  const onSuccessData = (param) => {
    console.log('* * * onSuccessData :', { param });
    // param.data
    const resetData = {};
    param.data?.permission?.forEach((x) => (resetData[x.id] = true));
    console.log('* * * onSuccessData :', { resetData });

    reset(resetData);
  };
  // const roleData = useQueryCustom({
  //   name: `${Enum?.api?.base}_get_${queryParams.id}`,
  //   url: getting,
  //   enabled: !!user?.role?.id,
  //   onSuccess: onSuccessData,
  // });
  // ------------------------------------------------------------------------------ Mutation
  const updating = (params) => axiosInstance().put(`${api.role.base}/${roleData?.data?.id}`, params);

  const onSuccessMutating = () => {
    toast.success(t('successfully'));
    // navigate(backUrl);
  };

  const onErrorMutating = (error) => {
    console.log('* * * onErrorMutating :', { error });
    const errorTitle = error.response.data.message || t('errorTryAgain');
    const errors = Object.values(error?.response?.data?.errors || {});
    if (errors?.length) {
      errors?.map((x) => {
        return toast.error(x?.[0]);
      });
    } else toast.error(errorTitle);
  };

  const { isLoading, mutate } = useMutationCustom({
    url: updating,
    name: `${api.role.base}_update`,
    invalidQuery: `${api.role.base}_get`,
    onSuccess: onSuccessMutating,
    onError: onErrorMutating,
  });
  // ---------------------------------------

  const watchStartDate = watch(validation.fieldNames.startDate);
  console.log({ watchStartDate });
  const onSubmit = async () => {
    const values = getValues();
    const reqData = RemoveNullObjectValue(values);
    const finalData = {
      title: roleData?.data?.title,
      permissions: Object.keys(reqData),
    };
    // const formData = new FormData();
    // formData.append(`title`, roleData?.data?.title);
    // Object.keys(reqData || {})?.map((x) => {
    //   formData.append(`permissions[]`, x);
    // });
    mutate(finalData);
  };

  useEffect(() => {
    if (roleData) onSuccessData(roleData);
  }, [roleData]);

  console.log({ otherPermissions });

  const disabled = loading;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          gap: 3,
        }}
      >
        <DashboardPermissions admin={Admin} client={Client} {...{ disabled, loading }} />
        {otherPermissions?.[0] ? (
          <TravelsPermissions data={otherPermissions[0]} label={'حج عمره'} {...{ disabled, loading }} />
        ) : (
          ''
        )}
        {otherPermissions?.[1] ? (
          <TravelsPermissions data={otherPermissions[1]} label={'حج تمتع'} {...{ disabled, loading }} />
        ) : (
          ''
        )}
        {otherPermissions?.[2] ? (
          <TravelsPermissions data={otherPermissions[2]} label={'عتبات عالیات'} {...{ disabled, loading }} />
        ) : (
          ''
        )}
        {otherPermissions?.[3] ? (
          <TravelsPermissions data={otherPermissions[3]} label={'سفر های زیارتی دیگر'} {...{ disabled, loading }} />
        ) : (
          ''
        )}
        {otherPermissions?.University ? (
          <BasePermissions data={otherPermissions.University} label={'دانشگاه ها'} {...{ disabled, loading }} />
        ) : (
          ''
        )}
        {otherPermissions?.Message ? (
          <BasePermissions data={otherPermissions.Message} label={'پیام ها'} {...{ disabled, loading }} />
        ) : (
          ''
        )}
      </Box>

      <SubmitComponent
        isLoading={isLoading}
        onReset={() => onSuccessData(roleData)}
        roleData={roleData}
        allPermissions={allPermissions}
        disabled={disabled}
      />
    </FormProvider>
  );
};

export default AddCourse;
