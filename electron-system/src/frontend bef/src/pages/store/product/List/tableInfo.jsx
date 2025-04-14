import ImageWithText from 'src/components/ImageWithText'
import StatusComponent from 'src/components/StatusComponent'
import {fDate} from '../../../../utils/formatTime'
import Enum from '../enum'
import {globalStatus} from '../../../../components/StatusComponent/types'
import TableActions from 'src/components/table/TableActions'
import {numberWithComma} from 'src/utils/common'
import {Button, Chip} from '@mui/material'
import i18next from 'i18next'
import ECategories from '../../category/enum'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import {Link} from 'react-router-dom'
import EBrand from '../../brand/enum'

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
    header: 'sku',
    Component: ({param}) => param?.sku || '-',
  },
  {
    header: 'previousPrice',
    Component: ({param}) => numberWithComma(param?.previousPrice),
  },
  {
    header: 'salePrice',
    Component: ({param}) => numberWithComma(param?.price),
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
          size='small'
        />
      )
    },
  },
  {
    header: 'categories',
    Component: ({param}) => {
      return (
        // ${user.base + user.list}/${param.id}
        param?.categories?.map((x) => {
          return (
            <Button
              color='success'
              variant='outlined'
              LinkComponent={Link}
              to={ECategories.routes.editing(x?.id)}
              target='_blank'
              className={['flex gap-1 py-0 px-[10px] w-fit', `pointer-event-none`].join(' ')}
              size='small'
            >
              <span>{x?.title || 0}</span>
              <RemoveRedEyeOutlinedIcon fontSize='11' />
            </Button>
          )
        })
      )
    },
  },
  {
    header: 'brand',
    Component: ({param}) => {
      return (
        // ${user.base + user.list}/${param.id}

        <Button
          color='success'
          variant='outlined'
          LinkComponent={Link}
          to={EBrand.routes.editing(param?.brand?.id)}
          target='_blank'
          className={['flex gap-1 py-0 px-[10px] w-fit', `pointer-event-none`].join(' ')}
          size='small'
        >
          <span>{param?.brand?.title || 0}</span>
          <RemoveRedEyeOutlinedIcon fontSize='11' />
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
