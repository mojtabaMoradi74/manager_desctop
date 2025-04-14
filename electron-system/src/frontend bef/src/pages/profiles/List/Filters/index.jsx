import { useEffect } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RHFTextField from '../../../../components/hook-form/RHFTextField';
import FormProvider from '../../../../components/hook-form/FormProvider';

import validation from './validation';
// import RHFSelectStatic from '../../../components/hook-form/RHFSelectStatic';
import RHFSelector from '../../../../components/hook-form/RHFSelector';
import RHFDatePicker from '../../../../components/hook-form/RHFDatePicker';
import Enum from '../../../Course/enum';
import { useMutationCustom, useQueryCustom } from '../../../../utils/reactQueryHooks';
import axiosInstance from '../../../../utils/axios';
import { fDateForApi } from '../../../../utils/formatTime';
import { statusType } from '../../../../enumeration/index';
import persianToEnglishNumber from '../../../../utils/persianToEnglishNumber';
import ProvinceSelector from '../../../../components/selector/Province';
import CitySelector from '../../../../components/selector/City';
import UniversitySelector from '../../../university/selector';
import useQueryString from '../../../../utils/useQueryString';
import RemoveNullObjectValue from '../../../../utils/RemoveNullObjectValue';

const FiltersCaravanList = ({ onClose }) => {
  const paramId = undefined;
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const queryString = useQueryString();

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
  const watchProvince = watch(validation.fieldNames.province_id);

  // ---------------------------------------

  const watchStartDate = watch(validation.fieldNames.startDate);
  console.log({ watchStartDate });

  const changeUrl = (params) => ({
    pathname: location.pathname,
    search: new URLSearchParams(RemoveNullObjectValue({ ...queryString, ...params })).toString(),
  });
  const navigateUrl = (obj) => navigate(changeUrl(obj));

  const onSubmit = async () => {
    const values = getValues();
    const province = values[validation.fieldNames.province_id];
    const city = values[validation.fieldNames.city_id];
    const university = values[validation.fieldNames.university_id];
    const reqData = {
      ...(values[validation.fieldNames.code_melli] && { code_melli: values[validation.fieldNames.code_melli] }),

      province:
        province &&
        JSON.stringify({
          label: province?.data?.name || province?.label,
          value: province?.data?.id || province?.value,
        }),

      city: city && JSON.stringify({ label: city?.data?.name || city?.label, value: city?.data?.id || city?.value }),

      university:
        university &&
        JSON.stringify({
          label: university?.data?.name || university?.label,
          value: university?.data?.id || university?.value,
        }),
    };

    console.log('* * * onSubmit : ', { reqData, values });
    navigateUrl(reqData);
  };

  useEffect(() => {
    const province = queryString.province ? JSON.parse(queryString.province || '') : null;
    const city = queryString.city ? JSON.parse(queryString.city || '') : null;
    const university = queryString.university ? JSON.parse(queryString.university || '') : null;

    const resetData = {
      [validation.fieldNames.province_id]: province,
      [validation.fieldNames.city_id]: city,
      [validation.fieldNames.university_id]: university,
      code_melli: queryString.code_melli,
    };

    console.log({ queryString, resetData });

    reset(resetData);
  }, [location]);

  return (
    <Accordion
      sx={{
        gap: 2,
        mb: 4,
        p: 0,
      }}
    >
      <AccordionSummary
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 3,
          backgroundColor: 'background.neutral',
          borderRadius: '8px',
        }}
        expandIcon={<ArrowDropDownIcon />}
      >
        {'فیلتر های جستجو'}
      </AccordionSummary>

      <AccordionDetails>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              mt: 3,
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <RHFTextField name={validation.fieldNames.code_melli} label={'جستجوی شماره ملی'} />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ProvinceSelector.Element
                  onChange={() => setValue(validation.fieldNames.city_id, null)}
                  name={validation.fieldNames.province_id}
                  label={'استان'}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CitySelector.Element
                  provinceId={watchProvince?.value}
                  name={validation.fieldNames.city_id}
                  label={'شهر'}
                />
              </Grid>

              <Grid item xs={6}>
                <UniversitySelector.Element name={validation.fieldNames.university_id} label={'دانشگاه'} />
              </Grid>

              <Grid item xs={6}>
                <RHFSelector
                  // options={Object.values(statusType)}
                  name={validation.fieldNames.is_active}
                  label={'گروه های خاص'}
                />
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 3,
            }}
          >
            <LoadingButton type="submit" variant="contained" color={'success'}>
              {'نمایش نتایج'}
            </LoadingButton>
          </Box>
        </FormProvider>
      </AccordionDetails>
    </Accordion>
  );
};

export default FiltersCaravanList;
