// src/frontend/src/components/layout/WizardLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import TopBar from "./topBar";
// import { useQuery } from "@tanstack/react-query";
// import { checkAuth } from "../../api/auth";

const WizardLayout = ({ children }) => {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	return (
		<div className="flex h-screen bg-gray-100">
			<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

			<div className="flex-1 flex flex-col overflow-hidden">
				<TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

				<main className="flex-1 overflow-y-auto p-4">{children}</main>
			</div>
		</div>
	);
};

export default WizardLayout;
