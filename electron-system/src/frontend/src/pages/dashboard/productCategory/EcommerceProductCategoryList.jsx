import {paramCase} from 'change-case'
import {useState, useEffect} from 'react'
import {useNavigate, Link as RouterLink} from 'react-router-dom'
// @mui
import {
  Box,
  Card,
  Table,
  Button,
  Switch,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material'
// redux
import {useDispatch, useSelector} from '../../../redux/store'
import {getProducts} from '../../../redux/slices/product'
// routes
import {routes} from '../../../routes/paths'
// hooks
import useSettings from '../../../hooks/useSettings'
import useTable, {getComparator, emptyRows} from '../../../hooks/useTable'
// components
import Page from '../../../components/Page'
import Iconify from '../../../components/Iconify'
import Scrollbar from '../../../components/Scrollbar'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs'
import {
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedActions,
} from '../../../components/table'
// sections
import {
  ProductCategoryTableRow,
  ProductCategoryTableToolbar,
} from '../../../sections/@dashboard/e-commerce/productCategory/list'
import {getAllProducts, getProductCategories} from '../../../services/store'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  {id: 'name', label: 'اسم دسته بندی', align: 'left'},
  {id: 'createdAt', label: 'تاریخ', align: 'left'},
  // { id: 'inStock', label: 'موجودی', align: 'center', width: 180 },
  // { id: 'price', label: 'قیمت', align: 'right' },
  {id: ''},
]

// ----------------------------------------------------------------------

export default function StoreProductCategoryList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  })

  const {themeStretch} = useSettings()

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const {products, isLoading} = useSelector((state) => state.product)

  const [IsNotFound, setIsNotFound] = useState(false)

  const [tableData, setTableData] = useState({
    loading: true,
    data: [],
  })

  const [filterName, setFilterName] = useState('')

  const handleGetAllProducts = () => {
    setTableData({...tableData, loading: true})
    getProductCategories()
      .then(({data}) => {
        setTableData({loading: false, data})
        setIsNotFound(data?.length === 0)
      })
      .catch((err) => {
        setTableData({data: [], loading: false})
        console.log(err)
      })
  }

  // useEffect(() => {
  //   dispatch(getProducts());
  // }, [dispatch]);

  // useEffect(() => {
  //   if (products.length) {
  //     setTableData(products);
  //   }
  // }, [products]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName)
    setPage(0)
  }

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id)
    setSelected([])
    setTableData(deleteRow)
  }

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id))
    setSelected([])
    setTableData(deleteRows)
  }

  const handleEditRow = (id) => {
    navigate(routes.eCommerce.edit(paramCase(id)))
  }

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  })

  const denseHeight = dense ? 60 : 80

  // const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  useEffect(() => {
    handleGetAllProducts()
  }, [page])

  return (
    <Page title='لیست دسته بندی ها'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='لیست دسته بندی ها '
          links={[
            {name: 'داشبورد', href: routes.root},
            {
              name: 'فروشگاه',
              href: routes.reportage.root,
            },
            {name: 'لیست دسته بندی ها'},
          ]}
          action={
            <Button
              variant='contained'
              startIcon={<Iconify icon='eva:plus-fill' />}
              component={RouterLink}
              to={routes.reportage.new}
            >
              دسته بندی جدید
            </Button>
          }
        />

        <Card>
          {/* <ProductCategoryTableToolbar filterName={filterName} onFilterName={handleFilterName} /> */}

          <Scrollbar>
            <TableContainer sx={{minWidth: 800, mt: 1}}>
              {/* {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )} */}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.data?.length}
                  // numSelected={selected.length}
                  // onSort={onSort}
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData?.content.map((row) => row.id)
                  //   )
                  // }
                />

                <TableBody>
                  {(tableData.loading ? [...Array(rowsPerPage)] : tableData.data)
                    //   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

                    ?.map((row, index) =>
                      row ? (
                        <ProductCategoryTableRow
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.name)}
                        />
                      ) : (
                        !IsNotFound && <TableSkeleton key={index} sx={{height: denseHeight}} />
                      )
                    )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.data?.content?.length)}
                  />

                  <TableNoData isNotFound={IsNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{position: 'relative'}}>
            <TablePagination
              rowsPerPageOptions={[100]}
              component='div'
              count={tableData.data?.length}
              rowsPerPage={100}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
              labelDisplayedRows={({from, to, count}) => `${from} - ${to} از ${count}`}
            />

            {/* <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            /> */}
          </Box>
        </Card>
      </Container>
    </Page>
  )
}

// ----------------------------------------------------------------------

function applySortFilter({tableData, comparator, filterName}) {
  // const stabilizedThis = tableData.map((el, index) => [el, index]);

  // stabilizedThis.sort((a, b) => {
  //   const order = comparator(a[0], b[0]);
  //   if (order !== 0) return order;
  //   return a[1] - b[1];
  // });

  // tableData = stabilizedThis.map((el) => el[0]);

  // if (filterName) {
  //   tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  // }

  return tableData
}
