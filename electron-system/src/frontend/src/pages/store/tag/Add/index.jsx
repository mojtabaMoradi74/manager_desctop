import {Box, Grid} from '@mui/material'
import {useForm} from 'react-hook-form'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {yupResolver} from '@hookform/resolvers/yup'
import {LoadingButton} from '@mui/lab'
import FormLayout from 'src/components/hook-form/FormLayout'
import {toast} from 'react-toastify'
import {useTranslation} from 'react-i18next'
import RHFTextField from 'src/components/hook-form/RHFTextField'
import FormProvider from 'src/components/hook-form/FormProvider'
import {useMutationCustom, useQueryCustom} from 'src/utils/reactQueryHooks'
import {globalStatus, StatusData} from 'src/components/StatusComponent/types'
import axiosInstance from 'src/utils/axios'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import WaitingBox from 'src/components/WaitingBox/index'
import FormItem from 'src/components/hook-form/FormItem'
import {RHFUploadSingleFile} from 'src/components/hook-form'

import validation from './validation'
import Enum from '../enum'
import {RHFCheckbox} from '../../../../components/hook-form/RHFCheckbox'
import RHFSelector from '../../../../components/hook-form/RHFSelector'
import RoleSelector from 'src/pages/role/selector'
import RHFGallery from 'src/components/hook-form/RHFGallery'
import categorySelector from '../selector'

const Add = ({onClose}) => {
  const {t} = useTranslation()
  const queryParams = useParams()
  const paramId = queryParams?.id

  const navigate = useNavigate()

  const backUrl = `${Enum.routes.root}`
  const methods = useForm({
    resolver: yupResolver(validation.schema(paramId)),
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
  // const onErrorMutating = () => {}
  const {isLoading, mutate} = useMutationCustom({
    url: paramId ? updating : creating,
    name: `${Enum?.api?.base}_update`,
    invalidQuery: `${Enum?.api?.base}_get`,
    onSuccess: onSuccessMutating,
    // onError: onErrorMutating,
  })
  // ---------------------------------------
  const onSuccess = (response) => {
    const params = response?.data
    console.log('* * * onSuccess', {params})
    const resetData = {
      ...params,
      [validation.fieldNames.status]: StatusData[params.status],
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
      ...values,
      [validation.fieldNames.status]: values[validation.fieldNames.status]?.value,
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
        <FormLayout
          main={
            <FormItem label={t('basic info')}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Grid container spacing={5}>
                  <Grid item xs={12} md={12}>
                    <RHFTextField required name={validation.fieldNames.title} label={'title'} />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <RHFTextField required name={validation.fieldNames.slug} label={'slug'} />
                  </Grid>
                </Grid>
              </Box>
            </FormItem>
          }
          side={
            <>
              <FormItem label={t('actions')}>
                <div className='flex gap-4 max-w-[300px]'>
                  <LoadingButton
                    fullWidth
                    type='submit'
                    variant='contained'
                    color={'success'}
                    loading={isLoading}
                  >
                    {t('submit')}
                  </LoadingButton>
                  <LoadingButton
                    component={Link}
                    to={Enum.routes.root}
                    fullWidth
                    type='submit'
                    variant='outlined'
                    color={'success'}
                    disabled={isLoading}
                  >
                    {t('cancel')}
                  </LoadingButton>
                </div>
              </FormItem>

              <FormItem label={t('select')}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={12}>
                    <RHFSelector
                      required
                      options={globalStatus}
                      name={validation.fieldNames.status}
                      label={'status'}
                    />
                  </Grid>
                </Grid>
              </FormItem>
              {/* <FormItem label={'Checked'}>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={12}>
                    <RHFCheckbox name={validation.fieldNames.isVerified} label={'Verified'} />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <RHFCheckbox
                      disabled
                      name={validation.fieldNames.isFeatured}
                      label={'Featured'}
                    />
                  </Grid>
                </Grid>
              </FormItem>
              <FormItem label={'Social'}>
                <Grid container spacing={5}>
                  <Grid item xs={12} md={12}>
                    <RHFTextField
                      disabled
                      name={validation.fieldNames.instagram}
                      label={'Instagram'}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <RHFTextField disabled name={validation.fieldNames.site} label={'Site'} />
                  </Grid>
                </Grid>
              </FormItem> */}
            </>
          }
        />
      </FormProvider>
    </Box>
  )
}

export default Add
