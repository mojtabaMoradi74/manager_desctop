import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextareaAutosize, TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFTextareaField.propTypes = {
  name: PropTypes.string,
};

export default function RHFTextareaField({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          value={field.value || ''}
          fullWidth
          error={!!error}
          helperText={error?.message}
          multiline
          rows={4}
          {...other}
        />
      )}
    />
  );
}
