// src/frontend/src/components/TopBar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const TopBar = () => {
	const navigate = useNavigate();
	const user = { name: "مدیر سیستم", role: "admin" };

	return (
		<div className="topbar bg-white shadow-md py-3 px-6 flex items-center justify-between">
			<div className="flex items-center">
				<button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 mr-2">
					←
				</button>
				<button onClick={() => navigate(1)} className="p-2 rounded-full hover:bg-gray-100">
					→
				</button>
			</div>

			<div className="flex items-center space-x-4">
				<div className="notification-icon p-2 rounded-full hover:bg-gray-100 cursor-pointer">🔔</div>
				<div className="user-profile flex items-center">
					<div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">{user.name.charAt(0)}</div>
					<div className="text-sm">
						<div className="font-medium">{user.name}</div>
						<div className="text-gray-500 text-xs">{user.role}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TopBar;
