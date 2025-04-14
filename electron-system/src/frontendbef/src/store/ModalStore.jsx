import QuestionComponent from "src/components/modal/Question";
import { formStatusType } from "src/enumerations";
import routes from "src/routes";
import { create } from "zustand";
import useUserStore from "./UserStore";
import useNavigateStore from "./NavigateStore";
import AuthenticationPage from "src/pages/authentication";
import AddressMap from "src/components/Map";

const useModalStore = create((set, get) => ({
	setData: (data) => set((state) => ({ ...state, ...data })),
	showFormTextModal: () => {
		const state = get();
		const userStore = useUserStore.getState();
		const isSearch = window.location.pathname?.includes(routes.search.root);
		const navigateStore = useNavigateStore.getState();

		if (
			userStore?.data &&
			!userStore?.data?.type?.isAdmin &&
			![formStatusType.accept.value, formStatusType.in_processing.value].includes(userStore?.data?.formStatus)
		)
			state.show(
				<QuestionComponent
					{...{
						title: "خوش آمدید!!",
						description: "اگر میخواهید قیمت متناسب با کسب و کار خودتان را مشاهده کنید نیاز به پر کردن فرم میباشد",
						button: {
							confirm: {
								label: "بله ، پر میکنم",
								onClick: () => {
									navigateStore?.(routes.profile.link);
									state.hide();
								},
							},
							reject: {
								label: isSearch ? "خیر ، بستن" : "مشاهده محصولات",
								onClick: () => {
									if (!isSearch) navigateStore?.(routes.search.link);
									state.hide();
								},
							},
						},
					}}
				/>
			);
	},
	showLoginTextModal: (data) => {
		const state = get();
		const navigateStore = useNavigateStore.getState();
		state.show(
			<QuestionComponent
				{...{
					title: "خوش آمدید!!",
					description: "دیدن لیست قیمت‌ها مخصوص همکاران می‌باشد لطفاً برای دیدن لیست ورود کنید",
					button: {
						confirm: {
							label: "ورود",
							onClick: () => {
								state.hide();
								state.show(
									<AuthenticationPage
										onClose={() => {
											navigateStore(`${routes.search.link}/${data?.category?.slug || ""}`);
											state.hide();
										}}
									/>,
									{
										disableBackDropClose: true,
									}
								);
							},
						},
						reject: {
							label: "بستن",
							onClick: () => {
								state.hide();
							},
						},
					},
				}}
			/>
		);
	},
	showNeshanMapModal: (data, callback) => {
		const state = get();
		state.show(
			<AddressMap
				show={true}
				onSelect={(...x) => {
					state.hide();
					callback(...x);
				}}
				selected={data.lat && { lat: data.lat, lng: data.lng }}
				onClose={state.hide}
			/>
		);
	},
}));

export default useModalStore;
