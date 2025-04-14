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
import {RHFEditor, RHFUploadSingleFile} from 'src/components/hook-form'

import validation from './validation'
import Enum from '../enum'
import {RHFCheckbox} from '../../../../components/hook-form/RHFCheckbox'
import RHFSelector from '../../../../components/hook-form/RHFSelector'
import RoleSelector from 'src/pages/role/selector'
import RHFGallery from 'src/components/hook-form/RHFGallery'

import RHFCkEditor from 'src/components/hook-form/RHFCkEditor'
import tagSelector from '../../tag/selector'
import brandSelector from '../../brand/selector'
import attributeSelector from '../../attribute/selector'
import shippingClassSelector from 'src/pages/shippings/shippingClass/selector'
import ProductData from '../components'
import attributeValuesSelector from '../../attributeValues/selector'
import categorySelector from '../../category/selector'

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
      price: params.previousPrice > 0 ? params.previousPrice : params.price,
      salePrice: params.previousPrice > 0 ? params.price : 0,
      [validation.fieldNames.status]: StatusData[params.status],
      [validation.fieldNames.categories]: categorySelector.convertor.array(params.categories),
      [validation.fieldNames.image]: {
        id: params?.image?.id,
        url: params?.image?.url,
        title: params?.image?.title,
      },
      [validation.fieldNames.tags]: tagSelector.convertor.array(params.tags),
      [validation.fieldNames.brand]: brandSelector.convertor.object(params.brand),
      [validation.fieldNames.shippingClass]: shippingClassSelector.convertor.object(
        params.shippingClass
      ),
      [validation.fieldNames.type]: Enum.types.object[params.type],

      [validation.fieldNames.attributes]: params.attributes?.map((x) => ({
        ...attributeSelector.convertor.object({
          ...x,
        }),
        attributeValues: attributeValuesSelector.convertor.array(x.attributeValues),
      })),
    }
    if (params?.variants?.length) {
      // defaultVariant

      resetData.variants = resetData.variants?.map((x) => {
        const attr = x.attributes?.map((x) => ({
          ...attributeSelector.convertor.object({
            ...x,
          }),
          attributeValues: attributeSelector.convertor.object(x.attributeValues),
        }))
        if (x.isDefault) {
          resetData.defaultVariant = attr
        }
        return {
          ...x,
          status: StatusData[x.status],
          attributes: x.attributes?.map((x) => ({
            ...attributeSelector.convertor.object({
              ...x,
            }),
            attributeValues: attributeSelector.convertor.object(x.attributeValues),
          })),
          type: Enum.types.object[x.type],
          shippingClass: x.shippingClass && shippingClassSelector.convertor.object(x.shippingClass),
          isServer: true,
        }
      })
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
    const param = getValues()
    console.log('* * * onSubmit ', {param})
    const {defaultVariant, variants, ...values} = param
    console.log('* * * onSubmit ', {variants})

    const attributeObject = values.attributes.reduce((acc, curr) => {
      acc[curr.value] = curr
      return acc
    }, {})

    let reqData = {
      ...values,
      [validation.fieldNames.attributes]: values.attributes?.map((x, i) => ({
        order: i + 1,
        id: x.value,
        usedForVariation: x.usedForVariation,
        showInProduct: x.showInProduct,
        attributeValues: x.attributeValues?.map((y) => y.value),
      })),
      [validation.fieldNames.tags]: values[validation.fieldNames.tags]?.map((x) => x.value),
      [validation.fieldNames.categories]: values[validation.fieldNames.categories]?.map(
        (x) => x.value
      ),
      [validation.fieldNames.brand]: values[validation.fieldNames.brand]?.value,
      [validation.fieldNames.type]: values[validation.fieldNames.type]?.value,

      [validation.fieldNames.image]: values[validation.fieldNames.image]?.id,
      [validation.fieldNames.images]: values[validation.fieldNames.images]?.map((x) => x.id),
      [validation.fieldNames.manageShipping]: values[validation.fieldNames.manageShipping] ? 1 : 0,
      [validation.fieldNames.manageStock]: values[validation.fieldNames.manageStock] ? 1 : 0,
      [validation.fieldNames.shippingClass]: values[validation.fieldNames.shippingClass]?.value,

      [validation.fieldNames.status]: values[validation.fieldNames.status]?.value,
    }

    const compareVariants = []
    let findDefault = false
    try {
      if (values?.type?.value == Enum.types.object[1]?.value) {
        const defaultVar = defaultVariant?.map((x) => x?.attributeValues?.value) || []
        console.log('* * * onSubmit ', {defaultVar})

        for (let index = 0; index < variants?.length; index++) {
          let haveAttribute = true
          const variant = variants[index]
          if (!variant.isServer) delete variant.id
          const variantObj = {
            ...variant,
            type: values.type.value,
            manageShipping: variant.manageShipping ? 1 : 0,
            manageStock: variant.manageStock ? 1 : 0,
            isDefault: 0,
            slug: variant?.slug || undefined,
            image: variant?.image?.id,
            images: variant?.images?.map((x) => x.id),
            status: variant?.status?.value,
            attributes: variant?.attributes?.map((x, i) => {
              const attr = attributeObject[x?.value]

              if (defaultVar?.length)
                haveAttribute = haveAttribute && defaultVar.includes(x?.attributeValues?.value)
              else haveAttribute = false
              console.log('* * * onSubmit variant?.attributes ', {attr, x, i})
              // const y = values.attributes.find((z) => z.id == x.value)
              // console.log("* * * onSubmit ", { y });
              return {
                order: i + 1,
                id: attr?.value,
                usedForVariation: attr?.usedForVariation,
                attributeValues: x?.attributeValues?.value,
              }
              // return ({ order: i + 1, id: y.value, usedForVariation: y.usedForVariation, attributeValues: x.attributeValues.value })
            }),
            shippingClass: variant.shippingClass?.value,
          }

          // if (URL_ID) {

          //   variant?.attributes?.filter((x)=>{

          //   })
          //   const currentVariant= dataById?.data?.data?.variants?.filter((x)=>{

          //   })
          // }

          if (haveAttribute) {
            // alert()
            findDefault = true
            variantObj.isDefault = 1
            reqData = {
              ...reqData,
              ...(variantObj.isDiscount && {isDiscount: variantObj.isDiscount}),
              ...(variantObj.lowStockAmount && {lowStockAmount: variantObj.lowStockAmount}),
              ...(variantObj.manageShipping && {manageShipping: variantObj.manageShipping}),
              ...(variantObj.manageStock && {manageStock: variantObj.manageStock}),
              ...(variantObj.price && {price: variantObj.price}),
              ...(variantObj.salePrice && {salePrice: variantObj.salePrice}),
              // ...(variantObj.previousPrice && {previousPrice: variantObj.previousPrice}),
              ...(variantObj.shippingClass && {shippingClass: variantObj.shippingClass}),
              ...(variantObj.stockCount && {stockCount: variantObj.stockCount}),
              ...(variantObj.discount && {discount: variantObj.discount}),
              ...(variantObj.height && {height: variantObj.height}),
              ...(variantObj.length && {length: variantObj.length}),
              ...(variantObj.weight && {weight: variantObj.weight}),
              ...(variantObj.width && {width: variantObj.width}),
            }
          }
          console.log('* * * onSubmit variantObj ', {variantObj, defaultVar})
          compareVariants.push(variantObj)
        }

        if (!findDefault && variants[0]) variants[0].isDefault = 1

        reqData.variants = compareVariants
      }
    } catch (error) {
      console.log('* * * onSubmit error', error)
      // alert()
    }
    console.log('* * * onSubmit : ', {reqData, values})
    mutate(reqData)
  }

  const handleSubmitVariants = (param) => {
    const values = getValues()
    console.log({values, param}, 'handleSubmitVariants')
    // setValue("variants", param);
    reset({
      ...values,
      variants: param,
    })
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
                      <RHFTextField required name={validation.fieldNames.slug} label={'slug'} />
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <RHFTextField
                        required
                        name={validation.fieldNames.shortDescription}
                        label={'shortDescription'}
                        multiline
                        rows={4}
                      />
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <RHFTextField
                        required
                        name={validation.fieldNames.description}
                        label={'description'}
                        multiline
                        rows={4}
                      />
                    </Grid>
                    {/* <Grid item xs={12} md={12}>
                      <RHFCkEditor
                        required
                        name={validation.fieldNames.shortDescription}
                        label={'shortDescription'}
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <RHFCkEditor
                        required
                        name={validation.fieldNames.description}
                        label={'description'}
                      />
                    </Grid> */}
                    <Grid item xs={12} md={12}>
                      <RHFSelector
                        required
                        options={Enum.types.array}
                        name={validation.fieldNames.type}
                        label={'product type'}
                      />
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
              <ProductData formMethod={methods} handleSubmitVariants={handleSubmitVariants} />

              {/* <FormItem label={t('basic info')}> */}
              {/* </FormItem> */}
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
                  <Grid item xs={12} md={12}>
                    <categorySelector.Element
                      name={validation.fieldNames.categories}
                      label={'categories'}
                      multiple
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <RHFSelector
                      required
                      options={globalStatus}
                      name={validation.fieldNames.status}
                      label={'status'}
                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <brandSelector.Element name={validation.fieldNames.brand} label={'brand'} />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <tagSelector.Element
                      name={validation.fieldNames.tags}
                      label={'tags'}
                      multiple
                    />
                  </Grid>
                </Grid>
              </FormItem>

              <FormItem label={t('image')}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={12}>
                    <RHFGallery label={'thumbnail'} name={validation.fieldNames.image} />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <RHFGallery label={'galleries'} isMulti name={validation.fieldNames.images} />
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
