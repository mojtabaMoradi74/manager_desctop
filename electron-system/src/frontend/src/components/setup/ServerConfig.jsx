import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useMutationCustom, useQueryCustom } from "src/utils/reactQueryHooks";
import Loading from "../Loading";
import StorageIcon from "@mui/icons-material/Storage";
import { useState } from "react";

// پیام‌های سیستم به صورت مجزا
const DATABASE_MESSAGES = {
	checking: "در حال بررسی دیتابیس",
	installing: "در حال نصب دیتابیس",
	starting: "در حال راه‌اندازی دیتابیس",
	running: "دیتابیس در حال اجرا است",
	config: "در حال پیکربندی دیتابیس",
	completed: "پیکربندی با موفقیت انجام شد",
	error: (action) => `خطا در ${action} دیتابیس`,
};

const ServerConfig = ({ updateConfig, nextStep, prevStep }) => {
	const [currentStatus, setCurrentStatus] = useState({
		message: DATABASE_MESSAGES.checking,
		progress: 0,
		isCompleted: false,
		error: null,
	});
	console.log({ currentStatus, });

	// تابع کمکی برای به‌روزرسانی وضعیت
	const updateStatus = (message, progress = 0, error = null) => {
		setCurrentStatus((prev) => ({
			...prev,
			message,
			progress: progress || prev.progress,
			error,
		}));
	};

	// تابع کمکی برای مدیریت خطاها
	const handleError = (action, error) => {
		console.error(`${action} error:`, error);
		updateStatus(DATABASE_MESSAGES.error(action), null, error);
	};

	// نصب دیتابیس
	const installDatabase = useMutationCustom({
		mutationFn: () => window.electronAPI.installDatabase(),
		onMutate: () => updateStatus(DATABASE_MESSAGES.installing, 30),
		onSuccess: (data) => {
			console.log("* * * installDatabase : ", { data });

			updateStatus(DATABASE_MESSAGES.installing, 60);
			checkDatabase.refetch();
		},
		onError: (error) => handleError("نصب", error),
	});

	// راه‌اندازی دیتابیس
	const startDatabase = useMutationCustom({
		mutationFn: () => window.electronAPI.startDatabase(),
		onMutate: () => updateStatus(DATABASE_MESSAGES.starting, 70),
		onSuccess: (data) => {
			console.log("* * * startDatabase : ", { data });

			updateStatus(DATABASE_MESSAGES.running, 80);
			checkDatabase.refetch();
		},
		onError: (error) => handleError("راه‌اندازی", error),
	});
	// پیکربندی دیتابیس
	const preparingDatabase = useMutationCustom({
		mutationFn: () => window.electronAPI.preparingDatabase(),
		onMutate: () => updateStatus(DATABASE_MESSAGES.config, 90),
		onSuccess: (data) => {
			console.log("* * * preparingDatabase : ", { data });

			updateStatus(DATABASE_MESSAGES.completed, 100);
			setCurrentStatus((prev) => ({ ...prev, isCompleted: true }));
		},
		onError: (error) => handleError("پیکربندی", error),
	});
	// پیکربندی دیتابیس
	const configureDatabase = useMutationCustom({
		mutationFn: () => window.electronAPI.configDatabaseUser(),
		onMutate: () => updateStatus(DATABASE_MESSAGES.config, 80),
		onSuccess: (data) => {
			console.log("* * * configureDatabase : ", { data });

			updateStatus(DATABASE_MESSAGES.completed, 85);
			preparingDatabase.mutate();
		},
		onError: (error) => handleError("پیکربندی", error),
	});

	// بررسی وضعیت دیتابیس
	// const checkDatabase = useQueryCustom({
	// 	queryKey: ["checkDatabase"],
	// 	queryFn: async () => {
	// 		const data = await window.electronAPI.checkDatabase();

	// 		console.log("* * * checkDatabase : ", { data });
	// 		if (data.installed) {
	// 			if (data.running) {
	// 				configureDatabase.mutate();
	// 			} else {
	// 				startDatabase.mutate();
	// 			}
	// 		} else {
	// 			installDatabase.mutate();
	// 		}

	// 		return data;
	// 	},
	// 	onError: (error) => handleError("بررسی", error),
	// });
	const manageDatabase = useQueryCustom({
		queryKey: ["manageDatabase"],
		queryFn: async () => {
			updateStatus(DATABASE_MESSAGES.config, 50)
			const data = await window.electronAPI.manageDatabase();
			updateStatus(DATABASE_MESSAGES.completed, 100);
			setCurrentStatus((prev) => ({ ...prev, isCompleted: true }));

			console.log("* * * manageDatabase : ", { data });

			return data;
		},
		onError: (error) => handleError("بررسی", error),
	});

	return (
		<div className="mx-auto p-6 rounded-lg shadow">
			<h2 className="text-2xl font-bold mb-6">تنظیمات دیتابیس</h2>

			{currentStatus.error && (
				<Alert severity="error" className="mb-4">
					{currentStatus.error.message}
				</Alert>
			)}

			<div className="mb-6 p-4 rounded-lg">
				<div className="flex flex-col items-start gap-3">
					<div className="flex items-center gap-3 text-sm">
						<StorageIcon />
						وضعیت دیتابیس
					</div>
					<Alert severity="warning">{"این عملیات ممکن است مدتی طول بکشد لطفا صبور باشید"}</Alert>

					<Alert severity="info">
						{currentStatus.message}
						{currentStatus.progress > 0 && ` (${currentStatus.progress}%)`}
					</Alert>

					<div className="w-full bg-gray-200 rounded-full h-2.5">
						<div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${currentStatus.progress}%` }}></div>
					</div>
				</div>
			</div>

			<div className="flex justify-between pt-4">
				<Button variant="outlined" onClick={prevStep} disabled={currentStatus.progress < 100}>
					مرحله قبل
				</Button>
				<Button
					type="submit"
					variant="contained"
					color="success"
					// onClick={() => {
					// 	updateConfig();
					// 	nextStep();
					// }}
					disabled={!currentStatus.isCompleted}>
					ذخیره تنظیمات
				</Button>
			</div>
		</div>
	);
};

export default ServerConfig;
