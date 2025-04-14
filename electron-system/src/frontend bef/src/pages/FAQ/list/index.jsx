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
import {routes} from '../../../routes/paths'
// hooks
import useTabs from '../../../hooks/useTabs'
import useSettings from '../../../hooks/useSettings'
import useTable, {getComparator, emptyRows} from '../../../hooks/useTable'
import useIsMountedRef from '../../../hooks/useIsMountedRef'
// _mock_
import {_userList} from '../../../_mock'
// components
import Page from '../../../components/Page'
import Iconify from '../../../components/Iconify'
import Scrollbar from '../../../components/Scrollbar'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
} from '../../../components/table'
// sections
import {UserTableToolbar, UserTableRow} from '../../../sections/@dashboard/user copy/list'
import {getAllNewsAgency, deleteNewsAgency} from '../../../services/newsAgency'
import TableRowItems from './components/TableRow'
import {hasAccess} from '../../../permission/utiles'
import {newsAgencyPermission} from '../../../permission'
import {getAllCountry} from '../../../services/siteData'
import {deleteBlog, getAllBlogs} from '../../../services/blog'
// import { deleteUser, getAllUsers } from '../../../services/user';

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
  {id: 'title', label: 'Title', align: 'left', minWidth: 120},
  {id: 'status', label: 'Status', align: 'center'},
  {id: 'isHome', label: 'Homepage', align: 'center'},
  // { id: 'rate', label: 'Rate', align: 'left', minWidth: 120 },
  {id: 'createdAt', label: 'Created at', align: 'left'},
  {id: '', label: '', align: 'left'},
]

// ----------------------------------------------------------------------

export default function BlogsList() {
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

  const [tableData, setTableData] = useState([])

  const [filterName, setFilterName] = useState('')

  const [filterRole, setFilterRole] = useState('all')

  const {currentTab: filterStatus, onChangeTab: onChangeFilterStatus} = useTabs('all')

  const [CurrentPage, setCurrentPage] = useState(1)

  const [dataFiltered, setDataFiltered] = useState()

  const getAlldata = useCallback(async () => {
    try {
      const {data} = await getAllBlogs(page + 1)

      // if (isMountedRef.current) {
      setTableData(data?.data)
      setDataFiltered(
        applySortFilter({
          tableData: data?.data || [],
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
  }, [isMountedRef, CurrentPage, page])

  useEffect(() => {
    getAlldata()
  }, [getAlldata, CurrentPage, page])

  const handleFilterName = (filterName) => {
    setFilterName(filterName)
    setPage(0)
  }

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value)
  }

  const handleDeleteRow = (id) => {
    const deleteRow = tableData?.data?.filter((row) => row._id !== id)
    setSelected([])
    deleteBlog(id)
      .then(({data}) => {
        setTableData({
          data: deleteRow,
          meta: tableData?.meta,
        })
        getAlldata()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row._id))
    setSelected([])
    setTableData(deleteRows)
  }

  const handleEditRow = (id) => {
    navigate(routes.blog.edit(id))
  }

  const handleShowPlan = (id) => {
    navigate(routes.newsAgency.plans(id))
  }

  const handleAddReportage = (id) => {
    navigate({
      pathname: routes.reportage.new,
      search: `?agency=${id}`,
    })
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
    <Page title='Blogs'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Blogs'
          links={[
            {name: 'Dashboard', href: routes.root},
            {name: 'Blog', href: routes.blog.list},
            {name: 'List'},
          ]}
          action={
            <>
              <Button
                variant='contained'
                component={RouterLink}
                to={routes.blog.new}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                New Blog
              </Button>
              {/* {hasAccess(newsAgencyPermission.create) &&
                <>
                </>
              } */}
            </>
          }
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
                  rowCount={tableData?.length}
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row._id)
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
                  rowCount={tableData?.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData?.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {tableData?.data?.map((row) => (
                    <TableRowItems
                      key={row._id}
                      row={row}
                      selected={selected.includes(row._id)}
                      onSelectRow={() => onSelectRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                      onShowPlans={() => handleShowPlan(row._id)}
                      onAddReportage={() => handleAddReportage(row._id)}
                    />
                  ))}

                  {/* <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData?.data?.length)} /> */}

                  <TableNoData isNotFound={tableData?.total === 0} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{position: 'relative'}}>
            <TablePagination
              rowsPerPageOptions={[10]}
              component='div'
              // count={tableData?.meta?.total || 0}
              count={tableData?.total || 0}
              rowsPerPage={10}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
              // translate='yes'
              labelDisplayedRows={({from, to, count}) => `${from} - ${to} From ${count}`}
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
  const stabilizedThis = tableData?.map((el, index) => [el, index])

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
