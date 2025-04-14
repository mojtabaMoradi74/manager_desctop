import {Autocomplete, Chip, TextField} from '@mui/material'

const SelectorComponent = ({
  options = [],
  label,
  require,
  name,
  inputProps,
  onChange,
  error,
  ...other
}) => {
  return (
    <>
      <Autocomplete
        noOptionsText={'Data not found !'}
        // multiple
        id={name}
        // freeSolo
        loadingText={'Please wait . . .'}
        onChange={(event, newValue) => {
          onChange?.(newValue)
        }}
        options={options}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip {...getTagProps({index})} key={option?.value} size='small' label={option.label} />
          ))
        }
        // onClose
        // popupIcon={<ArrowDropDownIcon />}
        // clearIcon={<Close />}
        renderInput={(params) => {
          return (
            <TextField
              label={label}
              variant='outlined'
              error={error}
              helperText={error?.message}
              {...params}
              InputProps={{
                ...inputProps,
                ...params.InputProps,
              }}
            />
          )
        }}
        {...other}
      />
    </>
  )
}

export default SelectorComponent
