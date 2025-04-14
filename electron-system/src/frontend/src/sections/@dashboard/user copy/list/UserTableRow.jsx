/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem, Stack, Button } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { toPersianDate } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();

  const { _id, email, status, createdAt } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected} sx={{
      borderBottom: `2px solid rgba(145, 158, 171, 0.08)`
    }}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <Avatar alt={name} src={avatarUrl} sx={{ mr: 2 }} /> */}
        <Typography variant="subtitle2" noWrap sx={{ mt: 1 }}>
          {email}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(status === 'banned' && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {status ? "Active" : "DeActive"}
        </Label>
      </TableCell>

      {/* <TableCell align="center">
        <Iconify
          icon={isVerified ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
          sx={{
            width: 20,
            height: 20,
            color: 'success.main',
            ...(!isVerified && { color: 'warning.main' }),
          }}
        />
      </TableCell> */}

      <TableCell align="left">
        {createdAt && toPersianDate(createdAt)}
      </TableCell>

      <TableCell align="right">

        <Stack direction={"row"} gap={1} justifyContent={"end"}>
          <Button
            variant="contained"
            color='grey'
            onClick={onEditRow}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color='grey'
            onClick={onDeleteRow}
          >
            Delete
          </Button>
        </Stack>


        {/* <TableMoreMenu
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
        /> */}
      </TableCell>
    </TableRow>
  );
}
