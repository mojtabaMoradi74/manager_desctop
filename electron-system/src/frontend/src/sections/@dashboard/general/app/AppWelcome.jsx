import PropTypes from 'prop-types'
import {Link as RouterLink} from 'react-router-dom'
// @mui
import {styled} from '@mui/material/styles'
import {Typography, Button, Card, CardContent} from '@mui/material'
import {SeoIllustration} from '../../../../assets'

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({theme}) => ({
  boxShadow: 'none',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.lighter,
  [theme.breakpoints.up('md')]: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}))

// ----------------------------------------------------------------------

AppWelcome.propTypes = {
  displayName: PropTypes.string,
}

export default function AppWelcome({displayName}) {
  return (
    <RootStyle>
      <CardContent
        sx={{
          p: {md: 0},
          pl: {md: 5},
          color: '#000',
        }}
      >
        <Typography gutterBottom variant='h4'>
          Welcome Back,
          <br /> {!displayName ? 'Admin' : displayName}!
        </Typography>

        {/* <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto' }}>
          پنل ادمین سایت خبری
        </Typography> */}

        {/* <Button variant="contained" to="#" component={RouterLink}>
          Go Now
        </Button> */}
      </CardContent>

      <SeoIllustration
        sx={{
          p: 3,
          width: 360,
          margin: {xs: 'auto', md: 'inherit'},
        }}
      />
    </RootStyle>
  )
}
