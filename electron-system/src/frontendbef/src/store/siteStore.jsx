import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSiteStore = create(
	persist((set) => ({
		theme: {
			isDark: false,
		},
		toggle: () => set((state) => ({ ...state, theme: { ...state.theme, isDark: !state.theme.isDark } })),
	}))
);

export default useSiteStore;
