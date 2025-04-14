import { Box, Grid, Stack, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { RHFCheckbox } from '../../../../../components/hook-form/RHFCheckbox';

const DashboardPermissions = ({ admin, client, ...props }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: 150 }}>{'داشبورد'}</TableCell>
          <TableCell sx={{ width: 50 }}>{'ایجاد کردن'}</TableCell>
          <TableCell sx={{ width: 50 }}>{'دیدن'}</TableCell>
          <TableCell sx={{ width: 50 }}>{'ویرایش'}</TableCell>
          <TableCell sx={{ width: 50 }}>{'حذف'}</TableCell>
          <TableCell sx={{ width: 50 }}>{'تایید'}</TableCell>
        </TableRow>
      </TableHead>
      {admin?.object ? (
        <TableBody>
          <TableRow>
            <TableCell>{admin?.label}</TableCell>
            <TableCell>
              {' '}
              {admin?.object?.create?.id ? (
                <RHFCheckbox {...props} name={admin?.object?.create?.id?.toString()} label="" />
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell>
              {' '}
              {admin?.object?.read?.id ? (
                <RHFCheckbox {...props} name={admin?.object?.read?.id?.toString()} label="" />
              ) : (
                ''
              )}
            </TableCell>
            <TableCell>
              {' '}
              {admin?.object?.update?.id ? (
                <RHFCheckbox {...props} name={admin?.object?.update?.id?.toString()} label="" />
              ) : (
                ''
              )}
            </TableCell>
            <TableCell>
              {' '}
              {admin?.object?.delete?.id ? (
                <RHFCheckbox {...props} name={admin?.object?.delete?.id?.toString()} label="" />
              ) : (
                ''
              )}
            </TableCell>
            <TableCell>
              {' '}
              {admin?.object?.confirm?.id ? (
                <RHFCheckbox {...props} name={admin?.object?.confirm?.id?.toString()} label="" />
              ) : (
                ''
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        ''
      )}

      {client?.object ? (
        <TableBody>
          <TableRow>
            <TableCell>{client?.label}</TableCell>
            <TableCell>
              {' '}
              {client?.object?.create?.id ? (
                <RHFCheckbox {...props} name={client?.object?.create?.id?.toString()} label="" />
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell>
              {' '}
              {client?.object?.read?.id ? (
                <RHFCheckbox {...props} name={client?.object?.read?.id?.toString()} label="" />
              ) : (
                ''
              )}
            </TableCell>
            <TableCell>
              {' '}
              {client?.object?.update?.id ? (
                <RHFCheckbox {...props} name={client?.object?.update?.id?.toString()} label="" />
              ) : (
                ''
              )}
            </TableCell>
            <TableCell>
              {' '}
              {client?.object?.delete?.id ? (
                <RHFCheckbox {...props} name={client?.object?.delete?.id?.toString()} label="" />
              ) : (
                ''
              )}
            </TableCell>
            <TableCell>
              {' '}
              {client?.object?.confirm?.id ? (
                <RHFCheckbox {...props} name={client?.object?.confirm?.id?.toString()} label="" />
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

export default DashboardPermissions;
