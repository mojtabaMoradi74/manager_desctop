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
import {routes} from 'src/routes/paths'

export const tableData = ({onClick, active}) => [
  {
    header: 'title',
    Component: ({param}) => param?.title || '-',
  },
  {
    header: 'slug',
    Component: ({param}) => param?.slug || '-',
  },
  {
    field: 'type',
    header: 'Type',
    filter: {
      lookup: Enum.types.array,
      multiple: true,
    },
    Component: ({param}) => {
      return (
        <Chip
          color={Enum.types.object[param?.type]?.bg}
          label={i18next.t(Enum.types.object[param?.type]?.label)}
        />
      )
    },
  },
  {
    header: 'attributeValue',
    Component: ({param}) => {
      return (
        // ${user.base + user.list}/${param.id}
        <Button
          color='success'
          variant='outlined'
          LinkComponent={Link}
          to={`${routes.attributeValue.listing(param?.id)}`}
          target='_blank'
          className={['flex gap-2 py-0 px-[10px] w-fit', `pointer-event-none`].join(' ')}
          size='small'
        >
          <span>{param.attributeValues?.length || 0}</span>
          <RemoveRedEyeOutlinedIcon fontSize='11' />
          {/* {<i className='mdi mdi-eye' />} */}
        </Button>
      )
    },
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
