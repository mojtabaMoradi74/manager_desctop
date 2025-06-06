import PropTypes from 'prop-types'
import {useEffect} from 'react'
// rtl
import rtlPlugin from 'stylis-plugin-rtl'
// emotion
import createCache from '@emotion/cache'
import {CacheProvider} from '@emotion/react'
// @mui
import {useTheme} from '@mui/material/styles'

// ----------------------------------------------------------------------

RtlLayout.propTypes = {
  children: PropTypes.node,
}

export default function RtlLayout({children}) {
  const theme = useTheme()

  console.log({theme})

  useEffect(() => {
    document.dir = theme.direction

    if (!theme.isLight) document.body.classList.add('dark-mode')
    else document.body.classList.remove('dark-mode')
    // document.theme = theme.theme
  }, [theme])

  const cacheRtl = createCache({
    key: theme.direction === 'rtl' ? 'rtl' : 'css',
    stylisPlugins: theme.direction === 'rtl' ? [rtlPlugin] : [],
  })

  return <CacheProvider value={cacheRtl}>{children}</CacheProvider>
}
