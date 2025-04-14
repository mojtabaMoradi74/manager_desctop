import ImageWithText from 'src/components/ImageWithText'
import StatusComponent from 'src/components/StatusComponent'
import {fDate} from '../../../../utils/formatTime'
import Enum from '../enum'
import {globalStatus} from '../../../../components/StatusComponent/types'
import TableActions from 'src/components/table/TableActions'

export const tableData = ({onClick, active}) => [
  {
    field: 'image',
    header: 'image',
    Component: ({param}) => <ImageWithText image={param?.image || {}} isCircle isSmall />,
  },

  {
    header: 'title',
    Component: ({param}) => param?.title || '-',
  },
  {
    header: 'type',
    Component: ({param}) => Enum.type.object[param?.type]?.label || '-',
  },

  {
    header: 'slug',
    Component: ({param}) => param?.slug || '-',
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
