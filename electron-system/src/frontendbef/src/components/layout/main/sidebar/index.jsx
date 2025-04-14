// src/frontend/src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./index.css";

const Sidebar = () => {
	const menuItems = [
		{ path: "/dashboard", icon: "📊", label: "داشبورد" },
		{ path: "/records", icon: "📝", label: "رکوردها" },
		{ path: "/settings", icon: "⚙️", label: "تنظیمات" },
	];

	return (
		<div className="sidebar bg-gray-800 text-white w-64 min-h-screen p-4">
			<div className="sidebar-header flex items-center mb-8">
				<h2 className="text-xl font-bold">سیستم مدیریت</h2>
			</div>

			<nav className="sidebar-menu">
				<ul className="space-y-2">
					{menuItems.map((item) => (
						<li key={item.path}>
							<NavLink
								to={item.path}
								className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`}>
								<span className="ml-3 text-xl">{item.icon}</span>
								<span>{item.label}</span>
							</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
};

export default Sidebar;
