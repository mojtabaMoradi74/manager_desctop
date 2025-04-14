// src/frontend/src/components/setup/Step1.jsx
import { useState } from "react";
import { Button, Radio, Alert } from "@material-tailwind/react";

const Step1 = ({ config, updateConfig, nextStep }) => {
	const [systemType, setSystemType] = useState(config.systemType);
	const [servers, setServers] = useState([]);
	const [isChecking, setIsChecking] = useState(false);
	const [error, setError] = useState(null);
	const [selectedServer, setSelectedServer] = useState(null);

	const discoverServers = async () => {
		setIsChecking(true);
		setError(null);
		try {
			// استفاده از API الکترون برای اسکن شبکه
			const foundServers = await window.electronAPI.discoverServers();
			console.log({ foundServers });

			setServers(foundServers);
		} catch (err) {
			setError("خطا در کشف سرورهای شبکه");
			console.error(err);
		} finally {
			setIsChecking(false);
		}
	};

	// const handleManualConnect = () => {
	// 	const ip = prompt("لطفا آدرس IP سرور را وارد کنید:");
	// 	if (ip) {
	// 		updateConfig({
	// 			systemType: "client",
	// 			serverIp: ip,
	// 			isManualConnection: true,
	// 		});
	// 		nextStep();
	// 	}
	// };

	const handleSubmit = () => {
		const newConfig = { systemType };
		if (systemType === "client" && selectedServer) {
			newConfig.serverIp = selectedServer.ip;
			newConfig.serverName = selectedServer.name;
		}
		updateConfig(newConfig);
		nextStep();
	};

	return (
		<div className=" mx-auto p-6 bg-white rounded-lg shadow">
			<h2 className="text-2xl font-bold mb-6 text-gray-800">انتخاب نوع سیستم</h2>

			{error && (
				<Alert color="red" className="mb-4">
					{error}
				</Alert>
			)}

			<div className="space-y-4 mb-6">
				<Radio
					name="systemType"
					label="سرور (مدیریت کامل سیستم و دیتابیس)"
					checked={systemType === "server"}
					onChange={() => setSystemType("server")}
					color="blue"
				/>

				<Radio
					name="systemType"
					label="کلاینت (اتصال به سرور موجود)"
					checked={systemType === "client"}
					onChange={() => {
						setSystemType("client");
						discoverServers();
					}}
					disabled={isChecking}
					color="green"
				/>
			</div>

			{systemType === "client" && (
				<div className="mb-6">
					<div className="flex justify-between items-center mb-2">
						<h3 className="font-medium">سرورهای موجود:</h3>
						<Button size="sm" variant="text" onClick={discoverServers} loading={isChecking}>
							بروزرسانی
						</Button>
					</div>

					{servers.length > 0 ? (
						<div className="space-y-2 max-h-60 overflow-y-auto">
							{servers.map((server) => (
								<div
									key={server.ip}
									className={`p-3 border rounded cursor-pointer ${selectedServer?.ip === server.ip ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
									onClick={() => setSelectedServer(server)}>
									<div className="font-medium">{server.name}</div>
									<div className="text-sm text-gray-600">{server.ip}</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-4 text-gray-500">{isChecking ? "در حال جستجوی سرورها..." : "سروری یافت نشد"}</div>
					)}

					{/* <Button variant="outlined" fullWidth className="mt-3" onClick={handleManualConnect}>
						اتصال دستی با IP
					</Button> */}
				</div>
			)}

			<div className="flex justify-end pt-4">
				<Button color="blue" onClick={handleSubmit} disabled={!systemType || (systemType === "client" && !selectedServer && !config.isManualConnection)}>
					مرحله بعد
				</Button>
			</div>
		</div>
	);
};

export default Step1;
