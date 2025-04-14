// src/frontend/src/components/setup/Step3.jsx
import { useState, useEffect } from "react";
import { Button, Radio, Alert, Typography, Spinner } from "@material-tailwind/react";

const Step3 = ({ config, updateConfig, nextStep, prevStep }) => {
	const [dbType, setDbType] = useState(config.dbType || "");
	const [isChecking, setIsChecking] = useState(false);
	const [dbStatus, setDbStatus] = useState(null);
	const [error, setError] = useState(null);

	const checkDatabase = async () => {
		setIsChecking(true);
		setError(null);
		try {
			const status = await window.electronAPI.checkDatabase(dbType);
			console.log({ status });

			setDbStatus(status);
		} catch (err) {
			setError("خطا در بررسی دیتابیس");
			console.error(err);
		} finally {
			setIsChecking(false);
		}
	};

	const installDatabase = async () => {
		setIsChecking(true);
		setError(null);
		try {
			const result = await window.electronAPI.installDatabase(dbType);
			if (result.success) {
				setDbStatus({ installed: true, running: true });
			}
		} catch (err) {
			setError("خطا در نصب دیتابیس");
			console.error(err);
		} finally {
			setIsChecking(false);
		}
	};

	const handleSubmit = () => {
		updateConfig({ dbType });
		nextStep();
	};

	useEffect(() => {
		checkDatabase();
	}, []);

	return (
		<div className="  mx-auto p-6 bg-white rounded-lg shadow">
			<h2 className="text-2xl font-bold mb-6 text-gray-800">تنظیمات دیتابیس</h2>

			{error && (
				<Alert color="red" className="mb-4">
					{error}
				</Alert>
			)}

			<div className="space-y-4 mb-6">
				<Radio
					name="dbType"
					label="PostgreSQL (پیشنهادی)"
					checked={dbType === "postgres"}
					onChange={() => {
						setDbType("postgres");
						setDbStatus(null);
					}}
					color="blue"
				/>

				<Radio
					name="dbType"
					label="SQL Server"
					checked={dbType === "sqlserver"}
					onChange={() => {
						setDbType("sqlserver");
						setDbStatus(null);
					}}
					color="green"
				/>
			</div>

			{dbType && (
				<div className="mb-6 p-4 border rounded-lg">
					<div className="flex items-center gap-2 mb-2">
						<Typography variant="h6">وضعیت دیتابیس:</Typography>
						{isChecking ? (
							<Spinner className="h-5 w-5" />
						) : dbStatus ? (
							<div
								className={`inline-block px-2 py-1 rounded text-xs ${
									dbStatus.installed && dbStatus.running ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
								}`}>
								{dbStatus.installed ? (dbStatus.running ? "نصب شده و در حال اجرا" : "نصب شده اما اجرا نشده") : "یافت نشد"}
							</div>
						) : null}
					</div>

					{dbStatus && !dbStatus.installed && (
						<Button variant="gradient" color="red" size="sm" onClick={installDatabase} loading={isChecking} className="mt-2">
							نصب {dbType === "postgres" ? "PostgreSQL" : "SQL Server"}
						</Button>
					)}

					{dbStatus?.installed && !dbStatus.running && (
						<Typography variant="small" color="red" className="mt-2">
							سرویس دیتابیس اجرا نشده است. لطفا آن را راه‌اندازی کنید.
						</Typography>
					)}
				</div>
			)}

			<div className="flex justify-between pt-4">
				<Button variant="outlined" onClick={prevStep}>
					مرحله قبل
				</Button>
				<Button color="blue" onClick={handleSubmit} disabled={!dbType || !dbStatus?.installed || !dbStatus?.running}>
					مرحله بعد
				</Button>
			</div>
		</div>
	);
};
export default Step3;
