import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Checkbox, FormHelperText } from '@mui/material';

// ----------------------------------------------------------------------

RHFCheckboxGroups.propTypes = {
  name: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  getOptionLabel: PropTypes.arrayOf(PropTypes.string),
};

export default function RHFCheckboxGroups({ label, name, options, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          {/* <RadioGroup {...field} row {...other}>
            {options.map((option, index) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={getOptionLabel?.length ? getOptionLabel[index] : option}
              />
            ))}
          </RadioGroup> */}

          <FormControl fullWidth>
            <FormLabel
              sx={{
                borderBottom: '1px solid',
                pb: 1,
              }}
              id="demo-row-radio-buttons-group-label"
            >
              {label}
            </FormLabel>
            <RadioGroup row>
              {options?.map((x, index) => {
                const handleChange = (e, event) => {
                  let values = field.value ? [...field.value] : [];
                  const checked = e.target.checked;
                  console.log({ e, event, values, checked });
                  if (checked) values.push(x);
                  else {
                    values = values?.filter((y) => y.value !== x.value);
                  }
                  field.onChange(values);
                };

                const isChecked = field.value?.some((y) => y.value === x?.value);

                return (
                  <FormControlLabel
                    key={x.value}
                    value={x.value}
                    checked={isChecked}
                    onChange={(e, event) => handleChange(e, event)}
                    control={<Checkbox color={'success'} />}
                    label={x.label}
                  />
                );
              })}

              {/* <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
              <FormControlLabel value="disabled" disabled control={<Radio />} label="other" /> */}
            </RadioGroup>
          </FormControl>
          {!!error && (
            <FormHelperText error sx={{ px: 2 }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}
