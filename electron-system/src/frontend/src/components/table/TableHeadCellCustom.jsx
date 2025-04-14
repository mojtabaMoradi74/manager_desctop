/* eslint-disable */
import PropTypes from 'prop-types'
// @mui
import {
  Box,
  Checkbox,
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel,
  Typography,
  Select,
  MenuItem,
  ListItemText,
  Menu,
  Button,
} from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import {useState} from 'react'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import {useTranslation} from 'react-i18next'
// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

// TableHeadCellCustom.propTypes = {
//   onSort: PropTypes.func,
//   sort: PropTypes.string,
//   headLabel: PropTypes.array,
//   rowCount: PropTypes.number,
//   numSelected: PropTypes.number,
//   onSelectAllRows: PropTypes.func,
//   order: PropTypes.oneOf(['asc', 'desc']),
//   sx: PropTypes.object,
// };

export default function TableHeadCellCustom({
  onSort,
  sort,
  order,
  field,
  filter,
  free,
  headProps,
  header,
  filterValue,
  setFilter,
}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState()
  const {t} = useTranslation()

  // console.log('* * * TableHeadCellCustom :', {
  //   selected,
  //   filterValue,
  //   field,
  //   filter,
  // });

  const handleAdd = (data) => {
    // console.log('* * * TableHeadCellCustom handleAdd', { filterValue, value: data?.value });
    if (filter?.multiple) {
      let newVal = filterValue || []
      // console.log('* * * TableHeadCellCustom handleAdd', { newVal });
      let filterVal = newVal?.filter((x) => x != data?.value)
      // console.log('* * * TableHeadCellCustom handleAdd', { newVal, filterVal });

      if (filterVal?.length === newVal?.length) newVal.push(data?.value)
      else newVal = filterVal
      // newVal = newVal?.map((x) => +x);
      // let key = `${field}[]`; //newVal?.length == 1 ? `${field}[]` : field;
      // console.log('* * * TableHeadCellCustom handleAdd', { field, newVal });
      setFilter(field, newVal?.length ? newVal : undefined)
    } else {
      setFilter(field, filterValue == data?.value ? undefined : data?.value)
    }
    // setSelected(data);
  }

  const handleToggle = (event) => {
    setOpen(event?.currentTarget)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }
  return (
    <TableCell
      sortDirection={sort === field ? order : false}
      sx={{
        ...(!free && {minWidth: 150}),
        ...headProps?.sx,
      }}
      {...headProps}
    >
      {filter?.sortable ? (
        <TableSortLabel
          hideSortIcon
          active={sort === field}
          direction={sort === field ? order?.toLocaleLowerCase() : 'asc'}
          onClick={() => onSort(field)}
          sx={{textTransform: 'capitalize'}}
        >
          {t(header)}

          {sort === field ? (
            <Box sx={{...visuallyHidden}}>
              {' '}
              {order === 'DESC' ? 'sorted descending' : 'sorted ascending'}
            </Box>
          ) : null}
        </TableSortLabel>
      ) : filter?.lookup ? (
        <Box
          display={'flex'}
          alignItems={'center'}
          sx={{
            cursor: 'pointer',
            '.rtl-9q3kl4-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input': {
              py: '0 !important',
              border: '0 !important',
            },
            '.MuiSelect-nativeInput': {
              border: '0 !important',
            },
            '.MuiOutlinedInput-notchedOutline': {
              border: '0 !important',
            },
            '.rtl-1uvz7wx-MuiInputBase-root-MuiOutlinedInput-root-MuiSelect-root': {
              fontSize: 'inherit',
              fontFamily: 'inherit',
              color: 'inherit',
              fontWeight: 'inherit',
            },
            // input: {
            //   fontSize: 'inherit',
            //   fontFamily: 'inherit',
            //   color: 'inherit',
            // },
          }}
        >
          <div
            id='demo-positioned-button'
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleToggle}
            color='inherit'
          >
            {t(header)}
            <FilterAltIcon fontSize='11' />
          </div>
          <Menu
            id='demo-positioned-menu'
            aria-labelledby='demo-positioned-button'
            anchorEl={open}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {filter?.lookup?.map((x) => (
              <MenuItem
                key={x?.label}
                // value={x?.value}
                sx={{
                  display: 'flex',
                  gap: 1,
                  minWidth: '200px',
                }}
                onClick={() => handleAdd(x)}
              >
                <Checkbox
                  color='success'
                  checked={
                    // false
                    filter?.multiple
                      ? (filterValue || [])?.includes(String(x.value))
                      : filterValue == x.value
                    // personName.indexOf(name) > -1
                  }
                />
                <ListItemText primary={x?.label} />
              </MenuItem>
            ))}
            {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem> */}
          </Menu>
          {/* <Box onClick={handleOpen}>{header}</Box> */}
          {/* <Select
            labelId='demo-multiple-checkbox-label'
            id='demo-multiple-checkbox'
            // multiple={filter?.multiple}
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={header}
            // onChange={(e, data) => {
            //   console.log('* * * TableHeadCellCustom :', { e, data });
            // }}
            // input={<input label="Tag" />}
            renderValue={() => header}

            // MenuProps={MenuProps}
          >
            {filter?.lookup?.map((x) => (
              <MenuItem
                key={x?.label}
                // value={x?.value}
                sx={{
                  display: 'flex',
                  gap: 1,
                }}
                onClick={() => handleAdd(x)}
              >
                <Checkbox
                  color='success'
                  checked={
                    // false
                    filter?.multiple
                      ? (filterValue || [])?.includes(String(x.value))
                      : filterValue == x.value
                    // personName.indexOf(name) > -1
                  }
                />
                <ListItemText primary={x?.label} />
              </MenuItem>
            ))}
          </Select> */}
          {/* {filter?.lookup ? (
            <Box display={'flex'} alignItems={'center'}>
              <ArrowDropDownIcon />
            </Box>
          ) : (
            ''
          )} */}
        </Box>
      ) : (
        t(header)
      )}
      {/* {header} */}
    </TableCell>
  )
}
