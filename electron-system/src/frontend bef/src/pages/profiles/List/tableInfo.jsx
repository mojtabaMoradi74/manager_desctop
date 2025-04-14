import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import {Link} from 'react-router-dom'
import {haveHasType, caravanType} from '../../../enumeration'
import {fDate, fDateApi} from '../../../utils/formatTime'
import Enum from '../enum'
import MoreTableItem from '../../../components/table/MoreTable/MoreTableItem'
import MoreTable from '../../../hoc/MoreItem'
import {separateNumberWithComma} from '../../../utils/index'

export const tableData = ({baseRoute}) => [
  {
    key: 'name',
    header: 'نام',
    Component: ({param}) => param?.name || '-',
  },
  {
    key: 'lastName',
    header: 'نام خانوادگی',
    Component: ({param}) => param?.last_name || '-',
  },
  {
    key: 'agent',
    header: 'عوامل',
    Component: ({param}) => param?.agent?.name || '-',
  },
  {
    key: 'nationalCode',
    header: 'کدملی',
    Component: ({param}) => param?.code_melli || '-',
  },
  {
    key: 'phone',
    header: 'تلفن همراه',
    Component: ({param}) => param?.phone || '-',
  },
  {
    key: 'shenasname_number',
    header: 'شماره شناسنامه',
    Component: ({param}) => param?.shenasname_number || '-',
  },
  {
    key: 'id',
    header: 'کد شناسایی/ID',
    Component: ({param}) => param?.id || '-',
  },
  {
    key: 'actions',
    header: '',
    Component: ({param}) => (
      <MoreTable>
        <Link to={`${baseRoute + Enum.routes.edit}/${param?.id}`}>
          <MoreTableItem isEdit />
        </Link>
        {/* <MoreTableItem isDelete onClick={() => onDelete(param)} /> */}
      </MoreTable>
    ),
    free: true,
  },
  {
    key: 'show',
    header: '',
    Component: ({param}) => (
      <Link to={`${baseRoute}${Enum.routes.show}/${param.id}/${Enum.enumTab.array[0]?.value}`}>
        <KeyboardBackspaceIcon
          sx={{
            cursor: 'pointer',
          }}
        />
      </Link>
    ),
    free: true,
  },
]
