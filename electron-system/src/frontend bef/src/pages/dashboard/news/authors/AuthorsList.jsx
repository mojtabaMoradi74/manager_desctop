import {paramCase} from 'change-case'
import {useCallback, useEffect, useState} from 'react'
import {Link as RouterLink, useNavigate} from 'react-router-dom'
// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material'
// routes
import {routes} from '../../../../routes/paths'
// hooks
import useTabs from '../../../../hooks/useTabs'
import useSettings from '../../../../hooks/useSettings'
import useTable, {getComparator, emptyRows} from '../../../../hooks/useTable'
import useIsMountedRef from '../../../../hooks/useIsMountedRef'
// _mock_
import {_userList} from '../../../../_mock'
// components
import Page from '../../../../components/Page'
import Iconify from '../../../../components/Iconify'
import Scrollbar from '../../../../components/Scrollbar'
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
} from '../../../../components/table'
// sections
import {AuthorTableRow} from '../../../../sections/@dashboard/blog/author/list'
import {getAuthors} from '../../../../services/newsAgency'

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'active', 'banned']

const ROLE_OPTIONS = [
  'all',
  'ux designer',
  'full stack designer',
  'backend developer',
  'project manager',
  'leader',
  'ui designer',
  'ui/ux designer',
  'front end developer',
  'full stack developer',
]

const TABLE_HEAD = [
  {id: 'name', label: 'اسم نویسنده ها', align: 'left'},
  // { id: 'company', label: 'Company', align: 'left' },
  // { id: 'role', label: 'Role', align: 'left' },
  // { id: 'isVerified', label: 'Verified', align: 'center' },
  // { id: 'status', label: 'Status', align: 'left' },
  // { id: '' },
  // { id: '' },
  // { id: '' },
  // { id: 'status', label: 'زمان', align: 'left' },
  {id: ''},
]

// ----------------------------------------------------------------------

export default function AuthorList() {
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
  } = useTable()

  const {themeStretch} = useSettings()

  const navigate = useNavigate()

  const isMountedRef = useIsMountedRef()

  const [tableData, setTableData] = useState({})

  const [filterName, setFilterName] = useState('')

  const [filterRole, setFilterRole] = useState('all')

  const {currentTab: filterStatus, onChangeTab: onChangeFilterStatus} = useTabs('all')

  const [CurrentPage, setCurrentPage] = useState(1)

  const [dataFiltered, setDataFiltered] = useState()

  const getAlldata = useCallback(async () => {
    try {
      const {data} = await getAuthors()

      // if (isMountedRef.current) {
      setTableData(data)
      setDataFiltered(
        applySortFilter({
          tableData: tableData?.content || [],
          comparator: getComparator(order, orderBy),
          filterName,
          filterRole,
          filterStatus,
        })
      )
      // }
    } catch (error) {
      console.error(error)
    }
  }, [isMountedRef, CurrentPage])

  useEffect(() => {
    getAlldata()
  }, [getAlldata, CurrentPage])

  const handleFilterName = (filterName) => {
    setFilterName(filterName)
    setPage(0)
  }

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value)
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
    navigate(routes.user.edit(paramCase(id)))
  }

  // const dataFiltered = applySortFilter({
  //   tableData : tableData?.content || [],
  //   comparator: getComparator(order, orderBy),
  //   filterName,
  //   filterRole,
  //   filterStatus,
  // });

  const denseHeight = dense ? 52 : 72

  const isNotFound = false
  // const isNotFound =
  //   (!dataFiltered.length && !!filterName) ||
  //   (!dataFiltered.length && !!filterRole) ||
  //   (!dataFiltered.length && !!filterStatus);

  return (
    <Page title='لیست نویسنده ها'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='لیست نویسنده ها'
          links={[
            {name: 'داشبورد', href: routes.root},
            {name: 'اخبار', href: routes.blog.posts},
            {name: 'لیست'},
          ]}
          // action={
          //   <Button
          //     variant="contained"
          //     component={RouterLink}
          //     to={routes.admin.new}
          //     startIcon={<Iconify icon={'eva:plus-fill'} />}
          //   >
          //     نویسنده جدید
          //   </Button>
          // }
        />

        <Card>
          {/* <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onChangeFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={tab} value={tab} />
            ))}
          </Tabs> */}

          {/* <Divider /> */}

          {/* <UserTableToolbar
            filterName={filterName}
            filterRole={filterRole}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            optionsRole={ROLE_OPTIONS}
          /> */}

          <Scrollbar>
            <TableContainer sx={{minWidth: 800, position: 'relative', mt: 1.5}}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData?.content?.length}
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row.id)
                  //   )
                  // }
                  actions={
                    <Tooltip title='Delete'>
                      <IconButton color='primary' onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData?.totalElements}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {tableData?.content?.map((row) => (
                    <AuthorTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.name)}
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData?.content?.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{position: 'relative'}}>
            <TablePagination
              rowsPerPageOptions={[10]}
              component='div'
              count={tableData?.totalElements || 0}
              rowsPerPage={10}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
              // translate='yes'
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

function applySortFilter({tableData, comparator, filterName, filterStatus, filterRole}) {
  const stabilizedThis = tableData.map((el, index) => [el, index])

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  tableData = stabilizedThis.map((el) => el[0])

  if (filterName) {
    tableData = tableData.filter(
      (item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    )
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.status === filterStatus)
  }

  if (filterRole !== 'all') {
    tableData = tableData.filter((item) => item.role === filterRole)
  }

  return tableData
}
