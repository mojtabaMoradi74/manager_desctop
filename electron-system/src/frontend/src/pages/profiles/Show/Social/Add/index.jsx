import { Box, Grid, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { uniqueId } from 'lodash';
import AddableFormSocial from 'src/pages/caravansManagement/Add/AddableFormSocial';

import FormProvider from '../../../../../components/hook-form/FormProvider';

import validation from './validation';
// import RHFSelectStatic from '../../../../../components/hook-form/RHFSelectStatic';
//
import Enum from '../../../enum';
import { useMutationCustom, useQueryCustom } from '../../../../../utils/reactQueryHooks';
import axiosInstance from '../../../../../utils/axios';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import WaitingBox from '../../../../../components/WaitingBox/index';
// import AddableFormSocial from '../../../Add/AddableFormSocial/index';

const Add = ({ onClose }) => {
  const { t } = useTranslation();
  const queryParams = useParams();
  const paramId = queryParams?.id;

  const navigate = useNavigate();

  const getById = () => axiosInstance().get(`${Enum?.api?.base}/${queryParams.id}`);

  const caravanById = useQueryCustom({
    name: `get_by_Id_${Enum?.api?.base}_${queryParams.travel}_${queryParams.id}`,
    url: getById,
    enabled: !!queryParams.id,
  });

  const caravan = caravanById?.data?.data;

  // const backUrl = `${Enum.routes.root(queryParams.type, queryParams.travel)}`;
  const backUrl = `${Enum.routes.root(queryParams.type, queryParams.travel)}/show/${queryParams.id}/${
    Enum.enumTab.object.social.value
  }`;
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
  const creating = (params) => axiosInstance().post(Enum?.api?.base, params);
  const updating = (params) => axiosInstance().put(`${Enum?.api?.base}/${paramId}`, params);
  const getting = async () => axiosInstance().get(`${Enum.api.social}`, { params: { team_id: queryParams.id } });

  // ------------------------------------------------------------------------------ Mutation
  const onSuccessMutating = () => {
    toast.success(t('successfully'));
    navigate(backUrl);
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
    name: `${Enum?.api?.base}_update`,
    invalidQuery: `${Enum?.api?.base}_get`,
    onSuccess: onSuccessMutating,
    onError: onErrorMutating,
  });
  // ---------------------------------------
  const onSuccess = (resData) => {
    console.log('* * * onSuccess', { resData });

    const resetData = {
      // [validation.fieldNames.socials]: socialSelector.convertor.object(resData?.data?.socials),

      [validation.fieldNames.socials]: !resData?.data?.data?.length
        ? [{ keyId: uniqueId() }]
        : resData?.data?.data?.map((x) => ({
            ...x,
            teamSocialId: x.id,
            social: { label: x.social.title, value: x.social.id },
          })),
    };
    console.log('* * * onSuccess', { resetData });
    reset(resetData);
    //
  };
  const dataById = useQueryCustom({
    name: `${Enum.api.social}_get_${queryParams.id}`,
    url: getting,
    onSuccess: onSuccess,
  });

  // const watchStartDate = watch(validation.fieldNames.startDate);
  // console.log({ watchStartDate });
  const onSubmit = async () => {
    const values = getValues();
    console.log('* * * onSubmit : ', { values });

    const reqData = {
      // [validation.fieldNames.travel_id]: queryParams.travel,
      // [validation.fieldNames.socials]: values[validation.fieldNames.socials]?.map((x) => x.value),
    };

    values[validation.fieldNames.socials]?.forEach((x, i) => {
      // reqData[validation.fieldNames.socials] = reqData[validation.fieldNames.socials] || [];
      reqData[`${validation.fieldNames.socials}[${i}][id]`] = x.social?.value;
      reqData[`${validation.fieldNames.socials}[${i}][link]`] = x?.link;
      // reqData[`${validation.fieldNames.socials}[${i}][team_social_id]`] = x?.teamSocialId || '';
    });

    const formData = new FormData();
    Object.keys(reqData || {})?.map((x) => {
      formData.append(x, reqData[x]);
    });

    console.log('* * * onSubmit : ', { reqData, values });
    mutate(formData);
  };

  console.log({ queryParams, dataById });

  const title = ` کاروان ${caravan?.id || ''} - ${caravan?.province?.name || ''} `;

  return dataById.isLoading ? (
    <WaitingBox />
  ) : (
    <Box
      sx={{
        width: '100%',
        // display: { xs: 'block', md: 'flex' },
        gap: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        p: 4,
      }}
    >
      <HeaderBreadcrumbs back={backUrl} heading={title}>
        <Typography sx={{ mt: 1 }}>{`لینک و نوع شبکه اجتماعی را انتخاب کنید`}</Typography>
      </HeaderBreadcrumbs>
      {/* <Box
        sx={{
          textAlign: 'center',
          mb: '30px',
        }}
        onClick={() => navigate(backUrl)}
      >
        <Typography variant="h5">{'شما در حال ایجاد یک دوره جدید هستید!'}</Typography>
      </Box> */}

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {/* <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <socialSelector.Element
                name={validation.fieldNames.socials}
                label={'لینک و نوع شبکه اجتماعی را انتخاب کنید'}
              />
            </Grid>
          </Grid> */}

          <AddableFormSocial disableText />
        </Box>

        <Box
          sx={{
            display: 'flex',
            mt: 3,
            gap: 3,
            justifyContent: 'center',
          }}
        >
          {/* <LoadingButton
            fullWidth
            // type="click"
            variant="outlined"
            color="success"
            loading={isLoading}
            onClick={onClose}
          >
            {'لغو'}
          </LoadingButton> */}

          <LoadingButton disabled type="submit" variant="contained" color={'success'} loading={isLoading}>
            {'ذخیره'}
          </LoadingButton>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default Add;
