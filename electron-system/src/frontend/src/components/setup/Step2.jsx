// src/frontend/src/components/setup/Step2.jsx
import { useState } from "react";
import { Alert, Button } from "@mui/material";
import { RHFTextField } from "../hook-form";

const Step2 = ({ config, updateConfig, nextStep, prevStep, fieldNames }) => {
	const [installPath, setInstallPath] = useState(config.installPath || "");
	const [isSelecting, setIsSelecting] = useState(false);

	const handleSelectDirectory = async () => {
		setIsSelecting(true);
		try {
			const path = await window.electronAPI.selectDirectory();
			if (path) {
				setInstallPath(path);
			}
		} catch (err) {
			console.error("Error selecting directory:", err);
		} finally {
			setIsSelecting(false);
		}
	};

	const handleSubmit = () => {
		updateConfig({ installPath });
		nextStep();
	};

	return (
		<div className="  mx-auto p-6 bg-white rounded-lg shadow">
			<h2 className="text-2xl font-bold mb-6 text-gray-800">تنظیمات نصب</h2>

			<div className="mb-6">
				<Typography variant="h6" className="mb-2">
					مسیر نصب سیستم
				</Typography>
				<div className="flex gap-2">
					<Input type="text" value={installPath} onChange={(e) => setInstallPath(e.target.value)} label="مسیر نصب" readOnly className="flex-1" />
					<Button onClick={handleSelectDirectory} loading={isSelecting}>
						انتخاب مسیر
					</Button>
				</div>
				<Typography variant="small" className="mt-1 text-gray-600">
					حداقل 500MB فضای خالی نیاز است
				</Typography>
			</div>

			<div className="flex justify-between pt-4">
				<Button variant="outlined" onClick={prevStep}>
					مرحله قبل
				</Button>
				<Button color="blue" onClick={handleSubmit} disabled={!installPath}>
					مرحله بعد
				</Button>
			</div>
		</div>
	);
};
export default Step2;
