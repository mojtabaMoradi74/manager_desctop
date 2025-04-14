import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import MainLayout from "../layout/main";
import StepperWizard from "../layout/wizard/StepperWizard";
import * as React from "react";

const Player = React.forwardRef(function Player(props, ref) {
	const { className = "", ...other } = props;
	return (
		<div className={`max-w-[600px] max-h-[240px] m-auto ${className}`} {...other} ref={ref}>
			<div className="bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl p-4 pb-6 sm:p-10 sm:pb-8 lg:p-6 xl:p-10 xl:pb-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8">
				<div className="flex items-center space-x-4">
					<img
						src="https://mui.com/static/base-ui/with-tailwind-css/full-stack-radio.png"
						alt=""
						width="88"
						height="88"
						className="flex-none rounded-lg bg-slate-100"
						loading="lazy"
					/>
					<div className="min-w-0 flex-auto space-y-1 font-semibold">
						<p className="text-cyan-500 dark:text-cyan-400 text-sm leading-6">
							<abbr title="Episode">Ep.</abbr> 128
						</p>
						<h2 className="text-slate-500 dark:text-slate-400 text-sm leading-6 truncate">Scaling CSS at Heroku with Utility Classes</h2>
						<p className="text-slate-900 dark:text-slate-50 text-lg">Full Stack Radio</p>
					</div>
				</div>
				<div className="space-y-2">
					<div className="relative">
						<div className="bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
							<div
								className="bg-cyan-500 dark:bg-cyan-400 w-1/2 h-2"
								role="progressbar"
								aria-label="music progress"
								aria-valuenow={1456}
								aria-valuemin={0}
								aria-valuemax={4550}></div>
						</div>
						<div className="ring-cyan-500 dark:ring-cyan-400 ring-2 absolute left-1/2 top-1/2 w-4 h-4 -mt-2 -ml-2 flex items-center justify-center bg-white rounded-full shadow">
							<div className="w-1.5 h-1.5 bg-cyan-500 dark:bg-cyan-400 rounded-full ring-1 ring-inset ring-slate-900/5"></div>
						</div>
					</div>
					<div className="flex justify-between text-sm leading-6 font-medium tabular-nums">
						<div className="text-cyan-500 dark:text-slate-100">24:16</div>
						<div className="text-slate-500 dark:text-slate-400">75:50</div>
					</div>
				</div>
			</div>
			<div className="bg-slate-50 text-slate-500 dark:bg-slate-600 dark:text-slate-200 rounded-b-xl flex items-center">
				<div className="flex-auto flex items-center justify-evenly">
					<button type="button" aria-label="Add to favorites">
						<svg width="24" height="24">
							<path
								d="M7 6.931C7 5.865 7.853 5 8.905 5h6.19C16.147 5 17 5.865 17 6.931V19l-5-4-5 4V6.931Z"
								fill="currentColor"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
					<button type="button" className="hidden sm:block lg:hidden xl:block" aria-label="Previous">
						<svg width="24" height="24" fill="none">
							<path d="m10 12 8-6v12l-8-6Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M6 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
					<button type="button" aria-label="Rewind 10 seconds">
						<svg width="24" height="24" fill="none">
							<path
								d="M6.492 16.95c2.861 2.733 7.5 2.733 10.362 0 2.861-2.734 2.861-7.166 0-9.9-2.862-2.733-7.501-2.733-10.362 0A7.096 7.096 0 0 0 5.5 8.226"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path d="M5 5v3.111c0 .491.398.889.889.889H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
				</div>
				<button
					type="button"
					className="bg-white text-slate-900 dark:bg-slate-100 dark:text-slate-700 flex-none -my-2 mx-auto w-20 h-20 rounded-full ring-1 ring-slate-900/5 shadow-md flex items-center justify-center"
					aria-label="Pause">
					<svg width="30" height="32" fill="currentColor">
						<rect x="6" y="4" width="4" height="24" rx="2" />
						<rect x="20" y="4" width="4" height="24" rx="2" />
					</svg>
				</button>
				<div className="flex-auto flex items-center justify-evenly">
					<button type="button" aria-label="Skip 10 seconds">
						<svg width="24" height="24" fill="none">
							<path
								d="M17.509 16.95c-2.862 2.733-7.501 2.733-10.363 0-2.861-2.734-2.861-7.166 0-9.9 2.862-2.733 7.501-2.733 10.363 0 .38.365.711.759.991 1.176"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path d="M19 5v3.111c0 .491-.398.889-.889.889H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
					<button type="button" className="hidden sm:block lg:hidden xl:block" aria-label="Next">
						<svg width="24" height="24" fill="none">
							<path d="M14 12 6 6v12l8-6Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M18 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
					<button
						type="button"
						className="rounded-lg text-xs leading-6 font-semibold px-2 ring-2 ring-inset ring-slate-500 text-slate-500 dark:text-slate-100 dark:ring-0 dark:bg-slate-500">
						1x
					</button>
				</div>
			</div>
		</div>
	);
});

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
		<>
			<StepperWizard />
			<div className="stats shadow">
				<div className="stat">
					<div className="stat-figure text-primary">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
						</svg>
					</div>
					<div className="stat-title">Total Likes</div>
					<div className="stat-value text-primary">25.6K</div>
					<div className="stat-desc">21% more than last month</div>
				</div>

				<div className="stat">
					<div className="stat-figure text-secondary">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
						</svg>
					</div>
					<div className="stat-title">Page Views</div>
					<div className="stat-value text-secondary">2.6M</div>
					<div className="stat-desc">21% more than last month</div>
				</div>

				<div className="stat">
					<div className="stat-figure text-secondary">
						<div className="avatar online">
							<div className="w-16 rounded-full">
								<img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
							</div>
						</div>
					</div>
					<div className="stat-value">86%</div>
					<div className="stat-title">Tasks done</div>
					<div className="stat-desc text-secondary">31 tasks remaining</div>
				</div>
			</div>
			<div className="w-full h-screen flex flex-col">
				<div className="flex-1 p-8">
					{step === 1 && <Step1 config={config} updateConfig={updateConfig} nextStep={nextStep} />}
					{/* {step === 2 && <Step2 config={config} updateConfig={updateConfig} nextStep={nextStep} prevStep={prevStep} />} */}
					{step === 2 && <Step3 config={config} updateConfig={updateConfig} nextStep={nextStep} prevStep={prevStep} />}
					{step === 3 && <Step4 config={config} updateConfig={updateConfig} nextStep={nextStep} prevStep={prevStep} />}
					{step === 4 && <Step5 config={config} onComplete={handleComplete} />}
				</div>
			</div>
		</>
	);
};

export default SetupWizard;
