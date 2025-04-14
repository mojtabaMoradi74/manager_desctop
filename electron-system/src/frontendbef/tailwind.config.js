// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
		"node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			// می‌تونی رنگ‌ها یا فونت‌های اختصاصی‌تو اینجا بیاری
			colors: {
				primary: "rgb(var(--color-primary) / <alpha-value>)",
				secondary: "rgb(var(--color-secondary) / <alpha-value>)",
			},
			fontFamily: {
				vazir: ["Vazir", "sans-serif"],
			},
		},
	},
	plugins: [],
};

// import withMT from "@material-tailwind/react/utils/withMT";

// /** @type {import('tailwindcss').Config} */
// export default withMT({
// 	content: [
// 		"./index.html",
// 		"./src/**/*.{js,ts,jsx,tsx}",
// 		"node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
// 		"node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
// 	],
// 	theme: {
// 		extend: {},
// 	},
// 	plugins: [],
// 	important: true,
// 	corePlugins: {
// 		preflight: false,
// 	},
// });

// export default {
// 	content: [
// 		"./index.html",
// 		"./src/**/*.{js,ts,jsx,tsx}",
// 		"node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
// 		"node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
// 	],
// 	theme: {
// 		extend: {},
// 	},
// 	plugins: [],
// };

// import { mtConfig } from "@material-tailwind/react";

// /** @type {import('tailwindcss').Config} */

// export default {
// 	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}"],

// 	theme: {
// 		extend: {},
// 	},

// 	plugins: [mtConfig],
// };
