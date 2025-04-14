import {Box, Grid} from '@mui/material'
import {useForm} from 'react-hook-form'
import {useNavigate, useParams} from 'react-router-dom'
import {yupResolver} from '@hookform/resolvers/yup'
import {LoadingButton} from '@mui/lab'
import {toast} from 'react-toastify'
import {useTranslation} from 'react-i18next'
import AgentSelector from 'src/pages/users/selector'
import RHFTextField from '../../../components/hook-form/RHFTextField'
import FormProvider from '../../../components/hook-form/FormProvider'
import validation from './validation'
import Enum from '../enum'
import {useMutationCustom, useQueryCustom} from '../../../utils/reactQueryHooks'
import axiosInstance from '../../../utils/axios'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs'
import WaitingBox from '../../../components/WaitingBox/index'
import persianToEnglishNumber from '../../../utils/persianToEnglishNumber'

const Add = ({onClose}) => {
  const {t} = useTranslation()
  const queryParams = useParams()
  const paramId = queryParams?.id

  const navigate = useNavigate()

  const backUrl = `${Enum.routes.root}`
  const methods = useForm({
    resolver: yupResolver(validation.schema()),
  })

  const {
    reset,
    watch,
    control,
    setValue,
    setError,
    handleSubmit,
    getValues,
    formState: {errors, isSubmitting},
  } = methods

  // ----------------------------------------------------------------------------- SERVICE
  const creating = (params) => axiosInstance().post(Enum?.api?.base, params)
  const updating = (params) => axiosInstance().put(`${Enum?.api?.base}/${paramId}`, params)
  const getById = () => axiosInstance().get(`${Enum?.api?.base}/${paramId}`)
  // ------------------------------------------------------------------------------ Mutation
  const onSuccessMutating = () => {
    toast.success(t('successfully'))
    navigate(backUrl)
  }
  const onErrorMutating = (error) => {
    console.log('* * * onErrorMutating :', {error})
    const errorTitle = error.response.data.message || t('errorTryAgain')
    const errors = Object.values(error?.response?.data?.errors || {})
    if (errors?.length) {
      errors?.map((x) => {
        return toast.error(x?.[0])
      })
    } else toast.error(errorTitle)
  }
  const {isLoading, mutate} = useMutationCustom({
    url: paramId ? updating : creating,
    name: `${Enum?.api?.base}_update`,
    invalidQuery: `${Enum?.api?.base}_get`,
    onSuccess: onSuccessMutating,
    onError: onErrorMutating,
  })
  // ---------------------------------------
  const onSuccess = (resData) => {
    console.log('* * * onSuccess', {resData})
    const resetData = {
      [validation.fieldNames.name]: resData?.data?.[validation.fieldNames.name] || '',
      [validation.fieldNames.last_name]: resData?.data?.[validation.fieldNames.last_name] || '',
      [validation.fieldNames.code_melli]: resData?.data?.[validation.fieldNames.code_melli] || '',
      [validation.fieldNames.email]: resData?.data?.[validation.fieldNames.email] || '',
      [validation.fieldNames.password]: resData?.data?.[validation.fieldNames.password],
      [validation.fieldNames.shenasname_number]:
        resData?.data?.[validation.fieldNames.shenasname_number] || '',
      [validation.fieldNames.agent_id]: AgentSelector.convertor.object(resData?.data?.agent),
      [validation.fieldNames.phone]: resData?.data?.[validation.fieldNames.phone] || '',
    }
    console.log('* * * onSuccess', {resetData})
    reset(resetData)
  }
  const dataById = useQueryCustom({
    name: `getById_${Enum?.api?.base}_${paramId}`,
    url: getById,
    onSuccess: onSuccess,
    enabled: !!paramId,
  })

  const watchStartDate = watch(validation.fieldNames.startDate)
  console.log({watchStartDate})
  const onSubmit = async () => {
    const values = getValues()
    console.log('* * * onSubmit : ', {values})

    const reqData = {
      [validation.fieldNames.name]: values[validation.fieldNames.name],
      [validation.fieldNames.last_name]: values[validation.fieldNames.last_name],
      [validation.fieldNames.code_melli]: persianToEnglishNumber(
        values[validation.fieldNames.code_melli]
      ),
      [validation.fieldNames.email]: values[validation.fieldNames.email],
      [validation.fieldNames.password]: persianToEnglishNumber(
        values[validation.fieldNames.password]
      ),
      [validation.fieldNames.shenasname_number]: persianToEnglishNumber(
        values[validation.fieldNames.shenasname_number]
      ),
      [validation.fieldNames.agent_id]: values[validation.fieldNames.agent_id]?.value,
      [validation.fieldNames.phone]: persianToEnglishNumber(values[validation.fieldNames.phone]),
    }

    console.log('* * * onSubmit : ', {reqData, values})
    mutate(reqData)
  }
  console.log({queryParams})
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
      <HeaderBreadcrumbs
        back={`${Enum.routes.root}`}
        heading={
          paramId
            ? t('editAuthor', {author: t(Enum.title.name[0])})
            : t('addAuthor', {author: t(Enum.title.name[0])})
        }
      >
        {/* <Typography sx={{ mt: 1 }}>{resQuery?.data?.data?.name}</Typography> */}
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFTextField name={validation.fieldNames.name} label={'نام'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name={validation.fieldNames.last_name} label={'نام خانوادگی'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name={validation.fieldNames.code_melli} label={'کدملی'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name={validation.fieldNames.shenasname_number}
                label={'شماره شناسنامه'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name={validation.fieldNames.phone} label={'موبایل'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name={validation.fieldNames.email} label={'ایمیل'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name={validation.fieldNames.password} label={'رمز عبور'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name={validation.fieldNames.confirm_password}
                label={'تکرار رمز عبور'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AgentSelector.Element name={validation.fieldNames.agent_id} label={'نقش'} />
            </Grid>
          </Grid>
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

          <LoadingButton type='submit' variant='contained' color={'success'} loading={isLoading}>
            {'ثبت اطلاعات'}
          </LoadingButton>
        </Box>
      </FormProvider>
    </Box>
  )
}

export default Add
