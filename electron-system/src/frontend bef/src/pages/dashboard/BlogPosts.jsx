import orderBy from 'lodash/orderBy'
import {Link as RouterLink} from 'react-router-dom'
import {useEffect, useCallback, useState} from 'react'
// @mui
import {Grid, Button, Container, Stack, Box, Pagination} from '@mui/material'
// hooks
import useSettings from '../../hooks/useSettings'
import useIsMountedRef from '../../hooks/useIsMountedRef'
// utils
import axios from '../../utils/axios'
// routes
import {routes} from '../../routes/paths'
// components
import Page from '../../components/Page'
import Iconify from '../../components/Iconify'
import {SkeletonPostItem} from '../../components/skeleton'
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs'
// sections
import {BlogPostCard, BlogPostsSort, BlogPostsSearch} from '../../sections/@dashboard/blog'

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  {value: 'latest', label: 'جدیدترین'},
  {value: 'popular', label: 'محبوب ترین'},
  {value: 'oldest', label: 'قدیمی ترین'},
]

// ----------------------------------------------------------------------

const applySort = (posts, sortBy) => {
  if (sortBy === 'latest') {
    return orderBy(posts, ['createdAt'], ['desc'])
  }
  if (sortBy === 'oldest') {
    return orderBy(posts, ['createdAt'], ['asc'])
  }
  if (sortBy === 'popular') {
    return orderBy(posts, ['view'], ['desc'])
  }
  return posts
}

export default function BlogPosts() {
  const {themeStretch} = useSettings()

  const isMountedRef = useIsMountedRef()

  const [posts, setPosts] = useState([])
  const [AllNewsData, setAllNewsData] = useState({})
  const [filters, setFilters] = useState('latest')
  const [CurrentPage, setCurrentPage] = useState(1)

  const sortedPosts = applySort(posts, filters)

  const getAllPosts = useCallback(async () => {
    try {
      const {data} = await axios().get(`/api/admin/news?perPage=11&page=${CurrentPage}`)

      // if (isMountedRef.current) {
      setAllNewsData(data)
      setPosts(data.content)
      // }
    } catch (error) {
      console.error(error)
    }
  }, [isMountedRef, CurrentPage])

  useEffect(() => {
    getAllPosts()
  }, [getAllPosts, CurrentPage])

  const handleChangeSort = (value) => {
    if (value) {
      setFilters(value)
    }
  }

  return (
    <Page title='Blog: Posts'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='لیست اخبار'
          links={[
            {name: 'داشبورد', href: routes.root},
            {name: 'اخبار', href: routes.blog.posts},
            {name: 'لیست'},
          ]}
          action={
            <Button
              variant='contained'
              component={RouterLink}
              to={routes.blog.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              خبر جدید
            </Button>
          }
        />

        <Stack mb={5} direction='row' alignItems='center' justifyContent='space-between'>
          <BlogPostsSearch />
          <BlogPostsSort query={filters} options={SORT_OPTIONS} onSort={handleChangeSort} />
        </Stack>

        <Grid container spacing={3}>
          {(!posts.length ? [...Array(12)] : sortedPosts).map((post, index) =>
            post ? (
              <Grid key={post.id} item xs={12} sm={6} md={(index === 0 && 6) || 3}>
                <BlogPostCard post={post} index={index} />
              </Grid>
            ) : (
              <SkeletonPostItem key={index} />
            )
          )}
        </Grid>

        <Box sx={{mb: 5, mt: 3, display: 'flex', justifyContent: 'center'}}>
          <Pagination
            count={AllNewsData?.totalPages || 1}
            color='primary'
            page={CurrentPage}
            onChange={(e, page) => setCurrentPage(page)}
          />
        </Box>
      </Container>
    </Page>
  )
}
