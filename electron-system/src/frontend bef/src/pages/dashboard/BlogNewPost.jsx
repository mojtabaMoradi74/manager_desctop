// @mui
import {Container} from '@mui/material'
// routes
import {routes} from '../../routes/paths'
// hooks
import useSettings from '../../hooks/useSettings'
// components
import Page from '../../components/Page'
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs'
// sections
import {BlogNewPostForm} from '../../sections/@dashboard/blog'

// ----------------------------------------------------------------------

export default function BlogNewPost() {
  const {themeStretch} = useSettings()

  return (
    <Page title='ایجاد خبر جدید'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='ایجاد خبر جدید'
          links={[
            {name: 'داشبورد', href: routes.root},
            {name: 'اخبار', href: routes.blog.posts},
            {name: 'خبرجدید'},
          ]}
        />

        <BlogNewPostForm />
      </Container>
    </Page>
  )
}
