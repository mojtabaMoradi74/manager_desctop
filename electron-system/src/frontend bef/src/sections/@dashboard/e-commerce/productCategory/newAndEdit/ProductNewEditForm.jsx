import PropTypes from 'prop-types'
import * as Yup from 'yup'
import {useSnackbar} from 'notistack'
import {useNavigate} from 'react-router-dom'
import {useCallback, useEffect, useMemo, useState} from 'react'
// form
import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
// @mui
import {styled} from '@mui/material/styles'
import {LoadingButton} from '@mui/lab'
import {
  Card,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  InputAdornment,
} from '@mui/material'
// routes
import {routes} from '../../../../../routes/paths'
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
} from '../../../../../components/hook-form'
import {getProductCategories} from '../../../../../services/store'

// ----------------------------------------------------------------------

const GENDER_OPTION = ['Men', 'Women', 'Kids']

const CATEGORY_OPTION = [
  {group: 'Clothing', classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather']},
  {group: 'Tailored', classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats']},
  {group: 'Accessories', classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks']},
]

const TAGS_OPTION = [
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots',
]

const LabelStyle = styled(Typography)(({theme}) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}))

// ----------------------------------------------------------------------

ProductCategoryNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
}

export default function ProductCategoryNewEditForm({isEdit, currentProduct}) {
  const navigate = useNavigate()

  const {enqueueSnackbar} = useSnackbar()

  const [ProductCategoriesArr, setProductCategoriesArr] = useState([])

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('اسم محصول اجباری است'),
    description: Yup.string().required('توضیحات محصول اجباری است'),
    // images: Yup.array().min(1, 'تصویر محصول اجباری است'),
    // inStock: Yup.number().min(1 , "تعداد موجودی باید از صفر بیشتر باشد").required('موجودی محصول اجباری است'),
    // price: Yup.number().moreThan(0, 'قیمت محصول باید از صفر بیشتر باشد'),
  })

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      images: currentProduct?.images || [],
      code: currentProduct?.code || '',
      sku: currentProduct?.sku || '',
      price: currentProduct?.price || 0,
      priceSale: currentProduct?.priceSale || 0,
      tags: currentProduct?.tags || [TAGS_OPTION[0]],
      inStock: 0,
      taxes: true,
      gender: currentProduct?.gender || GENDER_OPTION[2],
      category: currentProduct?.category || CATEGORY_OPTION[0].classify[1],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  )

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  })

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: {isSubmitting},
  } = methods

  const values = watch()

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues)
    }
    if (!isEdit) {
      reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct])

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      reset()
      enqueueSnackbar(!isEdit ? 'محصول با موفقیت ساخته شد !' : 'ویرایش محصول با موفقیت انجام شد!')
      navigate(routes.reportage.list)
    } catch (error) {
      console.error(error)
    }
  }

  const handleProductCategories = () => {
    getProductCategories()
      .then(({data}) => {
        const helpArr = []

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < data?.length; i++) {
          const element = data[i]
          helpArr.push({
            label: element.name,
            value: element.id,
          })
        }

        setProductCategoriesArr(helpArr)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setValue(
        'images',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )
    },
    [setValue]
  )

  const handleRemoveAll = () => {
    setValue('images', [])
  }

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file)
    setValue('images', filteredItems)
  }

  useEffect(() => {
    // handleGetNewsAuthors();
    handleProductCategories()
  }, [])

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{p: 3}}>
            <Stack spacing={3}>
              <RHFTextField name='name' label='اسم دسته بندی' />
              {/* 
              <div>
                <LabelStyle>تصویر</LabelStyle>
                <RHFUploadMultiFile
                  name="images"
                  showPreview
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </div> */}
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3} mt={3}>
            <LoadingButton type='submit' variant='contained' size='large' loading={isSubmitting}>
              {!isEdit ? 'ساخت دسته بندی' : 'ثبت تغییرات'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
