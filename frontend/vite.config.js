import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
	base: "./", // 🟢 Baraye inke asset-ha dorost load shan
	plugins: [react()],
});
