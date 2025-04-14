import { userTypeOptions } from "src/enumerations";
import axiosInstance from "src/lib/axios";
import api from "src/services/api.jsx";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import useTokenStore from "./TokenStore";
const initialValue = {
	user: null,
	data: null,
	address: null,
	isLoading: false,
	isFetching: false,
};

const useUserStore = create(
	persist(
		(set, get) => ({
			...initialValue,
			getUser: async () => {
				const state = get();
				const tokenStore = useTokenStore.getState();
				const accessToken = tokenStore?.data?.accessToken;
				const currentDate = +new Date();
				const remainingTime = accessToken?.expiresAt - currentDate - 10000 > 0;
				console.log({ remainingTime }, !!remainingTime);
				if (!remainingTime) return;
				// ...(state.data.id?{isLoading: true}:{isFetching: true})
				set((state) => ({ ...state, isLoading: true }));
				try {
					const resData = await axiosInstance().get(api.user.me);
					// console.log("* * * useUserStore getUser : ", { resData });
					const user = { ...resData?.data };
					user.type = userTypeOptions[user.type];
					user.fullName = user?.firstName ? `${user?.firstName || ""} ${user?.lastName || ""}` : "";
					user.withHouse = user?.houseCount > 0 || user?.houseManagerCount > 0;

					set((state) => ({ ...state, isLoading: false, data: user }));
					return user;
				} catch (error) {
					set((state) => ({ ...state, isLoading: false, error }));
				}
			},
			setUser: (data) => set((state) => ({ ...state, data })),
			logout: () => {
				const tokenStore = useTokenStore.getState();
				tokenStore.initial();
				set({ ...initialValue });
			},
			setAddress: (address) => set((state) => ({ ...state, address })),
		}),
		{
			name: "user-storage", // name of the item in the storage (must be unique)
			getStorage: () => localStorage,
			partialize: (state) => {
				const { isLoading, isFetching, ...partialState } = state;
				return partialState;
			}, // specify which parts of the state to persist
		}
	)
);

export default useUserStore;
