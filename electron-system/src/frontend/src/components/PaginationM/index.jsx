/* eslint-disable */

import React, {Fragment, Children} from 'react'

import './index.scss'
const PaginationM = ({limited, pages, activePage, onClick}) => {
  let startFullPageNumber = 7
  let sort = []
  if (pages === undefined || pages === 1 || !pages) return <div></div>

  activePage = +activePage
  pages = +pages
  limited = +limited

  let viewNext = +limited + +activePage
  let viewPrev = activePage - limited
  for (let index = 1; index <= pages; index++) {
    if (pages >= startFullPageNumber) {
      if (2 == index && viewPrev == 2) sort.unshift(1)
      if (viewPrev <= index && viewNext >= index) sort.push(index)
    } else if (pages <= startFullPageNumber) sort.push(index)
  }

  if (pages - limited - 1 == activePage && pages >= startFullPageNumber) sort.push(pages)

  let prevFirst = activePage < limited
  let prevSecond = activePage === 1
  let nextFirst = activePage === pages
  let nextSecond = activePage > pages - limited
  let Pagination_Sort = (
    <div className='Pagination-wrapper'>
      {' '}
      <div
        className={`paginationIcon centerAll translateR transition0-2  ${
          pages < startFullPageNumber || prevFirst ? 'hidden-element' : ''
        }`}
        disabled={prevFirst}
        onClick={() => (prevFirst ? null : onClick(1))}
      >
        <i className='fa fa-angle-double-left' aria-hidden='true' />
        {/* {"<<"} */}
      </div>
      <div
        className={`paginationIcon centerAll translateR transition0-2  ${
          prevSecond ? 'hidden-element' : ''
        }`}
        disabled={prevSecond}
        onClick={() => (prevSecond ? null : onClick(activePage - 1))}
      >
        <i className='fa fa-angle-left' aria-hidden='true' />
        {/* {"<"} */}
      </div>
      {activePage > 2 + limited && pages >= startFullPageNumber && (
        <Fragment>
          <div
            className='paginationIcon centerAll translateT transition0-2'
            onClick={() => onClick(1)}
          >
            {1}
          </div>
          <div className='paginationIcon centerAll'>
            <i className='fa fa-ellipsis-h' aria-hidden='true' />
            {/* {" ..."} */}
          </div>
        </Fragment>
      )}
      {Children.toArray(
        sort.map((number, index) => {
          if (number == 1 && +activePage > +limited + 2 && +pages >= startFullPageNumber) return
          else if (number === pages && activePage < pages - limited && pages >= startFullPageNumber)
            return
          else
            return (
              <>
                <div
                  className={`paginationIcon centerAll translateT transition0-2 ${
                    number === activePage && 'activated'
                  }`}
                  onClick={() => (number === activePage ? null : onClick(number))}
                >
                  {number}
                </div>
              </>
            )
        })
      )}
      {/* {pages - limited - 1 == activePage && (
        <div className={`paginationIcon centerAll translateT transition0-2 `} onClick={() => onClick(pages)}>
          {pages}
        </div>
      )} */}
      {activePage < pages - limited - 1 && pages >= startFullPageNumber && (
        <Fragment>
          <div className='paginationIcon centerAll'>
            <i className='fa fa-ellipsis-h' aria-hidden='true' />
            {/* {"..."} */}
          </div>

          <div
            className='paginationIcon centerAll translateT transition0-2'
            onClick={() => onClick(pages)}
          >
            {pages}
          </div>
        </Fragment>
      )}
      <div
        className={`paginationIcon centerAll translateL transition0-2  ${
          nextFirst ? 'hidden-element' : ''
        }`}
        disabled={nextFirst}
        onClick={() => (nextFirst ? null : onClick(+activePage + +1))}
      >
        <i className='fa fa-angle-right' aria-hidden='true' />
        {/* {">"} */}
      </div>
      <div
        className={`paginationIcon centerAll translateL transition0-2  ${
          pages < startFullPageNumber || nextSecond ? 'hidden-element' : ''
        }`}
        disabled={nextSecond}
        onClick={() => (nextSecond ? null : onClick(Number(pages)))}
      >
        <i className='fa fa-angle-double-right ' aria-hidden='true' />
        {/* {">>"} */}
      </div>
    </div>
  )

  return Pagination_Sort
}

export default PaginationM
