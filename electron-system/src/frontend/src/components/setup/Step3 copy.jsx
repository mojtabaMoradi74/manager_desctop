in kole code in bakhshe mane age moshkeli tosh hast lotfan rafesh mikonid mamanon


import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useMutationCustom, useQueryCustom } from "src/utils/reactQueryHooks";
import Loading from "../Loading";
import StorageIcon from "@mui/icons-material/Storage";
import { delay } from "src/utils/tools";
import { useReducer } from "react";

const wizardAlert = {
	checking: { value: "checking", label: "در حال بررسی دیتابیس", color: "info" },
	installingDatabase: { value: "installingDatabase", label: "در حال نصب دیتابیس", color: "info", isTiming: true },
	notRunning: { value: "notRunning", label: "دیتابیس اجرا نشده است", color: "info" },
	running: { value: "running", label: "دیتابیس در حال اجرا است", color: "info" },
	config: { value: "config", label: "در حال کانفیگ دیتابیس", color: "info" },
	configDatabase: { value: "configDatabase", label: "در حال کانفیگ دیتابیس", color: "info" },
	installed: { value: "installed", label: "دیتابیس نصب شده است", color: "info" },
	notInstalled: { value: "notInstalled", label: "دیتابیس نصب نشده است", color: "info" },
	configError: { value: "configError", label: "کانفیگ با خطا مواجه شد", color: "info" },
	configCompleted: { value: "configCompleted", label: "کانفیگ دیتابیس با موفقیت انجام شد", color: "info" },
	end: { value: "end", label: "پایان", color: "info" },
	installing: { value: "installing", label: "در حال نصب دیتابیس", color: "info" },
	starting: { value: "starting", label: "در حال شروع دیتابیس", color: "info" },
	installFailed: { value: "installFailed", label: "نصب دیتابیس با خطا مواجه شد", color: "info" },
	startFailed: { value: "startFailed", label: "شروع دیتابیس با خطا مواجه شد", color: "info" },
	installSuccess: { value: "installSuccess", label: "نصب دیتابیس با موفقیت انجام شد", color: "info" },
	startSuccess: { value: "startSuccess", label: "شروع دیتابیس با موفقیت انجام شد", color: "info" },
	installDatabaseError: { value: "installDatabaseError", label: "خطا در نصب دیتابیس", color: "info" },
	startDatabaseError: { value: "startDatabaseError", label: "خطا در شروع دیتابیس", color: "info" },
	installDatabaseSuccess: { value: "installDatabaseSuccess", label: "نصب دیتابیس با موفقیت انجام شد", color: "info" },
	startDatabaseSuccess: { value: "startDatabaseSuccess", label: "شروع دیتابیس با موفقیت انجام شد", color: "info" },
	installDatabaseFailed: { value: "installDatabaseFailed", label: "نصب دیتابیس با خطا مواجه شد", color: "info" },
	startDatabaseFailed: { value: "startDatabaseFailed", label: "شروع دیتابیس با خطا مواجه شد", color: "info" },
};
const initialState = {
	percent: 0,
	task: [],
	databaseStatus: {
		installed: false,
		running: false,
		installing: false,
	},
};

function wizardReducer(state, action) {
	switch (action.type) {
		case "UPDATE_PERCENT":
			return {
				...state,
				percent: +state.percent + +1,
			};

		case "SET_TASK":
			return {
				...state,
				task: [...(state.task && state.task), action.payload],
			};

		case "SET_DATABASE_STATUS":
			return {
				...state,
				databaseStatus: {
					...state.databaseStatus,
					...action.payload,
				},
			};
		case "COMPLETED":
			return {
				...state,
				completed: true,
			};
		default:
			return state;
	}
}

const Step3 = ({ updateConfig, nextStep, prevStep }) => {
	const [currentTask, dispatch] = useReducer(wizardReducer, initialState);
	console.log({ currentTask });

	const completed = async () => {
		dispatch({ type: "SET_TASK", payload: wizardAlert.end });
		dispatch({ type: "COMPLETED" });
	};
	const preparingDatabase = useMutationCustom({
		url: async () => {
			return await window.electronAPI.preparingDatabase();
		},
		name: `preparingDatabase`,
		onSuccess: async (data) => {
			console.log("* * * Step3 preparingDatabase :", { data });
			if (data?.success) {
				dispatch({ type: "SET_TASK", payload: wizardAlert.configCompleted });
				completed();
			}
		},
		onError: (error) => {
			console.log("* * * Step3 preparingDatabase :", { error });
			dispatch({ type: "SET_TASK", payload: wizardAlert.configError });
			dispatch({
				type: "SET_DATABASE_STATUS",
			});
		},
	});

	const configDatabaseUser = useMutationCustom({
		url: async () => {
			dispatch({ type: "SET_TASK", payload: wizardAlert.config });

			return await window.electronAPI.configDatabaseUser();
		},
		name: `configDatabaseUser`,
		onSuccess: (data) => {
			console.log("* * * Step3 configDatabaseUser :", { data });
			preparingDatabase.mutate();
		},
		onError: (error) => {
			console.log("* * * Step3 configDatabaseUser :", { error });
			dispatch({ type: "SET_TASK", payload: wizardAlert.configError });
			dispatch({
				type: "SET_DATABASE_STATUS",
			});
		},
	});

	const checkDatabase = useQueryCustom({
		name: `checkDatabase`,
		url: async () => {
			return await window.electronAPI.checkDatabase();
		},
		onSuccess: async (data) => {
			console.log("* * * Step3 checkDatabase :", { data });

			if (data.installed) {
				dispatch({ type: "SET_TASK", payload: wizardAlert.installed });
				if (data.running) {
					dispatch({ type: "SET_TASK", payload: wizardAlert.running });
					dispatch({
						type: "SET_DATABASE_STATUS",
						payload: { running: true },
					});
					await delay(1000);
					configDatabaseUser.mutate();
				} else {
					dispatch({ type: "SET_TASK", payload: wizardAlert.notRunning });
					dispatch({
						type: "SET_DATABASE_STATUS",
						payload: { running: false },
					});
					await delay(1000);
					startDatabase.mutate();
				}
			} else {
				dispatch({ type: "SET_TASK", payload: wizardAlert.notInstalled });
				dispatch({ type: "SET_TASK", payload: wizardAlert.installingDatabase });
				dispatch({
					type: "SET_DATABASE_STATUS",
					payload: { installing: true },
				});
				installDatabase.mutate();
			}
		},
	});
	console.log({ electronAPI: window.electronAPI });

	const installDatabase = useMutationCustom({
		url: async () => await window.electronAPI.installDatabase(),
		name: `installDatabase`,
		onError: (error) => {
			console.log({ error });
			dispatch({ type: "SET_TASK", payload: wizardAlert.installDatabaseError });
			dispatch({
				type: "SET_DATABASE_STATUS",
				payload: { installing: false },
			});
		},
		onSuccess: (data) => {
			// timer({
			// 	dispatch,
			// 	stepSize: 30,
			// });
			dispatch({ type: "SET_TASK", payload: wizardAlert.installDatabaseSuccess });
			console.log("* * * Step3 installDatabase :", { data });

			checkDatabase.refetch();
		},
	});

	const startDatabase = useMutationCustom({
		url: async () => await window.electronAPI.startDatabase(),
		name: `startDatabase`,
		onSuccess: (data) => {
			console.log("* * * Step3 startDatabase :", { data });

			if (data?.started) checkDatabase.refetch();
		},
	});

	console.log({ startDatabase, installDatabase, checkDatabase });

	const handleSubmit = () => {
		updateConfig();
		nextStep();
	};

	return (
		<div className="  mx-auto p-6  rounded-lg shadow">
			<h2 className="text-2xl font-bold mb-6 ">تنظیمات دیتابیس</h2>

			{installDatabase.error && (
				<Alert color="red" className="mb-4">
					{"installDatabase.error"}
				</Alert>
			)}

			<div className="mb-6 p-4  rounded-lg">
				<div className="flex flex-col items-start gap-2 gap-3">
					<div className="flex items-center gap-3 text-sm">
						<StorageIcon />
						{"وضعیت دیتابیس"}
					</div>
					<div className="flex flex-col items-center gap-2">{installDatabase?.isLoading ? <Loading className="h-2 w-2" /> : ""}</div>
					<Alert severity="warning" onClose={() => {}}>
						{"این عملبات ممکن است مدتی طول بکشد لذا لطفا صبور باشید"}
					</Alert>
					<p className="tex-sm">{"عملیات :"}</p>
					{currentTask?.task?.map((x) => {
						// const isCurrent = currentTask?.task?.length === i + 1;
						// const isNext = currentTask?.task?.length > i + 1;
						return (
							<div className="text-xs flex items-center gap-2" key={x.value}>
								{x.label}
								{currentTask?.task?.isTiming ? " لطفا منتظر بمانید" : ""}
							</div>
						);
					})}
				</div>
			</div>

			<div className="flex justify-between pt-4">
				<Button variant="outlined" onClick={prevStep} disabled={installDatabase?.isLoading}>
					مرحله قبل
				</Button>
				<Button variant="contained" color="success" onClick={handleSubmit} disabled={!currentTask?.completed}>
					مرحله بعد
				</Button>
			</div>
		</div>
	);
};
export default Step3;