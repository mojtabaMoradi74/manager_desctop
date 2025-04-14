import { Box, Grid, Stack, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { RHFCheckbox } from '../../../../../components/hook-form/RHFCheckbox';

const DashboardTravels = ({ data, label, ...props }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: 150 }}>{label}</TableCell>
          <TableCell sx={{ width: 50 }}>{'ایجاد کردن'}</TableCell>
          <TableCell sx={{ width: 50 }}>{'دیدن'}</TableCell>
          <TableCell sx={{ width: 50 }}>{'ویرایش'}</TableCell>
          <TableCell sx={{ width: 50 }}>{'حذف'}</TableCell>
          <TableCell sx={{ width: 50 }}>{'تایید'}</TableCell>
        </TableRow>
      </TableHead>
      {
        <TableBody>
          {Object.values(data || {})?.map((x) => (
            <TableRow>
              <TableCell>{x?.label}</TableCell>
              <TableCell>
                {' '}
                {x?.object?.create?.id ? (
                  <RHFCheckbox {...props} name={x?.object?.create?.id?.toString()} label="" />
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {' '}
                {x?.object?.read?.id ? <RHFCheckbox {...props} name={x?.object?.read?.id?.toString()} label="" /> : ''}
              </TableCell>
              <TableCell>
                {' '}
                {x?.object?.update?.id ? (
                  <RHFCheckbox {...props} name={x?.object?.update?.id?.toString()} label="" />
                ) : (
                  ''
                )}
              </TableCell>
              <TableCell>
                {' '}
                {x?.object?.delete?.id ? (
                  <RHFCheckbox {...props} name={x?.object?.delete?.id?.toString()} label="" />
                ) : (
                  ''
                )}
              </TableCell>
              <TableCell>
                {' '}
                {x?.object?.confirm?.id ? (
                  <RHFCheckbox {...props} name={x?.object?.confirm?.id?.toString()} label="" />
                ) : (
                  ''
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      }
    </Table>
  );
};

export default DashboardTravels;
