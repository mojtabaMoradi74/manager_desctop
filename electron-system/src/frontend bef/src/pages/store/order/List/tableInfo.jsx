import ImageWithText from 'src/components/ImageWithText'
import StatusComponent from 'src/components/StatusComponent'
import {fDate} from '../../../../utils/formatTime'
import Enum from '../enum'
import {globalStatus} from '../../../../components/StatusComponent/types'
import TableActions from 'src/components/table/TableActions'
import {numberWithComma} from 'src/utils/common'

export const tableData = ({onClick, active}) => [
  {
    header: 'id',
    Component: ({param}) => param.id || '-',
  },
  {
    header: 'user',
    Component: ({param}) => `${param.user?.firstName} ${param.user?.lastName}` || '-',
  },
  {
    header: 'paymentClass',
    Component: ({param}) => param.paymentClass?.title || '-',
  },
  {
    header: 'paymentMethod',
    Component: ({param}) => param.paymentMethod?.title || '-',
  },
  {
    header: 'totalPriceWithShipping',
    Component: ({param}) => numberWithComma(param.totalPriceWithShipping) || '-',
  },
  {
    header: 'totalPriceWithDiscount',
    Component: ({param}) => numberWithComma(param.totalPriceWithDiscount) || '-',
  },
  {
    header: 'shippingPrice',
    Component: ({param}) => numberWithComma(param.shippingPrice) || '-',
  },
  {
    header: 'totalPrice',
    Component: ({param}) => numberWithComma(param.totalPrice) || '-',
  },
  {
    header: 'totalGoods',
    Component: ({param}) => numberWithComma(param.totalGoods) || '-',
  },
  {
    header: 'Total count',
    Component: ({param}) => numberWithComma(param.totalCount) || '-',
  },
  {
    header: 'tryToPay',
    Component: ({param}) => param.tryToPay || '-',
  },
  {
    header: 'address',
    Component: ({param}) => {
      return (
        <>
          <span className='d-block mb-1'>{param?.address?.address}</span>
          <div className='d-flex gap-1 mt-2'>
            <span className=''>{param?.address?.provinceTitle}</span>,
            <span className=''>{param?.address?.cityTitle}</span>
          </div>
        </>
      )
    },
  },
  {
    field: 'status',
    header: 'Status',
    filter: {
      lookup: Enum.status.array,
      multiple: true,
    },
    Component: ({param}) => (
      <StatusComponent
        param={param}
        data={param?.status}
        status={Enum.status.array}
        onClick={onClick}
      />
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

  // {
  //   field: 'actions',
  //   header: '',
  //   Component: ({param}) => <TableActions {...{param, route: Enum.routes, onClick, active}} />,
  //   free: true,
  // },
]
