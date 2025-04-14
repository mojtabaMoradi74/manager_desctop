// src/frontend/src/components/setup/Step5.jsx
import { useState } from "react";
import { Button, Alert, Typography, Spinner } from "@material-tailwind/react";

const Step5 = ({ config, onComplete }) => {
	const [isInstalling, setIsInstalling] = useState(false);
	const [error, setError] = useState(null);
	const [progress, setProgress] = useState(0);

	const completeSetup = async () => {
		setIsInstalling(true);
		setError(null);
		try {
			// شبیه‌سازی پیشرفت نصب
			const interval = setInterval(() => {
				setProgress((prev) => {
					const newProgress = prev + 10;
					if (newProgress >= 100) {
						clearInterval(interval);
						return 100;
					}
					return newProgress;
				});
			}, 300);

			// ذخیره تنظیمات در الکترون و راه‌اندازی سیستم
			await window.electronAPI.saveConfig(config);

			// در صورت سرور، دیتابیس را تنظیم می‌کنیم
			if (config.systemType === "server") {
				await window.electronAPI.initializeDatabase(config);
			}

			clearInterval(interval);
			setProgress(100);
			setTimeout(() => onComplete(), 1000);
		} catch (err) {
			setError("خطا در تکمیل نصب");
			console.error(err);
		} finally {
			setIsInstalling(false);
		}
	};

	return (
		<div className="  mx-auto p-6 bg-white rounded-lg shadow">
			<h2 className="text-2xl font-bold mb-6 text-gray-800">تکمیل نصب</h2>

			{error && (
				<Alert color="red" className="mb-4">
					{error}
				</Alert>
			)}

			<div className="mb-6">
				<Typography variant="paragraph" className="mb-4">
					تنظیمات زیر اعمال خواهند شد:
				</Typography>

				<div className="space-y-2 mb-6">
					<div className="flex justify-between">
						<span>نوع سیستم:</span>
						<span className="font-medium">{config.systemType === "server" ? "سرور" : "کلاینت"}</span>
					</div>
					{config.systemType === "client" && (
						<div className="flex justify-between">
							<span>سرور متصل:</span>
							<span className="font-medium">
								{config.serverIp} {config.serverName && `(${config.serverName})`}
							</span>
						</div>
					)}
					<div className="flex justify-between">
						<span>مسیر نصب:</span>
						<span className="font-medium">{config.installPath}</span>
					</div>
					<div className="flex justify-between">
						<span>نوع دیتابیس:</span>
						<span className="font-medium">{config.dbType === "postgres" ? "PostgreSQL" : "SQL Server"}</span>
					</div>
				</div>

				{progress > 0 && (
					<div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
						<div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
					</div>
				)}
			</div>

			<div className="flex justify-between pt-4">
				<Button variant="outlined" disabled={isInstalling}>
					مرحله قبل
				</Button>
				<Button color="green" onClick={completeSetup} loading={isInstalling} disabled={isInstalling || progress > 0}>
					تکمیل نصب و راه‌اندازی
				</Button>
			</div>
		</div>
	);
};
export default Step5;
