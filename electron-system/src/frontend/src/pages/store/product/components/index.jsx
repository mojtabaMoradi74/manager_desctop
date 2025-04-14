import {useState} from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import {useFormContext} from 'react-hook-form'

import PublicIcon from '@mui/icons-material/Public'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined'
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import VerticalTabs from 'src/components/VerticalTabs'
import validation from '../Add/validation'
import EProduct from '../enum'

import ProductAttributeComponent from './Attribute'
import ProductGeneralComponent from './General'
import InventoryComponent from './Inventory'
import ProductShippingComponent from './Shipping'
import ProductVariantComponent from './variant'
import {t} from 'i18next'

const ProductData = ({handleSubmitVariants, formMethod}) => {
  const [ActiveTab, setActiveTab] = useState(0)

  const {
    control,
    register,
    formState: {errors},
    watch,
    setValue,
    reset,
  } = useFormContext()
  const type = watch(validation.fieldNames.type)

  const data = [
    {
      label: t('shipping'),
      icon: <LocalShippingOutlinedIcon />,
      component: ProductShippingComponent,
      error: false,
    },
    {
      label: t('attribute'),
      icon: <AppRegistrationOutlinedIcon />,
      component: ProductAttributeComponent,
      error: false,
    },
  ]

  if (type?.value === EProduct.types.object[1].value) {
    data.push({
      label: t('variant'),
      icon: <CategoryOutlinedIcon />,
      component: ProductVariantComponent,
      error: errors?.variants,
      props: {
        handleSubmitVariants,
      },
    })
  } else {
    data.unshift(
      {
        label: t('general'),
        icon: <PublicIcon />,
        component: ProductGeneralComponent,
        error: false,
      },
      {
        label: t('inventory'),
        icon: <InventoryOutlinedIcon />,
        component: InventoryComponent,
        error: false,
      }
    )
  }

  return (
    <Box
      className='border rounded-[20px] overflow-hidden'
      sx={{flexGrow: 1, bgcolor: 'background.paper', display: 'flex'}}
    >
      <VerticalTabs data={data} />
    </Box>
  )
}

export default ProductData
