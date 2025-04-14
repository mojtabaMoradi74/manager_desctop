import * as Yup from 'yup'
import {useCallback, useEffect, useState} from 'react'
import {useSnackbar} from 'notistack'
import {useNavigate} from 'react-router-dom'
// form
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm, Controller} from 'react-hook-form'
// @mui
import {LoadingButton} from '@mui/lab'
import {styled} from '@mui/material/styles'
import {Grid, Card, Chip, Stack, Button, TextField, Typography, Autocomplete} from '@mui/material'
// routes
import {routes} from '../../../routes/paths'
// components
import {
  RHFSwitch,
  RHFEditor,
  FormProvider,
  RHFTextField,
  RHFUploadSingleFile,
} from '../../../components/hook-form'
//
import BlogNewPostPreview from './BlogNewPostPreview'
import {createNews, getAuthors, getCategories} from '../../../services/newsAgency'
import Label from '../../../components/Label'

// ----------------------------------------------------------------------

const NEWS_TYPE_OPTION = [
  {
    label: 'متن',
    value: 'TEXT',
  },
  {
    label: 'ویدیویی',
    value: 'VIDEO',
  },
  {
    label: 'پادکست',
    value: 'PODCAST',
  },
]

// ----------------------------------------------------------------------

const PRIORITY_OPTION = [
  {
    label: 'معمولی',
    value: 0,
  },
  {
    label: 'مهم',
    value: 1,
  },
  {
    label: 'خیلی مهم',
    value: 2,
  },
]

const LabelStyle = styled(Typography)(({theme}) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}))

// ----------------------------------------------------------------------

export default function BlogNewPostForm() {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  const {enqueueSnackbar} = useSnackbar()

  const [NewsAuthors, setNewsAuthors] = useState([])
  const [NewsTags, setNewsTags] = useState([
    'اخبار سیاسی',
    'محرمانه',
    'سیاسی',
    'هنری',
    'ملی',
    'اخبار',
  ])
  const [NewsCategoriesArr, setNewsCategoriesArr] = useState([])

  const handleOpenPreview = () => {
    setOpen(true)
  }

  const handleClosePreview = () => {
    setOpen(false)
  }

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().nullable().required('تیتر اجباری است'),
    // description:Yup.string().nullable().required('توضیحات کوتاه اجباری است'),
    content: Yup.string().nullable().required('متن اخبار اجباری است'),
    // cover: Yup.mixed().required('Cover is required'),
  })

  const defaultValues = {
    title: '',
    shortDescription: '',
    content: '',
    cover: null,
    tags: [],
    isTrend: false,
    isImportant: false,
    // metaTitle: '',
    // metaDescription: '',
    // metaKeywords: ['Logan'],
    newsPriority: [PRIORITY_OPTION[0]],
    authorNews: [],
    category: [],
    newsType: [NEWS_TYPE_OPTION[0]],
  }

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  })

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: {isSubmitting, isValid},
  } = methods

  const values = watch()

  const onSubmit = async () => {
    try {
      const dataItems = {
        title: values.title,
        content: values.content,
        shortContent: values.shortDescription,
        thumbnail: 'https://picsum.photos/360/300',
        category: {
          id: values.category.value,
        },
        author: {
          id: values.authorNews.value,
        },
        type: values.newsType.value,
        tags: values.tags,
        priority: values.newsPriority.value,
        isImportant: values.isImportant,
        isTrend: values.isTrend,
      }

      await createNews(dataItems)
      reset()
      handleClosePreview()
      enqueueSnackbar('خبر با موفقیت ذخیره شد.')
      navigate(routes.blog.posts)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]

      if (file) {
        setValue(
          'cover',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      }
    },
    [setValue]
  )

  const handleGetNewsAuthors = () => {
    getAuthors()
      .then(({data}) => {
        const helpArr = []

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < data?.content?.length; i++) {
          const element = data?.content[i]
          helpArr.push({
            label: element.name,
            value: element.id,
          })
        }

        setNewsAuthors(helpArr)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const handleNewsCategories = () => {
    getCategories()
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

        setNewsCategoriesArr(helpArr)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    handleGetNewsAuthors()
    handleNewsCategories()
  }, [])

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{p: 3}}>
              <Stack spacing={3}>
                <RHFTextField name='title' label='تیتر خبر' />

                <RHFTextField
                  name='shortDescription'
                  label='توضیحات کوتاه'
                  multiline
                  rows={3}
                  sx={{mt: 0}}
                />
                <Label style={{marginTop: 10}}>
                  اگه این قسمت خالی باشد 50 کاراکتر از متن خبر به عنوان این بخش در نظر گرفته میشود
                </Label>

                <div>
                  <LabelStyle>متن خبر</LabelStyle>
                  <RHFEditor name='content' placeholder={'متن خبر را وارد کنید...'} />
                </div>

                {/* <div>
                  <LabelStyle>Cover</LabelStyle>
                  <RHFUploadSingleFile name="cover" accept="image/*" maxSize={3145728} onDrop={handleDrop} />
                </div> */}
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{p: 3}}>
              <Stack spacing={3}>
                <Controller
                  name='newsPriority'
                  control={control}
                  render={({field}) => (
                    <Autocomplete
                      // multiple
                      freeSolo
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={PRIORITY_OPTION.map((option) => option)}
                      getOptionLabel={(option) => option.label}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({index})}
                            key={option}
                            size='small'
                            label={option}
                          />
                        ))
                      }
                      renderInput={(params) => <TextField label='درجه اهمیت خبر' {...params} />}
                    />
                  )}
                />
                <Controller
                  name='newsType'
                  control={control}
                  render={({field}) => (
                    <Autocomplete
                      // multiple
                      freeSolo
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={NEWS_TYPE_OPTION.map((option) => option)}
                      getOptionLabel={(option) => option.label}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({index})}
                            key={option.title}
                            size='small'
                            label={'ssss'}
                          />
                        ))
                      }
                      renderInput={(params) => <TextField label='نوع خبر' {...params} />}
                    />
                  )}
                />

                <Controller
                  name='tags'
                  control={control}
                  render={({field}) => (
                    <Autocomplete
                      multiple
                      freeSolo
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={NewsTags.map((option) => option)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({index})}
                            key={option}
                            size='small'
                            label={option}
                          />
                        ))
                      }
                      renderInput={(params) => <TextField label='تگ های خبر' {...params} />}
                    />
                  )}
                />

                {/* <RHFTextField name="metaTitle" label="تگ های خبر" /> */}

                {/* <RHFTextField name="metaDescription" label="Meta description" fullWidth multiline rows={3} /> */}

                <Controller
                  name='category'
                  control={control}
                  render={({field}) => (
                    <Autocomplete
                      // multiple
                      freeSolo
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={NewsCategoriesArr.map((option) => option)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({index})}
                            key={option}
                            size='small'
                            label={option}
                          />
                        ))
                      }
                      renderInput={(params) => <TextField label='دسته بندی خبر' {...params} />}
                    />
                  )}
                />

                <Controller
                  name='authorNews'
                  control={control}
                  render={({field}) => (
                    <Autocomplete
                      // multiple
                      freeSolo
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={NewsAuthors.map((option) => option)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({index})}
                            key={option}
                            size='small'
                            label={option}
                          />
                        ))
                      }
                      renderInput={(params) => <TextField label='نویسنده خبر' {...params} />}
                    />
                  )}
                />

                <div>
                  <RHFSwitch
                    name='isTrend'
                    label='خبر برگزیده'
                    labelPlacement='start'
                    sx={{mb: 1, mx: 0, width: 1, justifyContent: 'space-between'}}
                  />

                  <RHFSwitch
                    name='isImportant'
                    label='خبر با اهمیت'
                    labelPlacement='start'
                    sx={{mx: 0, width: 1, justifyContent: 'space-between'}}
                  />
                </div>
              </Stack>
            </Card>

            <Stack direction='row' spacing={1.5} sx={{mt: 3}}>
              {/* <Button fullWidth color="inherit" variant="outlined" size="large" onClick={handleOpenPreview}>
                Preview
              </Button> */}
              <LoadingButton
                fullWidth
                type='submit'
                variant='contained'
                size='large'
                loading={isSubmitting}
              >
                انتشار
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>

      <BlogNewPostPreview
        values={values}
        isOpen={open}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onClose={handleClosePreview}
        onSubmit={handleSubmit(onSubmit)}
      />
    </>
  )
}
