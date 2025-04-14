export default function Input(theme) {
  return {
    MuiInput: {
      styleOverrides: {
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'inherit', // Ensure the focus outline remains the same
        },
        underline: {
          '&:after': {
            borderBottom: 'none', // Remove the focus underline
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        underline: {
          '&:after': {
            borderBottom: 'none', // Remove the focus underline
          },
        },
        root: {
          '&.Mui-focused': {
            backgroundColor: 'inherit', // Remove the focus background color
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'inherit', // Remove the focus border color
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'inherit', // Ensure the focus outline remains the same
          },
        },
      },
    },
  };
}
