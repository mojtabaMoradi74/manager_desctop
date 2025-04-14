import ScrollToTop from "./ScrollToTop";
import RefreshTokenMiddleware from "./RefreshTokenMiddleware";
import useSiteStore from "src/store/siteStore";
import useUserStore from "src/store/UserStore";
import useTokenStore from "src/store/TokenStore";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import ThemeProvider from "src/theme";
import AppModal from "src/components/modal";
import useModal from "src/hooks/useModal";
import RtlLayout from "src/components/RtlLayout";

import useModalStore from "src/store/ModalStore";
import { useLocation, useNavigate } from "react-router-dom";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import AuthenticationPage from "src/pages/authentication";
import useNavigateStore from "src/store/NavigateStore";

import PopupMiddleware from "./Popup";
import { useLayoutEffect } from "react";

const Middleware = ({ children }) => {
	// const { siteTheme, setSiteTheme } = useSiteStore((state) => state);
	const siteStore = useSiteStore((state) => state);

	const userStore = useUserStore((state) => state);
	const tokenStore = useTokenStore((state) => state);
	const modalStore = useModalStore((state) => state);
	const navigateStore = useNavigateStore((state) => state);

	const isLogin = tokenStore?.data?.refreshToken?.token;
	const handleShowLogin = () => {
		modalStore.show(<AuthenticationPage onClose={modalStore.hide} />, {
			disableBackDropClose: true,
		});
	};
	const modalRef = useModal();
	const navigate = useNavigate();
	const location = useLocation();

	const handleDetectSiteTheme = () => {
		let isDark = siteStore.theme.isDark;
		// const body = document.body;

		if (document.documentElement) {
			if (isDark) {
				document.documentElement.classList.add("dark-mode");
			} else document.documentElement.classList.remove("dark-mode");
		}

		// document.documentElement.setAttribute("data-theme", "dark");
		// setSiteTheme(theme);
		// siteStore.theme.set(theme);
	};
	useLayoutEffect(() => {
		handleDetectSiteTheme();
	}, [siteStore.theme.isDark]);

	console.log({ siteStore });

	useEffect(() => {
		navigateStore?.setData?.(navigate);
	}, []);

	// console.log({ location });

	// const fullName = userStore?.data?.fullName;

	return (
		<div className="relative  m-auto min-h-screen border-x">
			<ThemeProvider>
				<RtlLayout>
					<div>
						<ScrollToTop />
						<AppModal ref={modalRef} />
						<ToastContainer
							position="top-right"
							autoClose={5000}
							hideProgressBar={true}
							newestOnTop={false}
							closeOnClick
							rtl={true}
							pauseOnFocusLoss
							draggable
							pauseOnHover
							theme={siteStore?.theme?.isDark ? "dark" : "light"}
							className={"customToastBox"}
						/>
						<SkeletonTheme baseColor="#eeee" highlightColor="#444">
							{isLogin ? <RefreshTokenMiddleware>{children}</RefreshTokenMiddleware> : <AuthenticationPage />}
						</SkeletonTheme>
						<PopupMiddleware />
					</div>
				</RtlLayout>
			</ThemeProvider>
		</div>
	);
};
export default Middleware;
