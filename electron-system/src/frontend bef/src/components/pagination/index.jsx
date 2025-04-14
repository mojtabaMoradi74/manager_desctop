/* eslint-disable */
import {ArrowLeft, ArrowRight} from 'iconsax-react'
import Pagination from '@mui/material/Pagination'
import {useTranslation} from 'react-i18next'

const PaginationComponent = ({total = 0, limit = 10, page = 1, onClick = () => null}) => {
  const {t} = useTranslation()
  const totalPages = Math.ceil(total / limit)
  page = +page
  limit = +limit
  total = +total
  const disabled = {
    prev: +page <= 1 && total !== 0,
    next: +page >= totalPages && total !== 0,
  }
  // console.log("* * * PaginationComponent :", { total, limit, page });
  if (totalPages < 2) return <></>
  return (
    <div
      spacing={2}
      className={'ltr-grid select-none flex items-center justify-between text-[14px]'}
    >
      <div
        className={`text-text-primary  cursor-pointer p-2 flex items-center gap-2  border border-gray-200 rounded-3xl ${
          disabled.prev ? 'opacity-60' : ' opacity-100'
        }`}
        onClick={() => (!disabled.prev ? onClick(page - 1) : null)}
      >
        <ArrowLeft size={'20px'} />
        <div>{t('previous')}</div>
      </div>
      <Pagination
        page={page}
        count={totalPages}
        hidePrevButton
        hideNextButton
        onChange={(_, page) => onClick(page)}
      />
      <div
        className={`text-text-primary  cursor-pointer p-2 flex items-center gap-2  border border-gray-200 rounded-3xl ${
          disabled.next ? 'opacity-60' : ' opacity-100'
        }`}
        onClick={() => (!disabled.next ? onClick(page + 1) : null)}
      >
        <div>{t('next')}</div>
        <ArrowRight size={'20px'} />
      </div>
    </div>
  )
}

export default PaginationComponent
