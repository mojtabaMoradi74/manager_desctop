/* eslint-disable */

import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loading = (props) => {
	return (
		<Box sx={{ display: "flex" }}>
			<CircularProgress size={"15px"} {...props} />
		</Box>
	);
};

export default Loading;
