import {Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid} from '@mui/material'
import {Controller, useForm} from 'react-hook-form'
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
import {RHFEditor, RHFUploadSingleFile} from 'src/components/hook-form'

import validation from './validation'
import Enum from '../enum'
import {RHFCheckbox} from '../../../../components/hook-form/RHFCheckbox'
import RHFSelector from '../../../../components/hook-form/RHFSelector'
import RHFGallery from 'src/components/hook-form/RHFGallery'

import citySelector from 'src/pages/region/city/selector'
import provinceSelector from 'src/pages/region/province/selector'
import {uniqueId} from 'lodash'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ProvinceSelector from 'src/components/selector/Province'

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

  const removeField = (name, index) => {
    const values = getValues()
    if (!values[name]) return
    const newValue = values[name].filter((param, i) => i !== index)
    reset({...values, [name]: newValue})
  }

  const addNewField = (name) => {
    const values = getValues()
    const newValue = values[name] ? [...values[name]] : []
    newValue.push({id: uniqueId()})
    console.log('* * * addNewField :', {name, newValue})
    // setValue({[name]: newValue})
    reset({...values, [name]: newValue})
  }

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
  const onSuccess = (response) => {
    const params = response?.data
    console.log('* * * onSuccess', {params})
    const resetData = {
      ...params,
      [validation.fieldNames.status]: StatusData[params.status],
      [validation.fieldNames.image]: {
        id: params?.image?.id,
        url: params?.image?.url,
        title: params?.image?.title,
      },

      [validation.fieldNames.includeStates]: params.includeStates?.map((x) => ({
        city: citySelector.convertor.object(x.city),
        province: provinceSelector.convertor.object(x.province),
        price: x.price,
      })),
      [validation.fieldNames.excludeStates]: params.excludeStates?.map((x) => ({
        city: citySelector.convertor.object(x.city),
        province: provinceSelector.convertor.object(x.province),
      })),
      [validation.fieldNames.usageType]: Enum.usageTypes.object[params.usageType],
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

  // const watchStartDate = watch(validation.fieldNames.startDate)
  // console.log({watchStartDate})
  const onSubmit = async () => {
    const values = getValues()
    console.log('* * * onSubmit : ', {values})
    const reqData = {
      ...values,
      [validation.fieldNames.image]: values[validation.fieldNames.image]?.id,
      [validation.fieldNames.status]: values[validation.fieldNames.status]?.value,
      [validation.fieldNames.usageType]: values[validation.fieldNames.usageType]?.value,
      [validation.fieldNames.includeStates]: values?.includeStates?.map((x) => ({
        city: x.city?.value || null,
        province: x.province?.value || null,
        price: +x.price || null,
      })),
      [validation.fieldNames.excludeStates]: values?.excludeStates?.map((x) => ({
        city: x.city?.value || null,
        province: x.province?.value,
      })),
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
            <>
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
                      <RHFTextField
                        multiline
                        row={4}
                        required
                        name={validation.fieldNames.description}
                        label={'description'}
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <RHFTextField
                        type={'number'}
                        required
                        name={validation.fieldNames.basePrice}
                        label={'basePrice'}
                      />
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <RHFCheckbox name={validation.fieldNames.prepay} label={'prepay'} />
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <RHFGallery label={'image'} name={validation.fieldNames.image} />
                    </Grid>

                    {/* <Grid item xs={12} md={12}>
                    <RHFUploadSingleFile
                      disabled={paramId}
                      name={validation.fieldNames.image}
                      label={'Avatar'}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <RHFUploadSingleFile
                      disabled={paramId}
                      name={validation.fieldNames.background}
                      label={'Background'}
                    />
                  </Grid> */}
                  </Grid>
                </Box>
              </FormItem>
              {/* ------------------------ */}
              <FormItem label={t('includeStates')}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={12}>
                    <RHFSelector
                      required
                      options={Enum.usageTypes.array}
                      name={validation.fieldNames.usageType}
                      label={'usageType'}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Controller
                      name={validation.fieldNames.includeStates}
                      control={control}
                      render={({field: {value, name}}) => {
                        return !value ? (
                          <></>
                        ) : (
                          value?.map((x, index) => {
                            const watchProvince = watch(
                              `${name}.${index}.${validation.fieldNames.province}`
                            )
                            return (
                              <Accordion defaultExpanded>
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls='panel1-content'
                                  id='panel1-header'
                                >
                                  {[x.province?.label || '-', x.city?.label || '-']?.join(' - ')}
                                </AccordionSummary>

                                <AccordionDetails>
                                  <Grid spacing={4} container>
                                    <Grid item xs={12} md={12}>
                                      <provinceSelector.Element
                                        name={`${name}.${index}.${validation.fieldNames.province}`}
                                        label={'province'}
                                        onChange={() =>
                                          setValue(
                                            `${name}.${index}.${validation.fieldNames.city}`,
                                            null
                                          )
                                        }
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                      <citySelector.Element
                                        name={`${name}.${index}.${validation.fieldNames.city}`}
                                        label={'city'}
                                        provinceId={watchProvince?.value}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                      <RHFTextField
                                        type={'number'}
                                        required
                                        name={`${name}.${index}.${validation.fieldNames.price}`}
                                        label={'price'}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Button
                                        color='error'
                                        variant='contained'
                                        onClick={() => removeField(name, index)}
                                      >
                                        {t('remove')}
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </AccordionDetails>
                              </Accordion>
                            )
                          })
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      color='success'
                      variant='contained'
                      onClick={() => addNewField(validation.fieldNames.includeStates)}
                    >
                      {t('add')}
                    </Button>
                  </Grid>
                </Grid>
              </FormItem>
            </>
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
                  {/* <Grid item xs={12} md={12}>
                    <categorySelector.Element
                      name={validation.fieldNames.categories}
                      label={'categories'}
                      multiple
                    />
                  </Grid> */}
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
              <FormItem label={t('excludeStates')}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={12}>
                    <Controller
                      name={validation.fieldNames.excludeStates}
                      control={control}
                      render={({field: {value, name}}) => {
                        return !value ? (
                          <></>
                        ) : (
                          value?.map((x, index) => {
                            const watchProvince = watch(
                              `${name}.${index}.${validation.fieldNames.province}`
                            )
                            return (
                              <Accordion defaultExpanded>
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls='panel1-content'
                                  id='panel1-header'
                                >
                                  {[x.province?.label || '-', x.city?.label || '-']?.join(' - ')}
                                </AccordionSummary>

                                <AccordionDetails>
                                  <Grid spacing={4} container>
                                    <Grid item xs={12} md={12}>
                                      <provinceSelector.Element
                                        name={`${name}.${index}.${validation.fieldNames.province}`}
                                        label={'province'}
                                        onChange={() =>
                                          setValue(
                                            `${name}.${index}.${validation.fieldNames.city}`,
                                            null
                                          )
                                        }
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                      <citySelector.Element
                                        name={`${name}.${index}.${validation.fieldNames.city}`}
                                        label={'city'}
                                        provinceId={watchProvince?.value}
                                      />
                                    </Grid>

                                    <Grid item xs={12}>
                                      <Button
                                        color='error'
                                        variant='contained'
                                        onClick={() => removeField(name, index)}
                                      >
                                        {t('remove')}
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </AccordionDetails>
                              </Accordion>
                            )
                          })
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      color='success'
                      variant='contained'
                      onClick={() => addNewField(validation.fieldNames.excludeStates)}
                    >
                      {t('add')}
                    </Button>
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
