import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import FormProvider from "src/components/hook-form/FormProvider";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";

import validation from "./validation";
import { useState } from "react";
import Step1 from "src/components/setup/Step1";
// import Step2 from 'src/components/setup/Step2'
import ServerConfig from "src/components/setup/ServerConfig";
import Step4 from "src/components/setup/Step4";
import Step5 from "src/components/setup/Step5";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import VerticalTabs from "src/components/VerticalTabs";
import { systemTypes } from "src/enumeration";
import StorageIcon from "@mui/icons-material/Storage";
import ClientConfig from "src/components/setup/ClientConfig";
import { useMutationCustom } from "src/utils/reactQueryHooks";
import { delay } from "src/utils/tools";
import { useSelector } from "react-redux";
import QuestionComponent from "src/components/modal/Question";

const Add = () => {

	console.log({ "window": { window } });
	console.log({ "window.electronAPI": window.electronAPI });

	const { t } = useTranslation();
	const [SelectTab, setSelectTab] = useState(0);
	console.log({ SelectTab });
	const modal = useSelector((state) => state.modal.data);

	const handleChange = (x) => {
		setSelectTab(x);
	};
	const [config, setConfig] = useState({
		systemType: "",
		installPath: "",
		dbType: "",
		dbConfig: {},
	});
	const navigate = useNavigate();

	const nextStep = () => setSelectTab(SelectTab + 1);
	const prevStep = () => setSelectTab(SelectTab - 1);

	const updateConfig = (newValues) => {
		setConfig((prev) => ({ ...prev, ...newValues }));
	};

	const methods = useForm({
		resolver: yupResolver(validation.schema()),
	});

	const {
		watch,
		handleSubmit,
		getValues,
		formState: { errors },
	} = methods;
	console.log({ errors });

	const watchType = watch(validation.fieldNames.type);
	const isClient = watchType && watchType.value === systemTypes.client.value;

	// ----------------------------------------------------------------------------- SERVICE
	// const creating = (params) => axiosInstance().post(Enum?.api?.base, params);
	// const updating = (params) => axiosInstance().put(`${Enum?.api?.base}/${paramId}`, params);
	// const getById = () => axiosInstance().get(`${Enum?.api?.base}/${paramId}`);
	// ------------------------------------------------------------------------------ Mutation
	const onSuccessMutating = () => {
		// toast(t("successfully"), { type: "success" });
		// navigate("/");
		modal.show(
			<QuestionComponent
				{...{
					title: t("عملیات با موفقیت انجام شد"),
					description: t("سیستم مجدد راه اندازی میشود"),
					button: {
						confirm: {
							label: "تایید ، راه اندازی مجدد سیستم",
							onClick: () => {
								delay(2000).then(() => {
									window.electronAPI.reloadApp();
								});
							},
						},
					},
				}}
			/>
		);
	};
	const onErrorMutating = (error) => {
		console.log("* * * onErrorMutating :", { error });
	};
	const saveConfig = useMutationCustom({
		url: window.electronAPI?.saveConfig,
		name: `saveConfig`,
		onSuccess: onSuccessMutating,
		onError: onErrorMutating,
	});
	// useEffect(() => {
	// 	window.electronAPI.reloadApp();
	// }, []);
	// ---------------------------------------
	// const onSuccess = (response) => {
	// 	const params = response?.data;
	// 	console.log("* * * onSuccess", { params });
	// 	const resetData = {
	// 		...params,
	// 		type: Enum.enum.object[params?.type],
	// 	};
	// 	console.log("* * * onSuccess", { resetData });
	// 	reset(resetData);
	// };
	// const dataById = useQueryCustom({
	// 	name: `getById_${Enum?.api?.base}_${paramId}`,
	// 	url: getById,
	// 	onSuccess: onSuccess,
	// 	enabled: !!paramId,
	// });

	const onSubmit = async () => {
		const values = getValues();
		console.log("* * * onSubmit : ", { values });
		const reqData = {
			[validation.fieldNames.type]: values[validation.fieldNames.type]?.value,
		};
		saveConfig.mutate(reqData);
	};
	const data = [
		{
			label: (
				<div>
					{" "}
					{t("انتخاب سیستم")}
					{/* <CheckCircleIcon color={SelectTab === 0 ? "gray" : "success"} />{" "} */}
				</div>
			),
			icon: <AddHomeWorkIcon />,
			component: Step1,
			error: false,
			disabled: false,
			props: {
				fieldNames: validation.fieldNames,
				config,
				updateConfig,
				nextStep,
				methods,
			},
		},
	];

	if (watchType?.value)
		if (!isClient) {
			data.push({
				label: (
					<div>
						{" "}
						{t("کانفیگ دیتابیس")}
						{/* <CheckCircleIcon color={SelectTab > 1 ? "gray" : "success"} />{" "} */}
					</div>
				),
				icon: <StorageIcon />,
				component: ServerConfig,
				error: false,
				disabled: SelectTab < 1,
				props: {
					fieldNames: validation.fieldNames,
					config,
					updateConfig,
					nextStep,
					prevStep,
					methods,
				},
			});
		} else {
			data.push({
				label: (
					<div>
						{" "}
						{t("اتصال به سرور")}
						{/* <CheckCircleIcon color={SelectTab > 1 ? "gray" : "success"} />{" "} */}
					</div>
				),
				icon: <StorageIcon />,
				component: ClientConfig,
				error: false,
				disabled: SelectTab < 1,
				props: {
					fieldNames: validation.fieldNames,
					config,
					updateConfig,
					nextStep,
					prevStep,
					methods,
				},
			});
		}

	// if(watchType.value === systemTypes.client.value){}

	return (
		<div>
			<HeaderBreadcrumbs
			// back={`${Enum.routes.root}`}
			// heading={"welcome to setup wizard"}
			>
				{/* <Typography sx={{ mt: 1 }}>{resQuery?.data?.data?.name}</Typography> */}
			</HeaderBreadcrumbs>
			{/* <div
        sx={{
          textAlign: 'center',
          mb: '30px',
        }}
        onClick={() => navigate(backUrl)}
      >
        <Typography variant="h5">{'شما در حال ایجاد یک دوره جدید هستید!'}</Typography>
      </div> */}

			<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
				{/* <Tabs value={SelectTab} onChange={handleChange} aria-label="icon position tabs example">
					<Tab icon={<PhoneIcon />} label="top" />
					<Tab icon={<PhoneMissedIcon />} iconPosition="start" label="start" />
					<Tab icon={<FavoriteIcon />} iconPosition="end" label="end" />
					<Tab icon={<PersonPinIcon />} iconPosition="bottom" label="bottom" />
				</Tabs> */}
				<VerticalTabs onSelect={handleChange} selected={SelectTab} data={data} />
				{/* <Step1
					{...{
						fieldNames: validation.fieldNames,
						config,
						updateConfig,
						nextStep,
						methods,
					}}
				/> */}
			</FormProvider>
		</div>
	);
};

export default Add;
