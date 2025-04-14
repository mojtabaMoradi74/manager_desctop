import { Typography, Box } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const QuestionComponent = ({ title, button, description, disabled, data, ...props }) => {
	const [loading, setLoading] = useState();
	console.log("* * * QuestionComponent", { data });
	const { t } = useTranslation();
	return (
		<Box
			sx={{
				width: "100vw",
				maxWidth: "500px",
				// display: { xs: 'block', md: 'flex' },
				gap: 2,
				bgcolor: "background.paper",
				borderRadius: "8px",
				p: 4,
			}}>
			<DialogTitle
				sx={{
					p: 0,
				}}>
				{t(title)}
			</DialogTitle>
			<DialogContent
				sx={{
					p: 0,
					my: 3,
					overflow: "unset",
				}}>
				<DialogContentText>{t(description)}</DialogContentText>
			</DialogContent>
			<DialogActions
				sx={{
					display: "flex",
					mt: 3,
					gap: 3,
				}}>
				{button?.reject ? (
					<LoadingButton
						fullWidth
						type="click"
						variant="outlined"
						loading={button?.reject?.loading}
						disabled={button?.reject?.disabled || props?.loading || disabled || loading}
						color="success"
						onClick={(e) => {
							button?.reject?.onClick(e, data);
						}}>
						{t(button?.reject?.label) || t("cancel")}
					</LoadingButton>
				) : (
					""
				)}

				{button?.confirm ? (
					<LoadingButton
						fullWidth
						type="submit"
						variant="contained"
						color={button?.confirm?.color || "success"}
						loading={button?.confirm?.loading || props?.loading || loading}
						disabled={button?.confirm?.disabled}
						onClick={(e) => {
							setLoading(true);

							button?.confirm?.onClick(e, data);
						}}>
						{t(button?.confirm?.label) || t("accept")}
					</LoadingButton>
				) : (
					""
				)}
			</DialogActions>
		</Box>
	);
};

export default QuestionComponent;
