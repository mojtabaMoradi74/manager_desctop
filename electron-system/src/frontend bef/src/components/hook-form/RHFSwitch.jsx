import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Switch, FormControlLabel } from '@mui/material';

// ----------------------------------------------------------------------

RHFSwitch.propTypes = {
  name: PropTypes.string,
};

export default function RHFSwitch({ name, withState = false, label, onChange = () => null, ...other }) {
  const { control } = useFormContext();

  if (withState) {
    return (
      // <FormControlLabel
      //   control={
      //     <Controller control={<Switch onChange={onChange} {...other} />} />
      //   }
      //   // {...other}
      // />
      <FormControlLabel
          control={
            <Switch  onChange={onChange} name={name} {...other}/>
          }
          label={label}
        />
    );

  }
  return (
    <FormControlLabel
      control={
        <Controller name={name} control={control} render={({ field }) => <Switch {...field} checked={field.value} />} />
      }
      {...other}
    />
  );



}
