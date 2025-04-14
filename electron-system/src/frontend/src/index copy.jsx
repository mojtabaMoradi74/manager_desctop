// i18n
import './locales/i18n'

// highlight
import './utils/highlight'

// scroll bar
// import 'simplebar/src/simplebar.css'

// lightbox
// import 'react-image-lightbox/style.css'

// map
// import 'mapbox-gl/dist/mapbox-gl.css'

// editor
// import 'react-quill/dist/quill.snow.css'

// slick-carousel
// import 'slick-carousel/slick/slick.css'
// import 'slick-carousel/slick/slick-theme.css'

// lazy image
// import 'react-lazy-load-image-component/src/effects/blur.css'
// import 'react-lazy-load-image-component/src/effects/opacity.css'
// import 'react-lazy-load-image-component/src/effects/black-and-white.css'

// React toastify
// import 'react-toastify/dist/ReactToastify.css'
import './index.css'

import './assets/css/index.css'

import {StrictMode} from 'react'

import {BrowserRouter} from 'react-router-dom'
import {HelmetProvider} from 'react-helmet-async'
import {Provider as ReduxProvider} from 'react-redux'
import {PersistGate} from 'redux-persist/lib/integration/react'
// @mui
// import AdapterDateFns from '@mui/lab/AdapterDateFns'
// import LocalizationProvider from '@mui/lab/LocalizationProvider'
import {QueryClient, QueryClientProvider} from 'react-query'
import moment from 'moment-jalaali'
import 'moment/locale/fa'
// redux
import {store, persistor} from './redux/store'
// contexts
import {SettingsProvider} from './contexts/SettingsContext'
import {CollapseDrawerProvider} from './contexts/CollapseDrawerContext'
import {createRoot} from 'react-dom/client'
// Check our docs
// https://docs-minimals.vercel.app/authentication/ts-version

// import {AuthProvider} from './contexts/JWTContext'
// import { AuthProvider } from './contexts/Auth0Context';
// import { AuthProvider } from './contexts/FirebaseContext';
// import { AuthProvider } from './contexts/AwsCognitoContext';

//
import App from './App'
// import * as serviceWorkerRegistration from './serviceWorkerRegistration'
// import reportWebVitals from './reportWebVitals'

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//       retry: false,
//     },
//   },
// })
// // moment.locale('fa');
// moment.loadPersian({dialect: 'persian-modern', usePersianDigits: true})

// ----------------------------------------------------------------------
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {'hooooi'}
    {/* <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SettingsProvider>
              <CollapseDrawerProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </CollapseDrawerProvider>
            </SettingsProvider>
          </PersistGate>
        </ReduxProvider>
      </HelmetProvider>
    </QueryClientProvider> */}
  </StrictMode>
)
// ReactDOM.render(
//   <QueryClientProvider client={queryClient}>
//     {/* <RefreshTokenProvider>

//     </RefreshTokenProvider> */}
//     <HelmetProvider>
//       <ReduxProvider store={store}>
//         <PersistGate loading={null} persistor={persistor}>
//           {/* <AuthProvider> */}
//           {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
//           <SettingsProvider>
//             <CollapseDrawerProvider>
//               <BrowserRouter>
//                 <App />
//               </BrowserRouter>
//             </CollapseDrawerProvider>
//           </SettingsProvider>
//           {/* </LocalizationProvider> */}
//           {/* </AuthProvider> */}
//         </PersistGate>
//       </ReduxProvider>
//     </HelmetProvider>
//   </QueryClientProvider>,

//   document.getElementById('root')
// )

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister()

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
