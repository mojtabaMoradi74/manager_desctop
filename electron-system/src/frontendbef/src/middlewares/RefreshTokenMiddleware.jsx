/* eslint-disable react/no-unstable-nested-components */
import { useMemo } from "react";
import PropTypes from "prop-types";
import { useQueryClient } from "react-query";
import { useEffect } from "react";
import useTokenStore from "../store/TokenStore";
import useUserStore from "../store/UserStore";
import { getTimeRemaining } from "../utils/dating";
import LoadingScreen from "../components/LoadingScreen";
import { useLocation } from "react-router-dom";
// ----------------------------------------------------------------------
// {"state":{"data":{"refreshToken":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OTJhYmFiYWMzZThhZTEzZjEyZWE2NyIsInVzZXJUeXBlIjoibm9ybWFsIiwidG9rZW5UeXBlIjoicmVmcmVzaCIsImV4cGlyZXNBdCI6MTcyMDk1NDg1NzgyOCwiaWF0IjoxNzIwOTU0MjU3LCJleHAiOjE3MjA5NTQ4NTd9.1_Ry0FE9TPL9D_vG-Ym3yVEiH1-FKjdYkvJuBaaRIM8","expiresAt":1720954857828}},"loading":false,"isFetching":false,"isLoading":false},"version":0}
// ----------------------------------------------------------------------

RefreshTokenMiddleware.propTypes = {
	children: PropTypes.node,
};

export default function RefreshTokenMiddleware({ children }) {
	// const queryClient = useQueryClient();
	// const refreshToken = useSelector(({ token }) => token?.refresh?.token, shallowEqual);
	// const accessState = useSelector(({ token }) => token?.access, shallowEqual);

	const tokenStore = useTokenStore((state) => state);
	const userStore = useUserStore((state) => state);
	const refreshToken = tokenStore?.data?.refreshToken;
	const accessToken = tokenStore?.data?.accessToken;
	const location = useLocation();
	const currentDate = +new Date();
	const valid = refreshToken ? (accessToken?.expiresAt ? accessToken?.expiresAt - currentDate : 0) : 1;
	// if (!valid) queryClient.cancelQueries();
	const showComponent = valid >= 0;

	// console.log("* * * RefreshTokenMiddleware : ", { showComponent, accessToken });

	useEffect(() => {
		if (!accessToken) return;
		userStore.getUser();
	}, []);

	// console.log({ tokenStore });

	useEffect(() => {
		if (showComponent) return;
		if (tokenStore?.isLoading) return;
		tokenStore?.refreshToken();
	}, [showComponent, location]);

	useEffect(() => {
		// if (showComponent) return;
		let timeOut;
		let timeOutRefresh;
		const current = +new Date();

		// if (!accessToken?.token && timeOut) clearTimeout(timeOut);
		// console.log("* * * RefreshTokenMiddleware : ", { refreshToken });

		if (refreshToken) {
			let remainingTimeRefresh = refreshToken?.expiresAt - current - 30000; //- 120000;
			// console.log("* * * RefreshTokenMiddleware : ", { remainingTimeRefreshDate: getTimeRemaining(remainingTimeRefresh / 1000), remainingTimeRefresh });
			const maxTime = 1 * 24 * 60 * 60 * 1000; // 1 days
			if (remainingTimeRefresh > maxTime) remainingTimeRefresh = maxTime;
			// console.log("* * * RefreshTokenMiddleware : ", {
			// 	// newRemainingTimeRefreshDate: getTimeRemaining(remainingTimeRefresh / 1000),
			// 	newRemaining: remainingTimeRefresh,
			// });

			if (remainingTimeRefresh <= 0) {
				userStore.logout();
				if (timeOut) clearTimeout(timeOut);
				// alert("refresh 1");
			} else
				timeOutRefresh = setTimeout(() => {
					userStore.logout();
					if (timeOut) clearTimeout(timeOut);
					// alert("refresh 2");
				}, remainingTimeRefresh);
		} else {
			if (userStore?.data) userStore.logout();
			return;
		}
		// console.log("* * * RefreshTokenMiddleware : ", { accessToken });

		if (accessToken?.token) {
			const remainingTime = accessToken?.expiresAt - current - 10000; //- 120000;
			// console.log("* * * RefreshTokenMiddleware : ", { remainingTimeAccessDate: getTimeRemaining(remainingTime / 1000), remainingTime });

			if (remainingTime <= 0) {
				tokenStore?.refreshToken();
			} else
				timeOut = setTimeout(() => {
					tokenStore?.refreshToken();
					// alert("access");
				}, remainingTime);
		} else if (refreshToken) tokenStore?.refreshToken();

		return () => {
			if (timeOut) clearTimeout(timeOut);
			if (timeOutRefresh) clearTimeout(timeOutRefresh);
		};
	}, [refreshToken, accessToken]);

	return (
		<div>
			{/* {<LoadingScreen show={!showComponent} />} */}
			{/* {showComponent ? children : ""} */}
			{children}
		</div>
	);
}
