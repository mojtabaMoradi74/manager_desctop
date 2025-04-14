import * as yup from 'yup'

export const fieldNames = {
  title: 'title',
  images: 'images',
}

export const validation = () =>
  yup.object().shape({
    // [fieldNames.title]: yup.string().required(ERRORS.pleaseEnterYour("title")).label("Title"),
  })
