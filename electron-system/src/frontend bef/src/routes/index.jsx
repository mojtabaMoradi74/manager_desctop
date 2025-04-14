/* eslint-disable no-unreachable */
import {Suspense, lazy, useEffect} from 'react'
import {Navigate, useRoutes, useLocation, Routes, Route} from 'react-router-dom'

// layouts
// import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard'
import LogoOnlyLayout from '../layouts/LogoOnlyLayout'
// guards
import GuestGuard from '../guards/GuestGuard'
import AuthGuard from '../guards/AuthGuard'
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import {PATH_AFTER_LOGIN} from '../config'
// components
import LoadingScreen from '../components/LoadingScreen'

import {routes} from './paths'
import RouterMiddleware from '../guards/RouterMiddleware'
import Users from '../pages/users'
import MediaContainer from 'src/pages/media'
import Roles from 'src/pages/role'
import Categories from 'src/pages/store/category'
import Tags from 'src/pages/store/tag'
import Attributes from 'src/pages/store/attribute'
import AttributeValues from 'src/pages/store/attributeValues'
import Brands from 'src/pages/store/brand'
import Products from 'src/pages/store/product'
import ShippingMethods from 'src/pages/shippings/shippingMethod'
import ShippingClass from 'src/pages/shippings/shippingClass'
import PaymentMethods from 'src/pages/payment/paymentMethod'
import PaymentClasses from 'src/pages/payment/paymentClass'
import Banners from 'src/pages/store/banner'
import Orders from 'src/pages/store/order'
import { AuthProvider } from 'src/contexts/JWTContext'
// import AssignedToken from '../pages/AssignedToken/index'
// import Collections from '../pages/Collections'
// import Category from '../pages/category'
// import Tokens from '../pages/Tokens'
// import Ticket from '../pages/ticket'
// import Department from '../pages/department'
// import Managers from '../pages/managers'
// import Auctions from '../pages/auction'
// import AuctionOffers from '../pages/auctionOffers'
// import Settings from '../pages/settings/index'

// import TicketDepartmentsList from '../pages/ticketDepartment/list'

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {pathname} = useLocation()

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  )
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')))
const Register = Loadable(lazy(() => import('../pages/auth/Register')))
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')))
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')))

// DASHBOARD

// GENERAL
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')))
// const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralAppAdmin')));
// const GeneralAppPublic = Loadable(lazy(() => import('../pages/dashboard/GeneralAppPublic')));

// APP
const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat')))
const Mail = Loadable(lazy(() => import('../pages/dashboard/Mail')))
const Calendar = Loadable(lazy(() => import('../pages/dashboard/Calendar')))
const Kanban = Loadable(lazy(() => import('../pages/dashboard/Kanban')))

// MAIN
// const HomePage = Loadable(lazy(() => import('../pages/Home')))
// const About = Loadable(lazy(() => import('../pages/About')))
// const Contact = Loadable(lazy(() => import('../pages/Contact')))
// const Faqs = Loadable(lazy(() => import('../pages/Faqs')))
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')))
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')))
const Pricing = Loadable(lazy(() => import('../pages/Pricing')))
const Payment = Loadable(lazy(() => import('../pages/Payment')))
const Page500 = Loadable(lazy(() => import('../pages/Page500')))
const NotFound = Loadable(lazy(() => import('../pages/Page404')))

// ----------------------------------------------------------------------

export default function Router({admin}) {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        {path: 'login-unprotected', element: <Login />},
        {path: 'register-unprotected', element: <Register />},
        {path: 'reset-password', element: <ResetPassword />},
        {path: 'verify', element: <VerifyCode />},
      ],
    },
    // Dashboard admin Routes
    {
      path: routes.root,
      element: (
        <AuthProvider>
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
        </AuthProvider>
      ),

      children: [
        {element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true},
        {path: 'app', element: <GeneralApp />},
        {
          path: `${routes.users.root}/*`,
          element: <Users />,
        },
        {
          path: `${routes.media.root}/*`,
          element: <MediaContainer />,
        },
        {
          path: `${routes.role.root}/*`,
          element: <Roles />,
        },
        {
          path: `${routes.category.root}/*`,
          element: <Categories />,
        },
        {
          path: `${routes.tag.root}/*`,
          element: <Tags />,
        },
        {
          path: `${routes.attribute.root}/*`,
          element: <Attributes />,
        },
        {
          path: `${routes.attributeValue.root('*')}`,
          element: <AttributeValues />,
        },
        {
          path: `${routes.brand.root}/*`,
          element: <Brands />,
        },
        {
          path: `${routes.banner.root}/*`,
          element: <Banners />,
        },
        {
          path: `${routes.product.root}/*`,
          element: <Products />,
        },
        {
          path: `${routes.shippingMethod.root}/*`,
          element: <ShippingMethods />,
        },
        {
          path: `${routes.shippingClass.root}/*`,
          element: <ShippingClass />,
        },
        {
          path: `${routes.paymentMethod.root}/*`,
          element: <PaymentMethods />,
        },
        {
          path: `${routes.paymentClass.root}/*`,
          element: <PaymentClasses />,
        },
        {
          path: `${routes.order.root}/*`,
          element: <Orders />,
        },
        // {
        //   path: `${routes.assignedToken.root}/*`,
        //   element: <AssignedToken />,
        // },
        // {
        //   path: `${routes.collections.root}/*`,
        //   element: <Collections />,
        // },
        // {
        //   path: `${routes.category.root}/*`,
        //   element: <Category />,
        // },
        // {
        //   path: `${routes.nft.root}/*`,
        //   element: <Tokens />,
        // },
        // {
        //   path: `${routes.ticket.root}/*`,
        //   element: <Ticket />,
        // },
        // {
        //   path: `${routes.department.root}/*`,
        //   element: <Department />,
        // },
        // {
        //   path: `${routes.managers.root}/*`,
        //   element: <Managers />,
        // },
        // {
        //   path: `${routes.auction.root}/*`,
        //   element: <Auctions />,
        // },
        // {
        //   path: `${routes.auctionOffer.root}/*`,
        //   element: <AuctionOffers />,
        // },
        // {
        //   path: `${routes.settings.root}/*`,
        //   element: <Settings />,
        // },
        // {
        //   path: 'ticket',
        //   children: [
        //     {element: <Navigate to='/ticket/list' replace />, index: true},
        //     {
        //       path: 'list',
        //       element: (
        //         <PermissionRoute element={<TicketList />} permissions={ticketPermission.read} />
        //       ),
        //     },
        //     // {
        //     //   path: 'new',
        //     //   element:
        //     //     <PermissionRoute
        //     //       element={<ShowTicketChat />}
        //     //       permissions={ticketPermission.create}
        //     //     />
        //     // },
        //     {
        //       path: 'edit/:id',
        //       element: (
        //         <PermissionRoute
        //           element={<ShowTicketChat />}
        //           permissions={ticketPermission.update}
        //         />
        //       ),
        //     },
        //     // { path: 'list', element: <TicketList /> },
        //     // { path: 'edit/:id', element: <ShowTicketChat /> },
        //   ],
        // },
        // {
        //   path: `${routes.ticket.root}/*`,
        //   element: <Tokens />,
        // },
        // {
        //   path: 'admin',
        //   children: [
        //     {element: <Navigate to='/admin/list' replace />, index: true},
        //     {
        //       path: 'list',
        //       element: (
        //         <PermissionRoute element={<AdminList />} permissions={adminPermission.read} />
        //       ),
        //     },
        //     {
        //       path: 'new',
        //       element: (
        //         <PermissionRoute element={<AdminCreate />} permissions={adminPermission.create} />
        //       ),
        //     },
        //     {
        //       path: 'edit/:id',
        //       element: (
        //         <PermissionRoute element={<AdminCreate />} permissions={adminPermission.update} />
        //       ),
        //     },
        //   ],
        // },
        // {
        //   path: 'financial',
        //   children: [
        //     {element: <Navigate to='/financial/list' replace />, index: true},
        //     {
        //       path: 'list',
        //       element: (
        //         <PermissionRoute
        //           element={<TransactionList />}
        //           permissions={transactionPermission.read}
        //         />
        //       ),
        //     },
        //     // { path: 'list', element: <TransactionList /> },
        //     // { path: 'post/:title', element: <BlogPost /> },
        //     // { path: 'new', element: <AdminCreate /> },
        //   ],
        // },
        // {
        //   path: 'role',
        //   children: [
        //     {element: <Navigate to='/role/list' replace />, index: true},
        //     {
        //       path: 'list',
        //       element: <PermissionRoute element={<RoleList />} permissions={rolePermission.read} />,
        //     },
        //     {
        //       path: 'new',
        //       element: (
        //         <PermissionRoute element={<CreateNewRole />} permissions={rolePermission.create} />
        //       ),
        //     },
        //     {
        //       path: 'edit/:id',
        //       element: (
        //         <PermissionRoute element={<CreateNewRole />} permissions={rolePermission.update} />
        //       ),
        //     },
        //     // { path: 'list', element: <RoleList /> },
        //     // { path: 'post/:title', element: <BlogPost /> },
        //     // { path: 'new', element: <CreateNewRole /> },
        //     // { path: 'edit/:id', element: <CreateNewRole /> },
        //   ],
        // },

        // {
        //   path: 'ticket',
        //   children: [
        //     {element: <Navigate to='/ticket/list' replace />, index: true},
        //     {
        //       path: 'list',
        //       element: (
        //         <PermissionRoute element={<TicketList />} permissions={ticketPermission.read} />
        //       ),
        //     },
        //     // {
        //     //   path: 'new',
        //     //   element:
        //     //     <PermissionRoute
        //     //       element={<ShowTicketChat />}
        //     //       permissions={ticketPermission.create}
        //     //     />
        //     // },
        //     {
        //       path: 'edit/:id',
        //       element: (
        //         <PermissionRoute
        //           element={<ShowTicketChat />}
        //           permissions={ticketPermission.update}
        //         />
        //       ),
        //     },
        //     // { path: 'list', element: <TicketList /> },
        //     // { path: 'edit/:id', element: <ShowTicketChat /> },
        //   ],
        // },
        {
          path: 'mail',
          children: [
            {element: <Navigate to='/dashboard/mail/all' replace />, index: true},
            {path: 'label/:customLabel', element: <Mail />},
            {path: 'label/:customLabel/:mailId', element: <Mail />},
            {path: ':systemLabel', element: <Mail />},
            {path: ':systemLabel/:mailId', element: <Mail />},
          ],
        },
        {
          path: 'chat',
          children: [
            {element: <Chat />, index: true},
            {path: 'new', element: <Chat />},
            {path: ':conversationKey', element: <Chat />},
          ],
        },
        {path: 'calendar', element: <Calendar />},
        {path: 'kanban', element: <Kanban />},
      ],
    },

    {path: '/', element: <Navigate to={PATH_AFTER_LOGIN} replace />},

    // Main Routes
    {
      path: '*',
      element: (
        <RouterMiddleware>
          <LogoOnlyLayout />
        </RouterMiddleware>
      ),
      children: [
        {path: 'coming-soon', element: <ComingSoon />},
        {path: 'maintenance', element: <Maintenance />},
        {path: 'pricing', element: <Pricing />},
        {path: 'payment', element: <Payment />},
        {path: '500', element: <Page500 />},
        {path: '404', element: <NotFound />},
        {
          path: '*',
          element: <Navigate to='/404' replace />,
        },
      ],
    },
    // {
    //   path: '/',
    //   element: <MainLayout />,
    //   children: [
    //     { element: <HomePage />, index: true },
    //     { path: 'about-us', element: <About /> },
    //     { path: 'contact-us', element: <Contact /> },
    //     { path: 'faqs', element: <Faqs /> },
    //   ],
    // },
    // {
    //   path: '*',
    //   element: (
    //     <RouterMiddleware>
    //       <Navigate to="/404" replace />
    //     </RouterMiddleware>
    //   ),
    // },
  ])
}
