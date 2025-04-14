import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import MainLayout from "../layout/main";

const SetupWizard = () => {
	const [step, setStep] = useState(1);
	const [config, setConfig] = useState({
		systemType: "",
		installPath: "",
		dbType: "",
		dbConfig: {},
	});
	const navigate = useNavigate();

	const nextStep = () => setStep(step + 1);
	const prevStep = () => setStep(step - 1);

	const updateConfig = (newValues) => {
		setConfig((prev) => ({ ...prev, ...newValues }));
	};

	const handleComplete = () => {
		// Save config to electron store or backend
		navigate("/");
	};

	return (
		<div className="w-full h-screen flex flex-col bg-gray-50">
			<div className="flex-1 p-8">
				{step === 1 && <Step1 config={config} updateConfig={updateConfig} nextStep={nextStep} />}
				{/* {step === 2 && <Step2 config={config} updateConfig={updateConfig} nextStep={nextStep} prevStep={prevStep} />} */}
				{step === 2 && <Step3 config={config} updateConfig={updateConfig} nextStep={nextStep} prevStep={prevStep} />}
				{step === 3 && <Step4 config={config} updateConfig={updateConfig} nextStep={nextStep} prevStep={prevStep} />}
				{step === 4 && <Step5 config={config} onComplete={handleComplete} />}
			</div>
		</div>
	);
};

export default SetupWizard;
