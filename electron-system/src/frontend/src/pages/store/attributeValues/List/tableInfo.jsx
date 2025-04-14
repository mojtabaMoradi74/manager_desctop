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

export const tableData = ({onClick, active, ...props}) => [
  {
    header: 'title',
    Component: ({param}) => param?.title || '-',
  },
  {
    header: 'slug',
    Component: ({param}) => param?.slug || '-',
  },
  {
    header: 'description',
    Component: ({param}) => param?.description || '-',
  },

  {
    header: 'color',
    Component: ({param}) => {
      return param?.color ? (
        <span
          className='block mb-1 p-2 rounded text-center border'
          style={{backgroundColor: param?.color, width: '20px', height: '20px'}}
        />
      ) : (
        '-'
      )
    },
  },
  // {
  //   header: 'attributeValue',
  //   Component: ({param}) => {
  //     return (
  //       // ${user.base + user.list}/${param.id}
  //       <Button
  //         color='success'
  //         variant='outlined'
  //         LinkComponent={Link}
  //         to={`${routes.attributeValue.listing(param?.id)}`}
  //         target='_blank'
  //         className={['flex gap-2 py-0 px-[10px] w-fit', `pointer-event-none`].join(' ')}
  //         size='small'
  //       >
  //         <span>{param.attributeValues?.length || 0}</span>
  //         <RemoveRedEyeOutlinedIcon fontSize='small' />
  //         {/* {<i className='mdi mdi-eye' />} */}
  //       </Button>
  //     )
  //   },
  // },
  {
    field: 'status',
    header: 'status',
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
    header: 'createdAt',
    filter: {sortable: true},
    Component: ({param}) => fDate(param?.createdAt) || '-',
  },

  {
    field: 'actions',
    header: '',
    Component: ({param}) => (
      <TableActions {...{param, route: Enum.routes, onClick, active}} {...props} />
    ),
    free: true,
  },
]
