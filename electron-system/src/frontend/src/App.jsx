import {toast, ToastContainer} from 'react-toastify'
import {useSelector} from 'react-redux'
import {useEffect} from 'react'
import {useLocation} from 'react-router'
// routes
import Router from './routes'
// theme
import ThemeProvider from './theme'
// components
import Settings from './components/settings'
import RtlLayout from './components/RtlLayout'
import {ChartStyle} from './components/chart'
import ScrollToTop from './components/ScrollToTop'
import {ProgressBarStyle} from './components/ProgressBar'
import NotistackProvider from './components/NotistackProvider'
import ThemeColorPresets from './components/ThemeColorPresets'
import ThemeLocalization from './components/ThemeLocalization'
import MotionLazyContainer from './components/animate/MotionLazyContainer'
import useCollapseDrawer from './hooks/useCollapseDrawer'
import {routes} from './routes/paths'
import GlobalStyle from './theme/GlobalStyle'
import ErrorBoundary from './layouts/ErrorBoundary'
import RefreshTokenProvider from './components/RefreshTokenProvider'
import AppModal from './components/modal'
import useModal from './hooks/useModal'

// ----------------------------------------------------------------------

export default function App() {
  const admin = useSelector((store) => store.admin)
  console.log({admin})
  const modalRef = useModal()
  // toast.success('سلاممممممم');
  return (
    <ThemeProvider>
      <ThemeColorPresets>
        <ThemeLocalization>
          <RtlLayout>
            <ToastContainer
              hideProgressBar
              rtl
              toastClassName={'siteTempToast'}
              position='top-right'
              theme='light'
              // autoClose={false}
            />
            <NotistackProvider>
              <MotionLazyContainer>
                <AppModal ref={modalRef} />
                <ProgressBarStyle />
                <ChartStyle />
                <GlobalStyle />
                <Settings />
                <ScrollToTop />
                <ErrorBoundary>
                  {/* <RefreshTokenProvider> */}
                  <Router admin={admin} />
                  {/* </RefreshTokenProvider> */}
                </ErrorBoundary>
              </MotionLazyContainer>
            </NotistackProvider>
          </RtlLayout>
        </ThemeLocalization>
      </ThemeColorPresets>
    </ThemeProvider>
  )
}
