import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import {Link} from 'react-router-dom'
import {haveHasType, caravanType} from '../../../../../enumeration'
import {fDate, fDateJalali, fDateTime} from '../../../../../utils/formatTime'
import Enum from '../../../enum'
import MoreTableItem from '../../../../../components/table/MoreTable/MoreTableItem'
import MoreTable from '../../../../../hoc/MoreItem'

export const tableData = ({baseRoute}) => [
  {
    key: '',
    header: 'متن پیام',
    Component: ({param}) => param?.name || '-',
  },
  {
    key: '',
    header: 'نتیجه ارسال',
    Component: ({param}) => param?.last_name || '-',
  },
  {
    key: '',
    header: 'تاریخ ارسال',
    Component: ({param}) => param?.code_melli || '-',
  },
  {
    key: '',
    header: 'ارسال کننده',
    Component: ({param}) => param?.phone || '-',
  },
  {
    key: '',
    header: 'ارسال شده به',
    Component: ({param}) => param?.shenasname_number || '-',
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
