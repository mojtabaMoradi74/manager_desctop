// src/frontend/src/components/setup/Step1.jsx
import { useState } from "react";
import RHFRadioGroups from "../hook-form/RHFRadioGroups";
import { systemTypes } from "src/enumeration";
import { Alert, Button } from "@mui/material";
import { useMutationCustom } from "src/utils/reactQueryHooks";
import { Controller } from "react-hook-form";
import CachedIcon from "@mui/icons-material/Cached";
import { useEffect } from "react";
// import SpeechToText from "../SpeechToText";
const ClientConfig = ({ config, nextStep, fieldNames, methods, prevStep }) => {
	const [servers, setServers] = useState([]);
	const [selectedServer, setSelectedServer] = useState(null);
	const watchType = methods.watch(fieldNames.type);
	const isClient = watchType && watchType.value === systemTypes.client.value;

	const { isLoading, mutate, error } = useMutationCustom({
		url: window.electronAPI.discoverServers,
		name: `discoverServers`,
		onSuccess: (data) => setServers(data?.map((x) => ({ label: x.name, value: x.id, data: x }))),
	});

	const discoverServers = async () => {
		mutate();
	};

	const handleSubmit = () => {
		nextStep();
	};

	useEffect(() => {
		discoverServers();
	}, []);

	return (
		<div className="  mx-auto p-6 rounded-lg shadow">
			{error && (
				<Alert color="red" className="mb-4">
					{error}
				</Alert>
			)}
			{isClient && (
				<div className="mb-6">
					<div className="flex justify-between items-center mb-2">
						<div>
							<h3 className="font-medium mb-2">سرورهای موجود:</h3>
						</div>
						<Button size="sm" variant="text" onClick={discoverServers} loading={isLoading}>
							<CachedIcon className="text-sm" fontSize={"small"} />
							{"بروزرسانی"}
						</Button>
					</div>
					<Alert color="info" className="">
						{"قبل از نصب این سیستم باید سیستم سرور را نصب و اجرا نمایید"}
					</Alert>
					{servers.length > 0 ? (
						<div className="space-y-2 max-h-60 overflow-y-auto">
							{/* <RHFRadioGroups name={fieldNames.server} options={servers} /> */}

							{servers.map((server) => (
								<div
									key={server.ip}
									className={`p-3 border rounded cursor-pointer ${selectedServer?.ip === server.ip ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
									onClick={() => setSelectedServer(server)}>
									<div className="font-medium">{server.name}</div>
									<div className="text-sm text-gray-600">{server.ip}</div>
									<div className="text-sm text-gray-600">{server.id}</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-4 text-gray-500">{isLoading ? "در حال جستجوی سرورها..." : "سروری یافت نشد"}</div>
					)}

					{/* <Button variant="outlined" fullWidth className="mt-3" onClick={handleManualConnect}>
						اتصال دستی با IP
					</Button> */}
				</div>
			)}

			<div className="flex justify-between pt-4">
				<Button variant="outlined" onClick={prevStep}>
					مرحله قبل
				</Button>
				<Button
					type="submit"
					variant="contained"
					color="success"
					// onClick={handleSubmit}
					disabled={!watchType || (isClient && !selectedServer && !config.isManualConnection)}>
					مرحله بعد
				</Button>
			</div>
		</div>
	);
};

export default ClientConfig;
