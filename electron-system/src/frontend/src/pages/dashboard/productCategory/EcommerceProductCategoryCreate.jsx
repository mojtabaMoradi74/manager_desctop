import {useEffect} from 'react'
import {paramCase} from 'change-case'
import {useParams, useLocation} from 'react-router-dom'
// @mui
import {Container} from '@mui/material'
// redux
import {useDispatch, useSelector} from '../../../redux/store'
import {getProducts} from '../../../redux/slices/product'
// routes
import {routes} from '../../../routes/paths'
// hooks
import useSettings from '../../../hooks/useSettings'
// components
import Page from '../../../components/Page'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs'
import ProductCategoryNewEditForm from '../../../sections/@dashboard/e-commerce/productCategory/newAndEdit/ProductNewEditForm'

// ----------------------------------------------------------------------

export default function EcommerceProductCategoryCreate() {
  const {themeStretch} = useSettings()
  const dispatch = useDispatch()
  const {pathname} = useLocation()
  const {name} = useParams()
  const {products} = useSelector((state) => state.product)
  const isEdit = pathname.includes('edit')
  // const currentProduct = products.find((product) => paramCase(product.name) === name);

  const currentProduct = {}

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  return (
    <Page title='ساخت دسته بندی جدید'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'ساخت دسته بندی جدید' : 'ویرایش دسته بندی'}
          links={[
            {name: 'داشبورد', href: routes.root},
            {
              name: 'فروشگاه',
              href: routes.reportage.root,
            },
            {name: 'دسته بندی جدید'},
          ]}
        />

        <ProductCategoryNewEditForm isEdit={isEdit} currentProduct={currentProduct} />
      </Container>
    </Page>
  )
}
