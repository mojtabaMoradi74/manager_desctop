import {useMemo} from 'react'
import People from '@mui/icons-material/PeopleAltOutlined'
import TokenIcon from '@mui/icons-material/TokenOutlined'
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayListOutlined'
import CategoryIcon from '@mui/icons-material/CategoryOutlined'
import ChatBubbleIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import Person4Icon from '@mui/icons-material/Person4Outlined'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined'
// routes
import {routes} from '../../../routes/paths'
// components
import Label from '../../../components/Label'
import SvgIconStyle from '../../../components/SvgIconStyle'
import useAuth from '../../../hooks/useAuth'
import buildAccess from '../../../permission/buildAccess'
import {useTranslation} from 'react-i18next'
// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{width: 1, height: 1}} />

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  team: getIcon('team'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  tournament: getIcon('tournament'),
  support: getIcon('support'),
  building: getIcon('building'),
}

const useNavConfig = () => {
  const {isAuthenticated} = useAuth()

  const {t} = useTranslation()

  return [
    // GENERAL
    // ----------------------------------------------------------------------
    // {
    //   subheader: 'داشبورد',
    //   items: [
    //     { title: 'اعلانات', path: routes.general.app, icon: ICONS.dashboard },
    // { title: 'اخبار', path: routes.general.booking, icon: ICONS.booking },
    // { title: 'e-commerce', path: routes.general.ecommerce, icon: ICONS.ecommerce },
    // { title: 'analytics', path: routes.general.analytics, icon: ICONS.analytics },
    // { title: 'banking', path: routes.general.banking, icon: ICONS.banking },
    // { title: 'booking', path: routes.general.booking, icon: ICONS.booking },
    //   ],
    // },

    // MANAGEMENT
    // ----------------------------------------------------------------------
    {
      // subheader: '',
      items: [
        {
          title: t('dashboard'),
          path: routes.general.app,
          icon: ICONS.dashboard,
          // isCollapse: true,
        },
        {
          title: t('user'),
          path: routes.users.root,
          icon: <People />,
          permission: Object.values(buildAccess(routes.users.name)),
        },
        {
          title: t('role'),
          path: routes.role.root,
          icon: <ShieldOutlinedIcon />,
          // permission: Object.values(buildAccess(routes.role.name)),
        },
        {
          title: t('store'),
          path: routes.store.root,
          icon: <StorefrontOutlinedIcon />,
          // permission:rolePermission.read
          children: [
            {title: t('product'), path: routes.product.root},
            {title: t('category'), path: routes.category.root},
            {title: t('tag'), path: routes.tag.root},
            {title: t('attribute'), path: routes.attribute.root},
            {title: t('brand'), path: routes.brand.root},
            {title: t('banner'), path: routes.banner.root},
            {title: t('order'), path: routes.order.root},
          ],
        },
        {
          title: t('shipping'),
          path: routes.shipping.root,
          icon: <LocalShippingOutlinedIcon />,
          // permission:rolePermission.read
          children: [
            {title: 'shipping method', path: routes.shippingMethod.root},
            {title: 'shipping class', path: routes.shippingClass.root},
          ],
        },
        {
          title: t('payment'),
          path: routes.paymentClass.root,
          icon: <PaymentOutlinedIcon />,
          // permission:rolePermission.read
          // children: [
          //   {title: t('payment method'), path: routes.paymentMethod.root},
          //   {title: t('payment class'), path: routes.paymentClass.root},
          // ],
        },
        {
          title: t('file'),
          path: routes.media.gallery.root,
          icon: <CloudUploadOutlinedIcon />,
          // permission: Object.values(buildAccess(routes.media.gallery.name)),
        },
        // {
        //   title: 'Collection',
        //   path: routes.collections.root,
        //   icon: <FeaturedPlayListIcon />,
        // },
        // {
        //   title: 'Category',
        //   path: routes.category.root,
        //   icon: <CategoryIcon />,
        // },
        // {
        //   title: 'Token',
        //   path: routes.token.root,
        //   icon: <TokenIcon />,
        // },

        // {
        //   title: 'Auctions',
        //   path: routes.auctionMenu.root,
        //   icon: <ReceiptLongIcon />,
        //   // permission:rolePermission.read
        //   children: [
        //     {title: 'List', path: routes.auction.root},
        //     {title: 'Offer', path: routes.auctionOffer.root},
        //   ],
        // },
        // {
        //   title: 'Tickets',
        //   path: routes.ticketMenu.root,
        //   icon: <ChatBubbleIcon />,
        //   // permission:rolePermission.read
        //   children: [
        //     {title: 'Ticket', path: routes.ticket.root},
        //     {title: 'Department', path: routes.department.root},
        //   ],
        // },
        // {
        //   title: 'Managers',
        //   path: routes.managers.root,
        //   icon: <Person4Icon />,
        // },
        // {
        //   title: 'Settings',
        //   path: routes.settings.root,
        //   icon: <SettingsOutlinedIcon />,
        // },
        // {
        //   title: 'Managers',
        //   path: routes.admin.list,
        //   icon: ICONS.user,
        // },

        // STORE
        // {
        //   title: ' محتوای ویژه',
        //   path: routes.specialContent.root,
        //   icon: ICONS.invoice,
        //   children: [
        //     { title: 'لیست', path: routes.specialContent.list },
        //     // { title: 'post', path: routes.blog.demoView },
        //     { title: 'ایجاد', path: routes.specialContent.new },
        //     { title: 'ایجاد لیست محتوای ویژه', path: routes.specialContent.new_playlist },
        //   ],
        // },
      ],
    },

    // Panel
    // ----------------------------------------------------------------------
    // {
    //   subheader: 'مدیریت پنل',
    //   items: [
    //     // Admin
    //     {
    //       title: 'مدیریت ادمین ها',
    //       path: routes.admin.list,
    //       icon: ICONS.user,
    //       children: [
    //         // { title: 'لیست', path: routes.admin.list },
    //         // { title: 'ایجاد', path: routes.admin.new },
    //       ],
    //     },
    //   ],
    // },

    // APP
    // ----------------------------------------------------------------------
    // {
    //   subheader: 'app',
    //   items: [
    //     {
    //       title: 'mail',
    //       path: routes.mail.root,
    //       icon: ICONS.mail,
    //       info: (
    //         <Label variant="outlined" color="error">
    //           +32
    //         </Label>
    //       ),
    //     },
    //     { title: 'chat', path: routes.chat.root, icon: ICONS.chat },
    //     { title: 'calendar', path: routes.calendar, icon: ICONS.calendar },
    //     { title: 'kanban', path: routes.kanban, icon: ICONS.kanban },
    //   ],
    // },
  ]
}

export default useNavConfig
