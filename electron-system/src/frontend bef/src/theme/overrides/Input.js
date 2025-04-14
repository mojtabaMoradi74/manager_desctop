// ----------------------------------------------------------------------

// export default function Input(theme) {
//   return {
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           // borderColor: '#000',
//           // color: 'blue',
//           // this is styles for the new variants
//           // '&.subvariant-hovered': {
//           //   '& fieldset': {
//           //     border: 'none',
//           //   },
//           //   '& .MuiInputBase-input:hover + fieldset': {
//           //     border: `2px solid blue`,
//           //   },
//           //   '& .MuiInputBase-input:focus + fieldset': {
//           //     border: `2px solid blue`,
//           //   },
//           // },
//           '.Mui-focused': {
//             borderColor: '#000',
//             color: 'blue',
//             '.MuiOutlinedInput-notchedOutline': {
//               borderColor: 'inherit', // Ensure the focus outline remains the same
//             },
//           },
//           '&.Mui-focused ': {
//             borderColor: '#000',
//             color: 'blue',
//             '.MuiOutlinedInput-notchedOutline': {
//               borderColor: 'inherit', // Ensure the focus outline remains the same
//             },
//           },
//           '& .Mui-focused': {
//             borderColor: '#000',
//             color: 'blue',
//             '.MuiOutlinedInput-notchedOutline': {
//               borderColor: 'inherit', // Ensure the focus outline remains the same
//             },
//           },
//         },
//       },
//     },
//     MuiInput: {
//       styleOverrides: {
//         underline: {
//           '&:after': {
//             borderBottom: 'none', // Remove the focus underline
//           },
//         },
//       },
//     },
//     MuiFilledInput: {
//       styleOverrides: {
//         underline: {
//           '&:after': {
//             borderBottom: 'none', // Remove the focus underline
//           },
//         },
//         root: {
//           '&.Mui-focused': {
//             backgroundColor: 'inherit', // Remove the focus background color
//           },
//         },
//       },
//     },
//     MuiOutlinedInput: {
//       styleOverrides: {
//         root: {
//           '& .MuiOutlinedInput-notchedOutline': {
//             borderColor: 'inherit', // Remove the focus border color
//           },
//           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//             borderColor: 'inherit', // Ensure the focus outline remains the same
//           },
//         },
//       },
//     },
//   };
// }

export default function Input(theme) {
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          // color: theme.palette.grey[100],
          // borderColor: theme.palette.grey[500],
          // '& .MuiInputBase-input::placeholder': {
          //   color: theme.palette.grey[100], // Placeholder color
          //   opacity: 1, // Ensures full color visibility
          // },
          // '& .MuiOutlinedInput-root': {
          //   '& .MuiOutlinedInput-notchedOutline': {
          //     borderColor: theme.palette.grey[500], // Initial border color
          //   },
          //   '&:hover .MuiOutlinedInput-notchedOutline': {
          //     borderColor: theme.palette.grey[300], // Border color on hover
          //   },
          //   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          //     borderColor: theme.palette.grey[300], // Border color when focused
          //   },
          // },
          // '&.Mui-focused ': {
          //   borderColor: '#000',
          //   color: 'blue',
          //   '.MuiOutlinedInput-notchedOutline': {
          //     borderColor: 'inherit',
          //   },
          // },
          '& .Mui-focused': {
            color: 'inherit !important',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'inherit !important', // Ensure the focus outline remains the same
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            '& svg': {color: theme.palette.text.disabled},
          },
        },
        input: {
          '&::placeholder': {
            opacity: 1,
            color: theme.palette.text.disabled,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.grey[500_56],
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.grey[500_12],
          '&:hover': {
            backgroundColor: theme.palette.grey[500_16],
          },
          '&.Mui-focused': {
            backgroundColor: theme.palette.action.focus,
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
          },
        },
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.grey[500_56],
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.grey[500_32],
          },
          '&.Mui-disabled': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.action.disabledBackground,
            },
          },
        },
      },
    },
  }
}
