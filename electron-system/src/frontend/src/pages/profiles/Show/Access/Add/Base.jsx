import { Box, Grid, Stack, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { RHFCheckbox } from '../../../../../components/hook-form/RHFCheckbox';

const BasePermissions = ({ data, label, ...props }) => {
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
      {data?.object ? (
        <TableBody>
          <TableRow>
            <TableCell>{data?.label}</TableCell>
            <TableCell>
              {' '}
              {data?.object?.create?.id ? (
                <RHFCheckbox {...props} name={data?.object?.create?.id?.toString()} label="" />
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell>
              {' '}
              {data?.object?.read?.id ? (
                <RHFCheckbox {...props} name={data?.object?.read?.id?.toString()} label="" />
              ) : (
                ''
              )}
            </TableCell>
            <TableCell>
              {' '}
              {data?.object?.update?.id ? (
                <RHFCheckbox {...props} name={data?.object?.update?.id?.toString()} label="" />
              ) : (
                ''
              )}
            </TableCell>
            <TableCell>
              {' '}
              {data?.object?.delete?.id ? (
                <RHFCheckbox {...props} name={data?.object?.delete?.id?.toString()} label="" />
              ) : (
                ''
              )}
            </TableCell>
            <TableCell>
              {' '}
              {data?.object?.confirm?.id ? (
                <RHFCheckbox {...props} name={data?.object?.confirm?.id?.toString()} label="" />
              ) : (
                ''
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        ''
      )}
    </Table>
  );
};

export default BasePermissions;
