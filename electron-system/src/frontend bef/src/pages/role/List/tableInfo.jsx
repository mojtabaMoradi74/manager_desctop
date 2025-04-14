import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import ImageWithText from 'src/components/ImageWithText'
import StatusComponent from 'src/components/StatusComponent'
import {fDate} from '../../../utils/formatTime'
import Enum from '../enum'
import {globalStatus, userStatus} from '../../../components/StatusComponent/types'
import TableActions from 'src/components/table/TableActions'
import i18next from 'i18next'

export const tableData = ({onClick, active}) => [
  {
    header: 'Name',
    Component: ({param}) => param.name || '-',
  },

  {
    field: 'status',
    header: 'Status',
    filter: {
      lookup: globalStatus,
      multiple: true,
    },
    Component: ({param}) => (
      <StatusComponent param={param} data={param?.status} status={globalStatus} onClick={onClick} />
    ),
  },

  // {
  //   field: 'isVerified',
  //   header: 'isVerified',
  //   Component: ({param}) => <TrueFalseIconic value={param?.isVerified} />,
  // },

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
