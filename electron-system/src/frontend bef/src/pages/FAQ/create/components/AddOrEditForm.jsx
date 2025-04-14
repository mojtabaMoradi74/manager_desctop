/* eslint-disable no-plusplus */
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {useSnackbar} from 'notistack'
import {useNavigate} from 'react-router-dom'
// form
import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
// @mui
import {LoadingButton, TabContext, TabList} from '@mui/lab'
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  Autocomplete,
  TextField,
  Chip,
  Tab,
  Alert,
} from '@mui/material'
// utils
import {fData} from '../../../../utils/formatNumber'
// routes
import {routes} from '../../../../routes/paths'
// _mock
import {countries} from '../../../../_mock'
// components
import Label from '../../../../components/Label'
import {
  FormProvider,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFCheckbox,
  RHFUploadSingleFile,
} from '../../../../components/hook-form'
import Image from '../../../../components/Image'
import {generateErrorArray} from '../../../../utils'
import {createNewCountry, editCountry} from '../../../../services/siteData'
import {getClientTypes} from '../../../../services/client'
import {updateUser} from '../../../../services/user'
import {getAllCategories} from '../../../../services/category'
import {createGame, updateGame} from '../../../../services/game'
import {HOST_API_STORAGE} from '../../../../config'
import {createBlog, getAllBlogCategories, updateBlog} from '../../../../services/blog'

// ----------------------------------------------------------------------

AddOrEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentItem: PropTypes.object,
}

export default function AddOrEditForm({isEdit, currentItem}) {
  const navigate = useNavigate()

  const {enqueueSnackbar} = useSnackbar()

  const NewUserSchema = Yup.object().shape({
    // firstName: Yup.string().required('required!'),
    // lastName: Yup.string().required('required!'),
    // phone: Yup.string().required('required!'),
    // email: Yup.string().email().required('required!'),
    // type: Yup.mixed().required('required!'),
    // password: Yup.string().required('required!'),
    // wallet: Yup.string().required('required!'),
    // file: Yup.mixed().test('required', 'اجباری است', (value) => value !== ''),
  })

  const defaultValues = useMemo(
    () => ({
      id: currentItem?._id || -1,
      title: currentItem?.title || '',
      isHome: currentItem?.isHome || false,
      status: currentItem?.status === 'ACTIVE' || true,
      categoriesValue: currentItem?.categoriesValue || '',
      description: currentItem?.description || '',
      file:
        (currentItem?.images?.[0]?.location &&
          HOST_API_STORAGE + currentItem?.images?.[0]?.location) ||
        '',
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentItem]
  )

  const [UserClientType, setUserClientType] = useState([])
  const [CategoriesArr, setCategoriesArr] = useState([])
  const [SelectedFile, setSelectedFile] = useState(null)

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  })

  const {
    reset,
    watch,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = methods

  const values = watch()

  const handleGetClientType = () => {
    getAllBlogCategories(1, 100)
      .then(({data}) => {
        const helpArr = []

        for (let i = 0; i < data?.data?.data?.length; i++) {
          const element = data?.data?.data[i]
          helpArr.push({
            label: element?.title,
            value: element?._id,
          })
        }

        setCategoriesArr(helpArr)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (isEdit && currentItem) {
      reset(defaultValues)
      console.log({currentItem})
    }
    if (!isEdit) {
      reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentItem])

  const onSubmit = async () => {
    // if(values.categories?.length === 0){
    //   enqueueSnackbar("انتخاب دسته بندی اجباری است" ,  { variant: 'error' });
    //   return
    // }

    try {
      const formData = new FormData()

      formData.append('title', values.title)
      formData.append('description', values.description)
      formData.append('status', values.status ? 'ACTIVE' : 'INACTIVE')
      formData.append('isHome', values.isHome)
      formData.append('type', 'ARTICLE')
      // for (let i = 0; i < values.categoriesValue?.length; i++) {
      //   const element = values.categoriesValue[i];
      //   console.log({element})
      //   formData.append("category[]", element.value);
      // }

      if (values.categoriesValue?.value) {
        formData.append('category', values.categoriesValue?.value)
      }

      if (typeof values.file !== 'string') {
        formData.append('images', values.file)
        formData.append('thumbnails', values.file)
      }

      if (!isEdit) {
        await createBlog(formData)
        reset()
        enqueueSnackbar('Blog created successfully !')
        navigate(routes.blog.list)
      } else {
        formData.append('id', values.id)
        await updateBlog(formData)
        reset()
        enqueueSnackbar('Blog edited successfully!')
        navigate(routes.blog.list)
      }
    } catch (error) {
      console.error(error)

      setError('afterSubmit', {...error, message: generateErrorArray(error)})
    }
  }

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]

      console.log('test')

      if (file) {
        setSelectedFile(file)
        setValue(
          'file',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      }
    },
    [setValue]
  )

  useEffect(() => {
    handleGetClientType()
  }, [])

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{p: 3}}>
              <RHFUploadSingleFile
                name='file'
                accept='image/*'
                maxSize={31457280}
                onDrop={handleDrop}
              />

              <Box
                sx={{
                  display: 'grid',
                  columnGap: 3,
                  rowGap: 3,
                  gridTemplateColumns: {xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)'},
                  mt: 3,
                }}
              >
                <RHFTextField name='title' label='Title' />
                {/* <RHFTextField name="rate" label="Rate" /> */}
                <Controller
                  name='categoriesValue'
                  control={control}
                  render={({field}) => (
                    <Autocomplete
                      // multiple
                      // freeSolo
                      // value={values.categoriesValue}
                      value={field.value}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={CategoriesArr.map((option) => option)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({index})}
                            key={option}
                            size='small'
                            label={option.label}
                          />
                        ))
                      }
                      renderInput={(params) => <TextField label='Category' {...params} />}
                    />
                  )}
                />
              </Box>

              <Box sx={{mt: 3}}>
                <RHFTextField name='description' multiline rows={4} label='Description' />
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  columnGap: 3,
                  rowGap: 3,
                  gridTemplateColumns: {xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)'},
                  mt: 3,
                }}
              >
                <RHFSwitch
                  name='status'
                  label='Active'
                  onChange={(e) => setValue('status', e.currentTarget.checked)}
                  checked={values.status}
                  withState={'true'}
                />

                <RHFSwitch
                  name='isHome'
                  label='Show in home page'
                  onChange={(e) => setValue('isHome', e.currentTarget.checked)}
                  checked={values.isHome}
                  withState={'true'}
                />
              </Box>

              <Stack alignItems='flex-end' sx={{mt: 3}}>
                <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                  {!isEdit ? 'Create' : 'Submit'}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  )
}
