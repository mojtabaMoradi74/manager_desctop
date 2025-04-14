import isString from 'lodash/isString'
import PropTypes from 'prop-types'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import {Link} from 'react-router-dom'
// @mui
import {ArrowBack} from '@mui/icons-material'

import {Box, Typography, Button} from '@mui/material'
//
import Breadcrumbs from './Breadcrumbs'
// ----------------------------------------------------------------------

HeaderBreadcrumbs.propTypes = {
  links: PropTypes.array,
  action: PropTypes.node,
  heading: PropTypes.string.isRequired,
  moreLink: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  sx: PropTypes.object,
}

export default function HeaderBreadcrumbs({
  back,
  links,
  action,
  heading,
  headComponent,
  moreLink = '' || [],
  sx,
  children,
  ...other
}) {
  return (
    <Box sx={{mb: 5, ...sx}}>
      <Box sx={{display: 'flex', alignItems: 'center'}}>
        {headComponent ? (
          <Box sx={{flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2}}>
            {' '}
            {headComponent}{' '}
          </Box>
        ) : (
          <Box sx={{flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2}}>
            {back ? (
              <Link to={back}>
                <ArrowBack />
              </Link>
            ) : (
              ''
            )}
            <Typography mb={0} variant='h4' gutterBottom>
              {heading}
            </Typography>
            {/* <Breadcrumbs links={links} {...other} /> */}
          </Box>
        )}

        {action && <Box sx={{flexShrink: 0}}>{action}</Box>}
      </Box>
      <Box>{children}</Box>

      {/* <Box sx={{ mt: 2 }}>
        {isString(moreLink) ? (
          <Link href={moreLink} target="_blank" rel="noopener" variant="body2">
            {moreLink}
          </Link>
        ) : (
          moreLink.map((href) => (
            <Link
              noWrap
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              rel="noopener"
              sx={{ display: 'table' }}
            >
              {href}
            </Link>
          ))
        )}
      </Box> */}
    </Box>
  )
}
