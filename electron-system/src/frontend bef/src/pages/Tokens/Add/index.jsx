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
import {globalStatus, BasicStatus, StatusData} from 'src/components/StatusComponent/types'
import axiosInstance from 'src/utils/axios'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import WaitingBox from 'src/components/WaitingBox/index'
import FormItem from 'src/components/hook-form/FormItem'
import {RHFUploadSingleFile} from 'src/components/hook-form'

import validation from './validation'
import Enum from '../enum'
import {RHFCheckbox} from '../../../components/hook-form/RHFCheckbox'
import RHFSelector from '../../../components/hook-form/RHFSelector'
import categorySelector from '../../category/selector'

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
  console.log({errors})
  // ----------------------------------------------------------------------------- SERVICE
  const creating = (params) => axiosInstance().post(Enum?.api?.base, params)
  const updating = (params) => axiosInstance().put(`${Enum?.api?.base}`, params)
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
      [validation.fieldNames.isTrend]: resData?.data?.data?.token?.[validation.fieldNames.isTrend],
      [validation.fieldNames.isSlider]:
        resData?.data?.data?.token?.[validation.fieldNames.isSlider],
      [validation.fieldNames.name]: resData?.data?.data?.token?.[validation.fieldNames.name],
      [validation.fieldNames.description]:
        resData?.data?.data?.token?.[validation.fieldNames.description],
      [validation.fieldNames.address]: resData?.data?.data?.token?.[validation.fieldNames.address],
      [validation.fieldNames.site]: resData?.data?.data?.token?.link?.[validation.fieldNames.site],
      [validation.fieldNames.categories]: categorySelector.convertor.array(
        resData?.data?.data?.token?.[validation.fieldNames.categories]
      ),

      [validation.fieldNames.type]:
        StatusData[resData?.data?.data?.token?.[validation.fieldNames.type]],
      [validation.fieldNames.supply]: resData?.data?.data?.token?.[validation.fieldNames.supply],
      [validation.fieldNames.serialId]:
        resData?.data?.data?.token?.[validation.fieldNames.serialId],
      [validation.fieldNames.isVerified]:
        !!resData?.data?.data?.token?.[validation.fieldNames.isVerified],
      [validation.fieldNames.image]: resData?.data?.data?.token?.mainFile?.[0],
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
      ...(paramId && {id: paramId}),
      // [validation.fieldNames.name]: values[validation.fieldNames.name],
      // [validation.fieldNames.description]: values[validation.fieldNames.description] || '',
      // [validation.fieldNames.status]: values[validation.fieldNames.status]?.value,
      // [validation.fieldNames.address]: values[validation.fieldNames.address],
      [validation.fieldNames.isTrend]: !!values[validation.fieldNames.isTrend],
      // [validation.fieldNames.approvedNft]: !!values[validation.fieldNames.approvedNft],
      [validation.fieldNames.isSlider]: !!values[validation.fieldNames.isSlider],
      // [validation.fieldNames.image]: values[validation.fieldNames.image],
    }

    // const formData = new FormData()
    // for (const key in reqData) {
    //   formData.append(key, reqData[key])
    // }

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
                    <RHFTextField
                      required
                      disabled
                      name={validation.fieldNames.name}
                      label={'name'}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <RHFTextField
                      required
                      multiline
                      disabled
                      rows={3}
                      name={validation.fieldNames.description}
                      label={'Description'}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <RHFTextField
                      disabled
                      name={validation.fieldNames.serialId}
                      label={'SerialId'}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <RHFTextField disabled name={validation.fieldNames.supply} label={'Supply'} />
                  </Grid>

                  {/* <Grid item xs={12} md={12}>
                    <RHFSelector
                      required
                      options={globalStatus}
                      name={validation.fieldNames.type}
                      label={'type'}
                    />
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <RHFUploadSingleFile
                      disabled
                      name={validation.fieldNames.image}
                      label={'Avatar'}
                    />
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
                    {t('Submit')}
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
                    {t('Cancel')}
                  </LoadingButton>
                </div>
              </FormItem>
              <FormItem label={'Checked'}>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={12}>
                    <RHFCheckbox name={validation.fieldNames.isTrend} label={'Is Trend'} />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <RHFCheckbox name={validation.fieldNames.isSlider} label={'Is Slider'} />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <RHFCheckbox
                      disabled
                      name={validation.fieldNames.isPhysical}
                      label={'Is Physical'}
                    />
                  </Grid>
                </Grid>
              </FormItem>
            </>
          }
        />
      </FormProvider>
    </Box>
  )
}

export default Add
