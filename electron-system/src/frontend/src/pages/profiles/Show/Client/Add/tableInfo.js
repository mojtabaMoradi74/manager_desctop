import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import {Link} from 'react-router-dom'
import {haveHasType, caravanType} from '../../../../../enumeration'
import {fDate, fDateApi} from '../../../../../utils/formatTime'
import Enum from '../../../enum'
import MoreTableItem from '../../../../../components/table/MoreTable/MoreTableItem'
import MoreTable from '../../../../../hoc/MoreItem'
import {separateNumberWithComma} from '../../../../../utils/index'

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
]
