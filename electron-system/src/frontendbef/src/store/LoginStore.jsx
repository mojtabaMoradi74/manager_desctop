import axiosInstance from "src/lib/axios";
import api from "src/services/api.jsx";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialValue = {
	user: null,
	params: null,
	data: null,
	isLoading: false,
	isFetching: false,
};

const useLoginStore = create(
	persist(
		(set) => ({
			...initialValue,
			login: async (params) => {
				console.log("* * * useLoginStore login : ", { params });
				set((state) => ({ ...state, params, isLoading: true }));
				try {
					const resData = await axiosInstance().post(api.auth.login, params);
					console.log("* * * useLoginStore login : ", { resData });
					set((state) => ({ ...state, isLoading: false, data: resData?.data, error: null }));
					return resData?.data;
				} catch (error) {
					set((state) => ({ ...state, isLoading: false, error }));
				}
			},
			// resendCode: async (params) => {
			// 	console.log("* * * useLoginStore resendCode : ", { params });
			// 	set((state) => ({ ...state, params, isLoading: true }));
			// 	try {
			// 		const resData = await axiosInstance().post(api.auth.resendCode, params);
			// 		console.log("* * * useLoginStore resendCode : ", { resData });
			// 		set((state) => ({ ...state, isLoading: false, data: resData?.data, error: null }));
			// 		return resData?.data;
			// 	} catch (error) {
			// 		set((state) => ({ ...state, isLoading: false, error }));
			// 	}
			// },
			setData: (data) => {
				set(() => ({ ...initialValue, data }));
			},
			initial: () => {
				set(() => ({ ...initialValue }));
			},
		}),
		{
			name: "login-storage", // name of the item in the storage (must be unique)
			getStorage: () => localStorage,
			partialize: (state) => {
				const { isLoading, isFetching, ...partialState } = state;
				return partialState;
			}, // specify which parts of the state to persist
		}
	)
);

export default useLoginStore;
