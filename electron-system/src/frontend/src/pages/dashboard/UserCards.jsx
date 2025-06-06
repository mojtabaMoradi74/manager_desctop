// @mui
import {Container, Box} from '@mui/material'
// routes
import {routes} from '../../routes/paths'
// hooks
import useSettings from '../../hooks/useSettings'
// _mock_
import {_userCards} from '../../_mock'
// components
import Page from '../../components/Page'
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs'
// sections
import {UserCard} from '../../sections/@dashboard/user/cards'

// ----------------------------------------------------------------------

export default function UserCards() {
  const {themeStretch} = useSettings()

  return (
    <Page title='User: Cards'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='User Cards'
          links={[
            {name: 'Dashboard', href: routes.root},
            {name: 'User', href: routes.user.root},
            {name: 'Cards'},
          ]}
        />

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {_userCards.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </Box>
      </Container>
    </Page>
  )
}
