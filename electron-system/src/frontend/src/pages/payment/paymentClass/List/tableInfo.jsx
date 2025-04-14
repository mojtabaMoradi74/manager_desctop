import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import ImageWithText from 'src/components/ImageWithText'
import StatusComponent from 'src/components/StatusComponent'
import {fDate} from '../../../../utils/formatTime'
import Enum from '../enum'
import {globalStatus} from '../../../../components/StatusComponent/types'
import TableActions from 'src/components/table/TableActions'
import i18next from 'i18next'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import {Link} from 'react-router-dom'
import TrueFalseIconic from 'src/components/TrueFalseIconic'

export const tableData = ({onClick, active}) => [
  {
    header: 'title',
    Component: ({param}) => param?.title || '-',
  },
  {
    header: 'description',
    Component: ({param}) => param?.description || '-',
  },
  {
    header: 'type',
    Component: ({param}) => param?.type || '-',
  },
  {
    header: 'order',
    Component: ({param}) => param?.order || '-',
  },

  {
    field: 'default',
    header: 'default',
    Component: ({param}) => <TrueFalseIconic value={param?.default} />,
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
