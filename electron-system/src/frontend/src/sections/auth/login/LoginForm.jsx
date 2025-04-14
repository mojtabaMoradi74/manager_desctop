import * as Yup from "yup";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "src/utils/axios";
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// routes
import { PATH_AUTH } from "../../../routes/paths";
// hooks
import useAuth from "../../../hooks/useAuth";
import useIsMountedRef from "../../../hooks/useIsMountedRef";
// components
import Iconify from "../../../components/Iconify";
import { FormProvider, RHFTextField, RHFCheckbox } from "../../../components/hook-form";
import { getAdminProfile } from "../../../redux/slices/user";
import errorsText from "../../../utils/errorsText";
import api from "src/services/api";
import regex from "src/enumeration/regex";

// ----------------------------------------------------------------------

export default function LoginForm({ goToVerify }) {
	const { login } = useAuth();

	const dispatch = useDispatch();

	const isMountedRef = useIsMountedRef();

	const [showPassword, setShowPassword] = useState(false);

	const LoginSchema = Yup.object().shape({
		mobileNumber: Yup.string().required(errorsText.blankError()).matches(regex.mobile, errorsText.invalidPhoneNumber()),
		// email: Yup.string().email(errorsText.blankError()).required(errorsText.blankError()),
		password: Yup.string().required(errorsText.blankError()),
	});

	const defaultValues = {
		mobileNumber: "",
		// email: '',
		remember: true,
	};

	const methods = useForm({
		resolver: yupResolver(LoginSchema),
		defaultValues,
	});

	const {
		reset,
		setError,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = methods;

	const onSubmit = async (data) => {
		try {
			console.log("* * * LoginForm onSubmit :", { data });
			// await login(data.email, data.password)
			const response = await axiosInstance().post(api.auth.login, {
				mobileNumber: data.mobileNumber,
				password: data.password,
			});
			console.log("* * * LoginForm onSubmit :", { response });

			goToVerify(response?.data);
			// dispatch(getAdminProfile());
		} catch (error) {
			console.log({ error });
			// reset();
			// if (isMountedRef.current) {
			setError("afterSubmit", { ...error, message: error?.response?.data?.message });
			// }
		}
	};
	console.log({ errors });

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={3}>
				{/* {!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>} */}

				<RHFTextField name={"mobileNumber"} label="شماره موبایل" />

				<RHFTextField
					name="password"
					label="پسورد"
					type={showPassword ? "text" : "password"}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
									<Iconify icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
			</Stack>

			{/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
          Forgot password?
        </Link>
      </Stack> */}

			<LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 2 }}>
				تایید
			</LoadingButton>
		</FormProvider>
	);
}
