import api from "src/services/api.jsx";
import { checkExpireTime } from "src/utils/dating";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../lib/axios";
import useUserStore from "./UserStore";
// import useUserStore from "./UserStore";

const initialValue = {
	data: undefined,
	loading: false,
	isFetching: false,
};

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
	refreshSubscribers.forEach((callback) => callback(token));
	refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
	refreshSubscribers.push(callback);
}

const useTokenStore = create(
	persist(
		(set, get) => ({
			...initialValue,
			setToken: (data) =>
				set((state) => ({
					...state,
					loading: false,
					isFetching: false,
					data: data,
				})),
			checkTokenExpire: () => {
				const state = get();
				const current = state.data.accessToken;
				console.log("* * * useTokenStore checkTokenExpire : ", { current });

				// console.log("* * * useTokenStore connectWallet : ", { currentVerifiedWallet });
				const isValidToken = checkExpireTime(current?.expiresAt);
				console.log("* * * useTokenStore checkTokenExpire : ", { isValidToken });

				if (!isValidToken) {
					return false;
				}

				return true;
			},
			refreshToken: async () => {
				console.log("* * * useTokenStore refreshToken start ", { isRefreshing });
				const userStore = useUserStore.getState();

				if (isRefreshing) {
					return new Promise((resolve) => {
						addRefreshSubscriber((token) => {
							resolve(token);
						});
					});
				}

				isRefreshing = true;

				const state = get();
				const refresh = state.data?.refreshToken?.token;
				set((state) => ({ ...state, isLoading: true }));
				try {
					const resData = await axiosInstance({ token: refresh }).get(api.auth?.refreshToken);
					console.log("* * * useTokenStore refreshToken : ", { resData });
					const accessToken = {
						token: resData?.data?.accessToken,
						expiresAt: +new Date(resData?.data?.accessTokenExpire),
					};
					set((state) => ({
						...state,
						isLoading: false,
						data: {
							...state.data,
							accessToken,
						},
					}));
					isRefreshing = false;
					onRefreshed(accessToken);

					await userStore.getUser();
					return accessToken;
				} catch (error) {
					console.log("* * * useTokenStore refreshToken : ", { error });

					isRefreshing = false;
					set((state) => ({ ...state, isLoading: false, error }));
				}
			},
			initial: () => set({ ...initialValue }),
		}),
		{
			name: "token-storage", // name of the item in the storage (must be unique)
			getStorage: () => localStorage,
		}
	)
);

export default useTokenStore;
