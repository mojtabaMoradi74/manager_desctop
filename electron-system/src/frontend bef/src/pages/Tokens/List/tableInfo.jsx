import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import {MenuItem} from '@mui/material'
import {Link} from 'react-router-dom'
import ImageWithText from 'src/components/ImageWithText'
import CopyClipboard from 'src/components/CopyClipboard'
import TableMoreMenu from 'src/components/table/TableMoreMenu'
import Iconify from 'src/components/Iconify'
import MoreTable from 'src/hoc/MoreItem'
import MoreTableItem from 'src/components/table/MoreTable/MoreTableItem'
import StatusComponent from 'src/components/StatusComponent'
import {routes} from 'src/routes/paths'
import {numberWithComma, shortenAddress} from 'src/utils/common'
import TrueFalseIconic from 'src/components/TrueFalseIconic'
import {fDate} from '../../../utils/formatTime'
import Enum from '../enum'

export const tableData = ({baseRoute, onDelete, disabled}) => [
  {
    key: 'token',
    header: 'Item',
    Component: ({param}) => (
      <div
      // to={routes.users.editing(param?.userId?._id)}
      >
        <ImageWithText
          image={param?.tokenId?.thumbnail?.[0]}
          title={param?.tokenId?.name}
          isCircle
          isSmall
        />
      </div>
    ),
  },
  {
    key: 'user',
    header: 'User',
    Component: ({param}) => (
      <Link to={routes.users.editing(param?.userId?._id)}>
        <ImageWithText
          image={param?.userId?.image?.[0]}
          title={
            param?.userId?.username || (
              <CopyClipboard
                label={shortenAddress(param?.userId?.address)}
                value={param?.userId?.address}
              />
            )
          }
          isCircle
          isSmall
        />
      </Link>
    ),
  },
  {
    key: 'collection',
    header: 'collection',
    Component: ({param}) => (
      <Link to={routes.collections.editing(param?.collectionId?._id)}>
        <ImageWithText
          image={param?.collectionId?.image?.[0]}
          title={param?.collectionId?.name}
          isCircle
          isSmall
        />
      </Link>
    ),
  },
  {
    key: 'serialId',
    header: 'serialId',
    Component: ({param}) => param?.tokenId?.serialId || '-',
  },
  {
    key: 'chain',
    header: 'chain',
    Component: ({param}) => param?.tokenId?.chain || '-',
  },

  {
    key: 'watchCount',
    header: 'Watch Count',
    Component: ({param}) => numberWithComma(param?.tokenId?.watchCount) || '0',
  },
  {
    key: 'tokenCount',
    header: 'supply',
    Component: ({param}) => numberWithComma(param?.tokenCount) || '-',
  },
  {
    key: 'lastPrice',
    header: 'lastPrice',
    Component: ({param}) => numberWithComma(param?.tokenId?.lastPrice) || '-',
  },

  {
    key: 'status',
    header: 'Status',
    Component: ({param}) => <StatusComponent status={param?.status} />,
  },

  {
    key: 'isTrend',
    header: 'isTrend',
    Component: ({param}) => <TrueFalseIconic value={param?.tokenId?.isTrend} />,
  },

  {
    key: 'isSlider',
    header: 'isSlider',
    Component: ({param}) => <TrueFalseIconic value={param?.tokenId?.isSlider} />,
  },
  {
    key: 'createdAt',
    header: 'created At',
    Component: ({param}) => fDate(param?.createdAt) || '-',
  },
  {
    key: 'actions',
    header: '',
    Component: ({param}) => (
      <MoreTable>
        {!disabled?.update ? (
          <Link to={Enum.routes.editing(param?.tokenId?._id)}>
            <MoreTableItem isEdit />
          </Link>
        ) : (
          ''
        )}
        {!disabled?.delete ? (
          <MoreTableItem isDelete onClick={() => onDelete(param?.tokenId)} />
        ) : (
          ''
        )}
      </MoreTable>
    ),
    free: true,
  },
]
