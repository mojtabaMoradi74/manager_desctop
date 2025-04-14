import PropTypes from "prop-types";
import { Navigate, Outlet } from "react-router-dom";
import routes from "src/routes";
import useUserStore from "src/store/UserStore";

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
	children: PropTypes.node,
};

export default function AuthGuard({ children, isPublic }) {
	// const {isAuthenticated, isInitialized} = useAuth()

	const userStore = useUserStore((store) => store);
	const isLogin = userStore?.data?.id;

	if (!isLogin) {
		return <Navigate to={routes.home.link} />;
	}

	return (
		<>
			<Outlet />
			{/* {children} */}
		</>
	);
}
