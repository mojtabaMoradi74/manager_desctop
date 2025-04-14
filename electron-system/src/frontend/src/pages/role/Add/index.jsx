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
import {RHFCheckbox} from '../../../components/hook-form/RHFCheckbox'
import RHFSelector from '../../../components/hook-form/RHFSelector'
import RoleSelector from 'src/pages/role/selector'
import RHFGallery from 'src/components/hook-form/RHFGallery'
import api from 'src/services/api.jsx'
import {useMemo} from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import {permissionsArray} from 'src/enumeration/permissions'

const Add = ({onClose}) => {
  const {t} = useTranslation()
  const queryParams = useParams()
  const paramId = queryParams?.id

  const navigate = useNavigate()

  const backUrl = `${Enum.routes.root}`
  const methods = useForm({
    resolver: yupResolver(validation.schema(paramId)),
    mode: 'onSubmit',
    defaultValues: {
      permission: {},
    },
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
  const permissionWatcher = watch(validation.fieldNames.permissions)
  const values = getValues()

  // ----------------------------------------------------------------------------- SERVICE
  const creating = (params) => axiosInstance().post(Enum?.api?.base, params)
  const updating = (params) => axiosInstance().put(`${Enum?.api?.base}/${paramId}`, params)
  const getById = () => axiosInstance().get(`${Enum?.api?.base}/${paramId}`)
  const permissionsGetting = () => axiosInstance().get(api.permission.list, {params: {limit: 1000}})

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
      status: StatusData[params.status],
      permissions: params?.permissions?.reduce((acc, x) => {
        return {...acc, [x.type]: x}
      }, {}),
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

  // ------------------------------------------------------- query Get
  const permissionsQuery = useQueryCustom({
    name: `permission_get`,
    url: permissionsGetting,
  })

  const permissionValidObject = useMemo(() => {
    return permissionsQuery?.data?.data?.result?.reduce((acc, x) => {
      return {...acc, [x.type]: x}
    }, {})
    // permissionsArray.filter(())
  }, [permissionsQuery])

  const watchStartDate = watch(validation.fieldNames.startDate)
  console.log({watchStartDate})
  const onSubmit = async () => {
    const values = getValues()
    console.log('* * * onSubmit : ', {values})
    const permissions = []

    for (const key in values.permissions) {
      const isActivePer = values.permissions[key]
      if (!isActivePer) continue
      const isValidPer = permissionValidObject[key]
      console.log({isValidPer})
      if (isValidPer) permissions.push(isValidPer?.id)
    }

    const reqData = {
      ...values,
      permissions: permissions,
      status: values.status ? values.status.value : StatusData.active.value,
    }

    console.log('* * * onSubmit : ', {reqData, values})
    mutate(reqData)
  }
  const defaultData = {permission: undefined, create: true, update: true}

  const addNewPermission = () => {
    const values = getValues()
    const newData = values[validation.fieldNames.permissions]
      ? [...values[validation.fieldNames.permissions], {...defaultData}]
      : [{...defaultData}]
    console.log({newData})
    setValue(validation.fieldNames.permissions, newData)
    // reset({ ...values, [validation.fieldNames.locale]: values[validation.fieldNames.locale] ? [...values[validation.fieldNames.locale], { ...defaultEpisode }] : [{ ...defaultEpisode }, { ...defaultEpisode }] })
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

      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
        className={'flex flex-col gap-5'}
      >
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
                      <RHFTextField required name={validation.fieldNames.name} label={'name'} />
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <RHFSelector
                        required
                        options={globalStatus}
                        name={validation.fieldNames.status}
                        label={'status'}
                      />
                    </Grid>
                  </Grid>
                </Box>
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
        <FormItem label={'permissions'}>
          {permissionsArray?.map((x, i) => {
            const values = getValues()

            let selectAll = true
            x?.items?.forEach(
              (a) =>
                (selectAll = selectAll && values?.[validation.fieldNames.permissions]?.[a.value])
            )

            const handleSelectAll = () => {
              x?.items?.forEach((a) => {
                console.log({
                  aaaa: `${validation.fieldNames.permissions}.${a.value}`,
                  selectAll,
                  values,
                })
                setValue(`${validation.fieldNames.permissions}.${a.value}`, !selectAll)
              })
            }
            console.log({values, selectAll, x})

            return (
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls='panel1-content'
                  id='panel1-header'
                >
                  {x.label} {selectAll ? '(Full)' : ''}
                </AccordionSummary>
                <AccordionDetails>
                  <Grid spacing={4} container>
                    <Grid item>
                      <Button
                        onClick={handleSelectAll}
                        className={'d-flex align-items-center'}
                        size='sm'
                      >
                        <div className={'gallery-add-title'}>
                          {selectAll ? 'Remove all' : 'Select all'}
                        </div>
                      </Button>
                    </Grid>
                    {x?.items?.map((y) => {
                      return (
                        <Grid item key={y.label}>
                          <RHFCheckbox
                            name={`${validation.fieldNames.permissions}.${y.value}`}
                            label={y.label}
                          />
                        </Grid>
                      )
                    })}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )
          })}
        </FormItem>
      </FormProvider>
    </Box>
  )
}

export default Add
