// src/frontend/src/components/layout/MainLayout.jsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import TopBar from "./topBar";
// import { useQuery } from "@tanstack/react-query";
import { socket } from "../../../socket";
// import { checkAuth } from "../../api/auth";

const MainLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	// const navigate = useNavigate();
	// const { data: user, isLoading } = useQuery(["user"], checkAuth);

	// useEffect(() => {
	// 	if (!isLoading && !user) {
	// 		navigate("/login");
	// 	}
	// }, [user, isLoading, navigate]);

	useEffect(() => {
		const onConnect = () => {
			console.log("Connected to server via socket");
		};

		const onDisconnect = () => {
			console.log("Disconnected from server");
		};

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
		};
	}, []);

	// if (isLoading) {
	// 	return (
	// 		<div className="flex justify-center items-center h-screen">
	// 			<Spinner className="h-12 w-12" />
	// 		</div>
	// 	);
	// }

	return (
		<div className="flex h-screen bg-gray-100">
			<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

			<div className="flex-1 flex flex-col overflow-hidden">
				<TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

				<main className="flex-1 overflow-y-auto p-4">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default MainLayout;
