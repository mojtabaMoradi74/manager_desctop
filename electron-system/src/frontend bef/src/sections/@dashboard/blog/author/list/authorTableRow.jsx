import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase } from 'change-case';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, Checkbox, TableCell, Typography, MenuItem } from '@mui/material';
// utils
import { fDate } from '../../../../../utils/formatTime';
import { fCurrency } from '../../../../../utils/formatNumber';
// components
import Label from '../../../../../components/Label';
import Image from '../../../../../components/Image';
import Iconify from '../../../../../components/Iconify';
import { TableMoreMenu } from '../../../../../components/table';
//

// ----------------------------------------------------------------------

AuthorTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function AuthorTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();

  const { name, id, createdAt,thumbnail } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <Image disabledEffect alt={name} src={`${thumbnail}?id=${id}`} sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }} /> */}
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      {/* <TableCell>{fDate(createdAt)}</TableCell> */}

      {/* <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (inStock === 0 && 'error') || (inStock < 10 && 'warning') || 'success'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {(inStock === 0 && 'اتمام موجودی!') || (inStock < 10 && `تنها ${inStock}  عدد باقی مانده است`) || `${inStock} عدد باقی مانده است`}
        </Label>
      </TableCell> */}

      {/* <TableCell align="right">{fCurrency(price)}</TableCell> */}

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                // onClick={() => {
                //   onDeleteRow();
                //   handleCloseMenu();
                // }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                پاک کردن
              </MenuItem>
              <MenuItem
                // onClick={() => {
                //   onEditRow();
                //   handleCloseMenu();
                // }}
              >
                <Iconify icon={'eva:edit-fill'} />
                ویرایش
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
