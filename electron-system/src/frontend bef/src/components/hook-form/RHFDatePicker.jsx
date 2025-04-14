import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Box, MenuItem, TextField, InputAdornment } from '@mui/material';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persianFa from 'react-date-object/locales/persian_fa';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import { DateRange } from '@mui/icons-material';
import { useRef } from 'react';
// ----------------------------------------------------------------------

RHFDatePicker.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
};

export default function RHFDatePicker({ name, options, pickerProps, withTime, ...other }) {
  const { control } = useFormContext();
  const inputRef = useRef();
  function CustomInput({ onFocus, value, onChange, error }) {
    console.log({ name, value, error }, { other });
    return (
      <Box
      // sx={{
      //   direction: 'ltr',
      // }}
      >
        <TextField
          sx={{
            width: '100%',
          }}
          onFocus={onFocus}
          value={value || ''}
          onChange={onChange}
          error={!!error}
          helperText={error?.message}
          inputRef={inputRef}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" onClick={() => inputRef.current.focus()}>
                <Box>
                  <DateRange />
                </Box>
              </InputAdornment>
            ),
          }}
          {...other}
          // onKeyUpCapture={onChange}
        />
      </Box>
    );
  }
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box
          sx={{
            '.rmdp-container': {
              width: '100%',
              display: 'flex !important',
              height: 'auto !important',

              '& > div:first-child': {
                width: '100%',
                // direction: 'ltr',
              },
            },
            '.rmdp-input': {
              // lineHeight: '1.4375em',
              // fontSize: '1rem',
              // fontFamily: 'IRANYekan, sans-serif',
              // fontWeight: '400',
              // color: '#212B36',
              // boxSizing: 'border-box',
              // position: 'relative',
              // cursor: 'text',
              // display: 'inline-flex',
              // alignItems: 'center',
              // width: '100%',
              // borderRadius: '8px',
              font: 'inherit',
              letterSpacing: 'inherit',
              color: 'currentColor',
              // border: '0',
              boxSizing: 'content-box',
              // background: 'none',
              height: '1.4375em',
              // margin: '0',
              // minWidth: '0',
              flex: 1,
              // maxWidth: '100%',
              width: '100%',
              // animationName: 'mui-auto-fill-cancel',
              // animationDuration: '10ms',
              padding: '16.5px 14px',
              display: 'flex',
              border: '1px solid',
              borderColor: 'rgba(145, 158, 171, 0.32)',
            },
          }}
        >
          <DatePicker
            {...field}
            // containerClassName=""
            // inputClass={"siteTempInput" + (inputClassName ? ` ${inputClassName}` : "")}
            calendar={persian}
            locale={persianFa}
            // onChange={onChange}
            onChange={(value) => field.onChange(value?.toDate?.())}
            // format={'YYYY/MM/DD'}
            // style={{
            //   width: '100%',
            //   border: '1px solid #E1E1E3',
            //   borderRadius: 8,
            //   fontSize: '16px',
            //   fontFamily: 'sans-serif',
            //   padding: 15,
            // }}
            // containerStyle={{}}
            // renderInput={(params) => (
            //   <TextField {...params} {...other} fullWidth error={!!error} helperText={error?.message} />
            // )}
            render={<CustomInput error={error} />}
            format={withTime ? 'YYYY/MM/DD, HH:mm:ss' : 'YYYY/MM/DD'}
            // format="YYYY/MM/DD, HH:mm:ss"
            formattingIgnoreList={['Date', 'Time']}
            plugins={withTime ? [<TimePicker position="bottom" />] : undefined}
            // render={(value, openCalendar) => {
            //   return (
            //     <TextField onClick={openCalendar} {...other}>
            //       {value}
            //     </TextField>
            //   );
            // }}
            {...pickerProps}
          />
        </Box>
      )}
    />
  );
}
