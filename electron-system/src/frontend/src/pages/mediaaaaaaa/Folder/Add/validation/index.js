import * as yup from 'yup'

export const fieldNames = {
  title: 'title',
  slug: 'slug',
  status: 'status',
  parent: 'parent',
}

export const validation = () =>
  yup.object().shape({
    [fieldNames.title]: yup.string().required(),
  })
