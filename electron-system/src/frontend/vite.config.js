// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		port: 3000,
		strictPort: true,
	},
	build: {
		outDir: "../dist",
		emptyOutDir: true,
	},

	resolve: {
		alias: {
		  src: path.resolve(__dirname, './src'),
		},
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
	  },
});
