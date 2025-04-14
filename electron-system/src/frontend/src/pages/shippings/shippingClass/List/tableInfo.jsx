import ImageWithText from 'src/components/ImageWithText'
import StatusComponent from 'src/components/StatusComponent'
import {fDate} from '../../../../utils/formatTime'
import Enum from '../enum'
import {globalStatus} from '../../../../components/StatusComponent/types'
import TableActions from 'src/components/table/TableActions'
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
    header: 'order',
    Component: ({param}) => param?.order || '-',
  },
  {
    header: 'shippingMethods',
    Component: ({param}) => param?.shippingMethods?.map((x) => x.title)?.join(' , '),
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
