import { create } from "zustand";

const initialValue = {
};

const useNavigateStore = create(
		(set) => ({
			...initialValue,
			setData: (data) => set(() => data),
		})
);

export default useNavigateStore;
