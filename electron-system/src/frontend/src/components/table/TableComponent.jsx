import {memo, useMemo} from 'react'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  IconButton,
  Input,
  InputAdornment,
  Pagination,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
} from '@mui/material'
import CachedIcon from '@mui/icons-material/Cached'

import {useTranslation} from 'react-i18next'
// import { withStyles } from '@mui/styles';
// import { styled } from '@mui/material/styles';
import useDebounce from 'src/hooks/useDebounce'
import Iconify from '../Iconify'
import Scrollbar from '../Scrollbar'
import TableHeadCustom from './TableHeadCustom'
import TableNoData from './TableNoData'
import TableSkeleton from './TableSkeleton'
import TableSelectedActions from './TableSelectedActions'
import useQueryString from '../../utils/useQueryString'
import WaitingBox from '../WaitingBox'
import TableMoreMenu from './TableMoreMenu'
import PaginationComponent from '../pagination'
import TableHeadCellCustom from './TableHeadCellCustom'
// import Searchbar from '../../layouts/dashboard/header/Searchbar'

const TableComponent = ({
  options,
  data,
  active,
  tableSetting,
  pagination,
  loading,
  isFetching,
  refetch,
}) => {
  const {t} = useTranslation()

  const {
    dense,
    page,
    sort,
    order,
    orderBy,
    limit,
    selected,
    onSelectRow,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
    onSearch,
    search,
    queryString,
    setFilter,
  } = tableSetting
  // const queryString = useQueryString();
  console.log({tableSetting, pagination, page, limit, active})
  const visuallyHidden = {
    border: 0,
    margin: -1,
    padding: 0,
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    clip: 'rect(0 0 0 0)',
  }

  let skeletonRowCount = options?.length || 0
  if (active?.selectable) skeletonRowCount += 1
  if (active?.rowNumber) skeletonRowCount += 1

  // const StyledTableRow = styled(TableRow)(({ theme }) => ({
  //   '&:nth-of-type(odd)': {
  //     backgroundColor: 'white',
  //   },
  //   '&:nth-of-type(even)': {
  //     backgroundColor: 'grey',
  //   },
  // }));

  const filteredItems = useMemo(() => {
    const final = []
    options?.forEach((prop) => {
      const val = queryString?.[prop?.field]
      console.log({val})
      const lookup = prop?.filter?.lookup
      if (val && lookup) {
        const find = (
          prop?.filter?.multiple && val?.length
            ? lookup?.filter((x) => val?.some((y) => y == x.value))
            : lookup?.filter((x) => x.value == val)
        )
          ?.map((y) => y?.label)
          ?.join(' , ')

        final.push({field: prop.field, label: prop?.header, value: lookup ? find : val, lookup})
      }
    })
    return final
  }, [queryString])

  return (
    <>
      <div className='ltr-grid flex justify-end mb-3'>
        <div className='flex'>
          <TextField
            disabled={isFetching}
            placeholder={t('search')}
            onChange={(e) => onSearch(e.target.value)}
            defaultValue={search}
            InputProps={{
              className: ' !rounded-l-[50px] !border-gray-50 ',
              inputProps: {
                className: ' p-[15px]',
              },
              startAdornment: (
                <InputAdornment position='start'>
                  <Iconify
                    icon={'eva:search-fill'}
                    sx={{color: 'text.disabled', width: 30, height: 20}}
                  />
                </InputAdornment>
              ),
            }}
            // sx={{mr: 1, fontWeight: 'fontWeightBold'}}
          />
          <Button
            variant='contained'
            color='grey'
            className='flex items-center justify-center w-[50px] h-full rounded-l-[0px]  rounded-r-[50px]  cursor-pointer '
            onClick={refetch}
            disabled={isFetching}
          >
            <CachedIcon className={isFetching ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>
      <Box
        sx={{
          display: 'flex',
          px: '20px',
          gap: 2,
        }}
      >
        {/* {show?.filters || ''} */}

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {filteredItems?.map((x, i) => {
            return (
              <Chip
                label={
                  <Box sx={{display: 'flex', gap: 1}}>
                    <Box> {`${t(x?.label)}`}</Box>:<Box>{`${x?.value}`}</Box>
                  </Box>
                }
                onDelete={() => setFilter([x.field], undefined)}
              />
            )
          })}
        </Box>
      </Box>
      <Card>
        <Scrollbar>
          <TableContainer sx={{minWidth: 800, position: 'relative', mt: 1.5}}>
            {/* {selected.length > 0 && (
            <TableSelectedActions
              dense={dense}
              numSelected={selected.length}
              rowCount={data?.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  data.map((row) => row._id)
                )
              }
              actions={
                <Tooltip title="Delete">
                  <IconButton
                    color="primary"
                    //  onClick={() => handleDeleteRows(selected)}
                  >
                    <Iconify icon={'eva:trash-2-outline'} />
                  </IconButton>
                </Tooltip>
              }
            />
          )} */}

            <Table size={dense ? 'small' : 'medium'}>
              <TableHead className='border-b'>
                <TableRow>
                  {active?.selectable ? <TableCell sx={{width: 48}}>{t('select')}</TableCell> : ''}
                  {active?.rowNumber ? <TableCell sx={{width: 48}}>{'#'}</TableCell> : ''}
                  {options?.map(({field, ...props}) => (
                    <TableHeadCellCustom
                      key={`table-head-${field}`}
                      {...{onSort, sort, orderBy, order, queryString}}
                      filterValue={queryString?.[field]}
                      setFilter={setFilter}
                      {...props}
                      field={field}
                    />
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {!loading ? (
                  <>
                    {data?.map((d, i) => {
                      console.log(`table-body-row-${d?._id || d?.id}`)
                      return (
                        <TableRow
                          key={`table-body-row-${d?._id || d?.id}`}
                          hover
                          // selected={selected.includes(d?._id || d?.id)}
                          //   sx={{
                          //     borderBottom: `2px solid rgba(145, 158, 171, 0.08)`,
                          //   }}
                        >
                          {active?.selectable ? (
                            <TableCell>
                              {
                                <Checkbox
                                  color='success'
                                  checked={selected?.includes(d?._id || d?.id)}
                                  onChange={(e) => {
                                    // console.log('* * * tableSetting :', { e: e.target.checked });
                                    onSelectRow(d?._id || d?.id)
                                  }}
                                />
                              }
                            </TableCell>
                          ) : (
                            ''
                          )}
                          {active?.rowNumber ? (
                            <TableCell>{i + 1 + +(page - 1) * +limit}</TableCell>
                          ) : (
                            ''
                          )}
                          {/* i + 1 +  */}
                          {options?.map(({field, Component, cellProps}) => (
                            <TableCell key={`table-body-row-cell-${field}`} {...cellProps}>
                              {Component ? <Component param={d} /> : d[field] || <></>}
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    })}
                  </>
                ) : (
                  ''
                )}
                {loading ? (
                  <TableSkeleton cols={10} rows={skeletonRowCount} />
                ) : (
                  <TableNoData isNotFound={!data?.length} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <Box className='my-[20px] mx-[20px]'>
          {pagination?.total ? (
            <div className='m-2'>
              <PaginationComponent
                {...{
                  page: page,
                  total: pagination?.total,
                  limit: limit,
                  onClick: onChangePage,
                }}
              />
            </div>
          ) : (
            ''
          )}
          {/* {pagination?.totalPage > 1 ? (
          <TablePagination
            rowsPerPageOptions={false}
            component="div"
            count={pagination?.total || 0}
            rowsPerPage={limit}
            page={page - 1}
            onPageChange={(e, page) => onChangePage(e, page + 1)}
            onRowsPerPageChange={onChangeRowsPerPage}
            // translate='yes'
            labelDisplayedRows={({ from, to, count }) => (
              <Box
              // sx={{
              //   direction: 'rtl !important',
              // }}
              >
                {`${from} - ${to} to ${count}`}
              </Box>
            )}
          />
        ) : (
          ''
        )} */}
          {/* <Pagination
          onChange={(e) => console.log({ e: e.target.value })}
          page={page}
          count={pagination?.total}
          size="small"
        /> */}
          {/* <TablePagination
          rowsPerPageOptions={false}
          component="div"
          count={10}
          rowsPerPage={2}
          page={0}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
          // translate='yes'
          labelDisplayedRows={({ from, to, count }) => (
            <Box
              sx={{
                direction: 'rtl !important',
              }}



            >
              {`${from} - ${to} to ${count}`}
            </Box>
          )}
        /> */}

          {/* <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            /> */}
        </Box>
      </Card>
    </>
  )
}

export default memo(TableComponent)
