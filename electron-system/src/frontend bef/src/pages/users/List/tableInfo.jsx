import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import ImageWithText from 'src/components/ImageWithText'
import StatusComponent from 'src/components/StatusComponent'
import {fDate} from '../../../utils/formatTime'
import Enum from '../enum'
import {userStatus} from '../../../components/StatusComponent/types'
import TableActions from 'src/components/table/TableActions'
import i18next from 'i18next'

export const tableData = ({onClick, active}) => [
  {
    field: 'image',
    header: 'Image',
    Component: ({param}) => <ImageWithText image={param?.image || {}} isCircle isSmall />,
  },

  {
    header: 'Name',
    Component: ({param}) => `${param.firstName} ${param.lastName}`,
  },

  {
    header: 'Email',
    Component: ({param}) => param.email,
  },
  {
    field: 'type',
    header: 'Type',
    filter: {
      lookup: Enum.enum.array,
      multiple: true,
    },
    Component: ({param}) => {
      return (
        <Chip
          color={Enum.enum.object[param?.type]?.bg}
          label={i18next.t(Enum.enum.object[param?.type]?.label)}
        />
      )
    },
  },
  {
    field: 'status',
    header: 'Status',
    filter: {
      lookup: userStatus,
      multiple: true,
    },
    Component: ({param}) => (
      <StatusComponent param={param} data={param?.status} status={userStatus} onClick={onClick} />
    ),
  },

  // {
  //   field: 'isVerified',
  //   header: 'isVerified',
  //   Component: ({param}) => <TrueFalseIconic value={param?.isVerified} />,
  // },
  {
    header: 'Role',

    Component: ({param}) => (
      <Chip
        className='capitalize'
        // to={routes[ROUTE_NAME].edit + '/' + param.id}
        label={`${param.role ? param?.role?.name : 'Unknown'}`}
      />
    ),
  },
  {
    field: 'createdAt',
    header: 'created At',
    filter: {sortable: true},
    Component: ({param}) => fDate(param?.createdAt) || '-',
  },

  {
    field: 'actions',
    header: '',
    Component: ({param}) => <TableActions {...{param, route: Enum.routes, onClick, active}} />,
    free: true,
  },
]
