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
    header: 'slug',
    Component: ({param}) => param?.slug || '-',
  },
  {
    header: 'depth',
    Component: ({param}) => `${param?.depth || 0}`,
  },
  {
    header: 'groupId',
    Component: ({param}) => `${param?.groupId || 0}`,
  },
  {
    header: 'Parent',
    Component: ({param}) => {
      return (
        // ${user.base + user.list}/${param.id}
        param?.parentCategory ? (
          <Button
            color='success'
            variant='outlined'
            LinkComponent={Link}
            to={param?.parentCategory ? `${Enum.routes.editing(param?.parentCategory?.id)}` : ''}
            target='_blank'
            className={[
              'flex gap-2 py-0 px-[10px] w-fit',
              !param?.parentCategory ? `pointer-event-none` : '',
            ].join(' ')}
            size='small'
          >
            <span>{param?.parentCategory?.title || '-'}</span>
            <RemoveRedEyeOutlinedIcon fontSize='11' />
            {/* {<i className='mdi mdi-eye' />} */}
          </Button>
        ) : (
          '-'
        )
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
