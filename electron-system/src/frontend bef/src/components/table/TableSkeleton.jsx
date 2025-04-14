// @mui
import { TableRow, TableCell, Stack, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export default function TableSkeleton({ cols, rows, ...other }) {
  return (
    <>
      {Array(cols)
        ?.fill()
        ?.map(() => {
          return (
            <TableRow {...other}>
              {Array(rows)
                ?.fill()
                ?.map(() => {
                  return (
                    <TableCell>
                      <Skeleton variant="text" width={'100%'} height={20} />{' '}
                    </TableCell>
                  );
                })}
            </TableRow>
          );
        })}
    </>
  );
}
