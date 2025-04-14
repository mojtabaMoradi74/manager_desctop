import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import {Link} from 'react-router-dom'
import {haveHasType, caravanType} from '../../../../../enumeration'
import {fDate, fDateJalali, fDateTime} from '../../../../../utils/formatTime'
import Enum from '../../../enum'
import MoreTableItem from '../../../../../components/table/MoreTable/MoreTableItem'
import MoreTable from '../../../../../hoc/MoreItem'

export const tableData = ({baseRoute}) => [
  {
    key: 'social',
    header: 'نام شبکه',
    Component: ({param}) => param?.social?.title || '-',
  },
  {
    key: 'link',
    header: 'لینک',
    Component: ({param}) => param?.link || '-',
  },
  {
    key: 'name',
    header: 'ایجاد کننده',
    Component: ({param}) => param?.admin?.name || param?.admin?.email || '-',
  },
  {
    key: 'editor',
    header: 'آخرین ویرایش کننده',
    Component: ({param}) => param?.editor?.name || param?.editor?.email || '-',
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
