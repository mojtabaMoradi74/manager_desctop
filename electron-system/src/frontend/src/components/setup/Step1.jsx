// src/frontend/src/components/setup/Step1.jsx
import { useState } from "react";
import RHFRadioGroups from "../hook-form/RHFRadioGroups";
import { systemTypes } from "src/enumeration";
import { Alert, Button } from "@mui/material";
import { useMutationCustom } from "src/utils/reactQueryHooks";
import { Controller } from "react-hook-form";
import CachedIcon from "@mui/icons-material/Cached";
// import SpeechToText from "../SpeechToText";
const Step1 = ({ nextStep, fieldNames, methods }) => {
	const watchType = methods.watch(fieldNames.type);
	const isClient = watchType && watchType.value === systemTypes.client.value;

	const handleSubmit = () => {
		nextStep();
	};

	return (
		<div className="  mx-auto p-6 rounded-lg shadow">
			<h2 className="text-2xl font-bold mb-6 ">انتخاب نوع سیستم</h2>
			{/* <SpeechToText /> */}

			<div className="space-y-4 mb-6">
				<RHFRadioGroups name={fieldNames.type} options={Object.values(systemTypes)} />
			</div>

			<div className="flex justify-end pt-4">
				<Button variant="contained" color="success" onClick={handleSubmit} disabled={!watchType}>
					مرحله بعد
				</Button>
			</div>
		</div>
	);
};

export default Step1;
