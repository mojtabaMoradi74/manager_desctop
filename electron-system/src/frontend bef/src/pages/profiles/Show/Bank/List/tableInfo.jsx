import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import {Link} from 'react-router-dom'
import {haveHasType, caravanType} from '../../../../../enumeration'
import {fDate, fDateJalali, fDateTime} from '../../../../../utils/formatTime'
import Enum from '../../../enum'
import MoreTableItem from '../../../../../components/table/MoreTable/MoreTableItem'
import MoreTable from '../../../../../hoc/MoreItem'

export const tableData = ({baseRoute}) => [
  {
    key: 'name',
    header: 'نام',
    Component: ({param}) => param?.client?.name || '-',
  },
  {
    key: 'lastName',
    header: 'نام خانوادگی',
    Component: ({param}) => param?.client?.last_name || '-',
  },
  {
    key: 'nationalCode',
    header: 'کدملی',
    Component: ({param}) => param?.client?.code_melli || '-',
  },

  {
    key: 'shenasname_number',
    header: 'شماره شناسنامه',
    Component: ({param}) => param?.client?.shenasname_number || '-',
  },
  {
    key: 'id',
    header: 'نوع بانک',
    Component: ({param}) => param?.client?.id || '-',
  },
  {
    key: 'id',
    header: 'مقدار وام',
    Component: ({param}) => param?.client?.id || '-',
  },
  {
    key: 'phone',
    header: 'تلفن همراه',
    Component: ({param}) => param?.client?.phone || '-',
  },
  {
    key: 'id',
    header: 'کد شناسایی/ID',
    Component: ({param}) => param?.client?.id || '-',
  },
  // {
  //   key: 'createdAt',
  //   header: 'تاریخ',
  //   Component: ({ param }) => fDateTime(param?.client?.created_at) || '-',
  // },
  // {
  //   key: 'actions',
  //   header: '',
  //   Component: ({ param }) => (
  //     <MoreTable>
  //       <Link to={`${baseRoute + Enum.routes.edit}/${param?.id}`}>
  //         <MoreTableItem isEdit />
  //       </Link>
  //       {/* <MoreTableItem isDelete onClick={() => onDelete(param)} /> */}
  //     </MoreTable>
  //   ),
  //   free: true,
  // },
  // {
  //   key: 'show',
  //   header: '',
  //   Component: ({ param }) => (
  //     <Link to={`${baseRoute}${Enum.routes.add}/${param.id}`}>
  //       <KeyboardBackspaceIcon
  //         sx={{
  //           cursor: 'pointer',
  //         }}
  //       />
  //     </Link>
  //   ),
  //   free: true,
  // },
]
