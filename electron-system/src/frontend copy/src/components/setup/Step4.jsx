// src/frontend/src/components/setup/Step4.jsx
import { useState } from "react";
import { Button, Input, Alert, Typography, Spinner } from "@material-tailwind/react";

const Step4 = ({ config, updateConfig, nextStep, prevStep }) => {
	const [dbConfig, setDbConfig] = useState(
		config.dbConfig || {
			host: "localhost",
			port: config.dbType === "postgres" ? 5432 : 1433,
			username: "",
			password: "",
			database: "system_db",
		}
	);
	const [isTesting, setIsTesting] = useState(false);
	const [testResult, setTestResult] = useState(null);
	const [error, setError] = useState(null);

	const testConnection = async () => {
		setIsTesting(true);
		setError(null);
		try {
			const result = await window.electronAPI.testDatabaseConnection({
				type: config.dbType,
				...dbConfig,
			});
			setTestResult(result.success);
			if (!result.success) {
				setError(result.message || "اتصال برقرار نشد");
			}
		} catch (err) {
			setError("خطا در تست اتصال");
			console.error(err);
		} finally {
			setIsTesting(false);
		}
	};

	const handleSubmit = () => {
		updateConfig({ dbConfig });
		nextStep();
	};

	return (
		<div className="  mx-auto p-6 bg-white rounded-lg shadow">
			<h2 className="text-2xl font-bold mb-6 text-gray-800">تنظیمات اتصال دیتابیس</h2>

			{error && (
				<Alert color="red" className="mb-4">
					{error}
				</Alert>
			)}
			{testResult && (
				<Alert color="green" className="mb-4">
					اتصال با موفقیت برقرار شد
				</Alert>
			)}

			<div className="space-y-4 mb-6">
				<Input label="Host" value={dbConfig.host} onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })} />
				<Input label="Port" type="number" value={dbConfig.port} onChange={(e) => setDbConfig({ ...dbConfig, port: e.target.value })} />
				<Input label="Username" value={dbConfig.username} onChange={(e) => setDbConfig({ ...dbConfig, username: e.target.value })} />
				<Input label="Password" type="password" value={dbConfig.password} onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })} />
				<Input label="Database Name" value={dbConfig.database} onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })} />
			</div>

			<div className="flex gap-2 mb-6">
				<Button onClick={testConnection} loading={isTesting} disabled={!dbConfig.host || !dbConfig.username}>
					تست اتصال
				</Button>
			</div>

			<div className="flex justify-between pt-4">
				<Button variant="outlined" onClick={prevStep}>
					مرحله قبل
				</Button>
				<Button color="blue" onClick={handleSubmit} disabled={!testResult}>
					مرحله بعد
				</Button>
			</div>
		</div>
	);
};
export default Step4;
