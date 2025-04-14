// ----------------------------------------------------------------------

export default function Button(theme) {
	return {
		MuiButton: {
			styleOverrides: {
				root: ({ ownerState }) => {
					console.log({ ownerState });
					return {
						"&:hover": {
							boxShadow: "none",
						},
						borderRadius: "7px",
						cursor: "pointer",
						textTransform: "capitalize",

						// ...(ownerState.variant === "contained" &&
						// 	ownerState.color === "grey" && {
						// 		backgroundColor: theme.palette.grey[200],
						// 		color: theme.palette.grey[600],
						// 		"&:hover": {
						// 			backgroundColor: theme.palette.grey[300],
						// 		},
						// 		boxShadow: "none",
						// 		border: "1px solid",
						// 		borderColor: theme.palette.grey[300],
						// 	}),
					};
				},
				sizeLarge: {
					height: 48,
				},
				// contained
				containedInherit: {
					color: theme.palette.grey[600],
					boxShadow: theme.customShadows.z8,
					"&:hover": {
						backgroundColor: theme.palette.grey[300],
					},
				},
				containedPrimary: {
					boxShadow: theme.customShadows.primary,
				},
				containedSecondary: {
					boxShadow: theme.customShadows.secondary,
				},
				containedInfo: {
					boxShadow: theme.customShadows.info,
				},
				containedSuccess: {
					boxShadow: theme.customShadows.success,
				},
				containedWarning: {
					boxShadow: theme.customShadows.warning,
				},
				containedError: {
					boxShadow: theme.customShadows.error,
				},
				// outlined
				outlinedInherit: {
					border: `1px solid ${theme.palette.grey[500_8]}`,
					"&:hover": {
						backgroundColor: theme.palette.action.hover,
					},
				},
				textInherit: {
					"&:hover": {
						backgroundColor: theme.palette.action.hover,
					},
				},
			},
		},
	};
}
