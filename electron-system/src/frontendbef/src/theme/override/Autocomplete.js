// ----------------------------------------------------------------------

export default function Autocomplete(theme) {
	console.log({ aa: theme.customShadows.dropdown });
	return {
		MuiAutocomplete: {
			styleOverrides: {
				root: {
					// boxShadow: "10px 10px 10px #000",
					// boxShadow: theme.customShadows.dropdown,
					borderColor: "#fff",
					borderRadius: "12px !important",
					// "&:focused": {
					// 	color: "inherit !important",
					// 	borderColor: "inherit !important", // Ensure the focus outline remains the same
					// },
					// "&:hover": {
					// 	borderColor: theme.palette.grey[300],
					// 	borderColor: "inherit !important",
					// 	// backgroundColor: "#000",
					// },
					svg: {
						// color: theme.palette.grey[400],
						// fill: theme.palette.grey[400],
					},
					// MuiInputBase
					"& .MuiOutlinedInput-root": {
						padding: "0 1rem",
						borderColor: theme.palette.grey[500_32], // default border color
						"& fieldset": {
							borderColor: theme.palette.grey[500_32], // default border color
						},
						"&:hover fieldset": {
							borderColor: theme.palette.grey[500_16], // border color on hover
						},
						"&.Mui-focused fieldset": {
							borderColor: theme.palette.grey[500_16], // border color on focus
						},
					},
					"&.fee": {
						"& fieldset": {
							borderColor: theme.palette.primary.main,
						},
						"&:hover fieldset": {
							borderColor: theme.palette.primary.main, // border color on hover
						},
						"&.Mui-focused  fieldset": {
							boxShadow: `0px 0px 10px ${theme.palette.primary.main}`, // border color on hover
						},
					},
				},
				paper: {
					boxShadow: theme.customShadows.dropdown,
					// boxShadow: "10px 10px 10px #000",
					// boxShadow: theme.customShadows.dropdown,
				},
				listbox: {
					boxShadow: theme.customShadows.dropdown,

					// padding: theme.spacing(0, 1),
					// backgroundColor: theme.palette.grey[50],

					// backgroundColor: "#000",
					// boxShadow: theme.customShadows.dropdown,
					"& .MuiAutocomplete-option": {
						// padding: theme.spacing(1),
						// margin: theme.spacing(1, 0),
						borderRadius: "12px !important",

						// color: "red",
					},
				},
			},
		},
	};
}
