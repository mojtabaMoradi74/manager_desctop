import {useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import createQueryString from 'src/utils/createQueryString'
import RemoveNullObjectValue from '../utils/RemoveNullObjectValue'
import useDebounce from './useDebounce'

// ----------------------------------------------------------------------

export default function useTable({queryString, maxRowSelect, ...props} = {}) {
  const location = useLocation()
  const navigate = useNavigate()

  const changeUrl = (params) => ({
    pathname: location.pathname,
    search: createQueryString(RemoveNullObjectValue({...queryString, ...params})).toString(),
  })
  console.log({queryString})
  const navigateUrl = (obj) => navigate(changeUrl(obj))

  const [dense, setDense] = useState(props?.defaultDense || false)

  // const [orderBy, setOrderBy] = useState(props?.defaultOrderBy || 'name');

  // const [order, setOrder] = useState(props?.defaultOrder || 'asc');

  const [page, setPage] = useState(props?.defaultCurrentPage || 0)

  const [rowsPerPage, setRowsPerPage] = useState(props?.defaultRowsPerPage || 5)

  const [selected, setSelected] = useState()
  const [selectedObject, setSelectedObject] = useState()

  const [sort, order] = queryString?.sort?.split('@') || []
  // const onSort = (id) => {
  //   const isAsc = orderBy === id && order === 'asc';
  //   if (id !== '') {
  //     setOrder(isAsc ? 'desc' : 'asc');
  //     setOrderBy(id);
  //   }
  // };
  const onSort = (id) => {
    if (!id) return
    // const sort = queryString?.sort
    // const order = queryString?.order
    const isAsc = sort === id && order === 'ASC'
    navigateUrl({sort: `${id}@${isAsc ? 'DESC' : 'ASC'}`})
    // navigateUrl({sort: id, order: (isAsc ? 'DESC' : 'ASC').toUpperCase()})
    // setOrder(isAsc ? 'desc' : 'asc');
    // setOrderBy(id);
  }

  const onSelectRow = (data) => {
    // console.log('* * * onSelectRow : ', { id, selectedIndex });
    const newSelectedObject = {...(selectedObject && selectedObject)}
    if (newSelectedObject[data?.id]) {
      delete newSelectedObject[data?.id]
    } else {
      if (maxRowSelect && +maxRowSelect?.count === +selected?.length) {
        toast.info(maxRowSelect?.error)
        return
      }
      newSelectedObject[data?.id] = data
    }
    setSelectedObject(newSelectedObject)
    setSelected(Object.values(newSelectedObject))
  }

  const onResetSelectedRow = () => {
    setSelected()
    setSelectedObject()
  }

  const onSelectAllRows = (checked, newSelecteds) => {
    if (checked) {
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const onChangePage = (newPage) => {
    console.log({newPage})
    // setPage(newPage);
    navigateUrl({page: newPage})
  }

  const onChangeRowsPerPage = (event) => {
    // setRowsPerPage(parseInt(event.target.value, 10));
    // setPage(0);
    navigateUrl({page: 1, perPage: parseInt(event.target.value, 10)})
  }

  const setFilter = (key, value) => {
    console.log('* * * useTable setFilter', {key, value})
    navigateUrl({[key]: value, page: 1})
  }

  const onChangeDense = (event) => {
    setDense(event.target.checked)
  }
  const onSearch = (text) => {
    navigateUrl({searchQuery: text, page: 1})
  }

  const {debounce} = useDebounce({setDebounce: (x) => onSearch(x)})

  // filter

  return {
    sort,
    order,
    dense,
    page: page || queryString?.page,
    setPage,
    rowsPerPage: rowsPerPage || queryString?.limit,
    limit: queryString?.limit,
    //
    selected,
    selectedObject,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangePage,
    onChangeDense,
    onChangeRowsPerPage,

    onSearch: debounce,
    search: queryString?.searchQuery,
    queryString,
    setFilter,
  }
}

// ----------------------------------------------------------------------

export function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0
}
