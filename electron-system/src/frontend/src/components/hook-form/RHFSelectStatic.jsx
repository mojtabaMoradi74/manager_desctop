import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { MenuItem, TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFSelectStatic.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
};

export default function RHFSelectStatic({ name, options, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{ native: true }}
          error={!!error}
          helperText={error?.message}
          {...other}
        >
          {options?.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
