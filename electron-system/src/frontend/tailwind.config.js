/** @type {import('tailwindcss').Config} */
import { devices, getRatio } from "./src/utils/themes";

const dynamicSpacing = Object.keys(getRatio || {}).reduce((acc, key) => {
	acc[key] = `${getRatio[key]}%`;
	return acc;
}, {});
export default {
	// darkMode: "class", // Enable dark mode based on class
	mode: "jit",
	darkMode: ["class", '[class="dark-mode"]'],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	plugins: [require("tailwindcss-rtl")],
	safelist: Object.keys(getRatio || {}).flatMap((key) => [`pb-${key}`, `pt-${key}`, `pr-${key}`, `pl-${key}`]),

	theme: {
		screens: {
			// Standard screens
			xs: { min: devices.xs + "px" },
			ss: { min: devices.ss + "px" },
			sm: { min: devices.sm + "px" },
			sl: { min: devices.sl + "px" },
			sxl: { min: devices.sxl + "px" },
			md: { min: devices.md + "px" },
			g: { min: devices.g + "px" },
			lg: { min: devices.lg + "px" },
			xl: { min: devices.xl + "px" },

			// Min screens (+1)
			"min-xs": { min: devices.xs + 1 + "px" },
			"min-sm": { min: devices.sm + 1 + "px" },
			"min-ss": { min: devices.ss + 1 + "px" },
			"min-sl": { min: devices.sl + 1 + "px" },
			"min-sxl": { min: devices.sxl + 1 + "px" },
			"min-md": { min: devices.md + 1 + "px" },
			"min-g": { min: devices.g + 1 + "px" },
			"min-lg": { min: devices.lg + 1 + "px" },
			"min-xl": { min: devices.xl + 1 + "px" },

			// Max screens (-1)
			"max-xs": { max: devices.xs - 1 + "px" },
			"max-sm": { max: devices.sm - 1 + "px" },
			"max-ss": { max: devices.ss - 1 + "px" },
			"max-sl": { max: devices.sl - 1 + "px" },
			"max-sxl": { max: devices.sxl - 1 + "px" },
			"max-md": { max: devices.md - 1 + "px" },
			"max-g": { max: devices.g - 1 + "px" },
			"max-lg": { max: devices.lg - 1 + "px" },
			"max-xl": { max: devices.xl - 1 + "px" },
		},

		extend: {
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0", transform: "translateY(-5vh)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				fadeOut: {
					"0%": { opacity: "1", transform: "translateY(0)" },
					"100%": { opacity: "0", transform: "translateY(-5vh)" },
				},
			},
			animation: {
				fadeIn: "fadeIn 0.5s ease-out",
				fadeOut: "fadeOut 0.5s ease-in",
			},
			fontFamily: {
				"iran-yekan": ["IRANYekan", "sans-serif"],
				sans: ["IRANYekan", "sans-serif"],
				// serif: ["Merriweather", "serif"],
				// custom: ["YourCustomFontName", "sans-serif"], // Replace with your font's name
			},
			fontSize: {
				xs: ["var(--font-size-xs)", { lineHeight: "1rem" }],
				sm: ["var(--font-size-sm)", { lineHeight: "1.25rem" }],
				md: ["var(--font-size-md)", { lineHeight: "1.5rem" }],
				lg: ["var(--font-size-lg)", { lineHeight: "1.75rem" }],
				xl: ["var(--font-size-xl)", { lineHeight: "1.75rem" }],
				"2xl": ["var(--font-size-2xl)", { lineHeight: "2rem" }],
				"3xl": ["var(--font-size-3xl)", { lineHeight: "2.25rem" }],
				"4xl": ["var(--font-size-4xl)", { lineHeight: "2.5rem" }],
				"5xl": ["var(--font-size-5xl)", { lineHeight: "1" }],
				"6xl": ["var(--font-size-6xl)", { lineHeight: "1" }],
				"7xl": ["var(--font-size-7xl)", { lineHeight: "1" }],
				"8xl": ["var(--font-size-8xl)", { lineHeight: "1" }],
				"9xl": ["var(--font-size-9xl)", { lineHeight: "1" }],
			},
			colors: {
				gray: {
					50: "rgb(var(--gray-d-50) / <alpha-value>)",
					100: "rgb(var(--gray-d-100) / <alpha-value>)",
					200: "rgb(var(--gray-d-200) / <alpha-value>)",
					300: "rgb(var(--gray-d-300) / <alpha-value>)",
					400: "rgb(var(--gray-d-400) / <alpha-value>)",
					500: "rgb(var(--gray-d-500) / <alpha-value>)",
					600: "rgb(var(--gray-d-600) / <alpha-value>)",
					700: "rgb(var(--gray-d-700) / <alpha-value>)",
					800: "rgb(var(--gray-d-800) / <alpha-value>)",
					900: "rgb(var(--gray-d-900) / <alpha-value>)",
				},
				"gray-s": {
					50: "rgb(var(--gray-s-50) / <alpha-value>)",
					100: "rgb(var(--gray-s-100) / <alpha-value>)",
					200: "rgb(var(--gray-s-200) / <alpha-value>)",
					300: "rgb(var(--gray-s-300) / <alpha-value>)",
					400: "rgb(var(--gray-s-400) / <alpha-value>)",
					500: "rgb(var(--gray-s-500) / <alpha-value>)",
					600: "rgb(var(--gray-s-600) / <alpha-value>)",
					700: "rgb(var(--gray-s-700) / <alpha-value>)",
					800: "rgb(var(--gray-s-800) / <alpha-value>)",
					900: "rgb(var(--gray-s-900) / <alpha-value>)",
				},
				primary: "rgb(var(--color-primary) / <alpha-value>)",
				secondary: "rgb(var(--color-secondary) / <alpha-value>)",
				danger: "rgb(var(--color-danger) / <alpha-value>)",
				warning: "rgb(var(--color-warning) / <alpha-value>)",
				success: "rgb(var(--color-success) / <alpha-value>)",
				info: "rgb(var(--color-info) / <alpha-value>)",
				white: "rgb(var(--color-d-white) / <alpha-value>)",
				black: "rgb(var(--color-d-black) / <alpha-value>)",
				"white-s": "rgb(var(--color-s-white) / <alpha-value>)",
				"black-s": "rgb(var(--color-s-black) / <alpha-value>)",
			},
			boxShadow: {
				// Small shadows
				"sm-light": "0 1px 2px rgba(0, 0, 0, 0.1)",
				"sm-dark": "0 1px 2px rgba(0, 0, 0, 0.3)",

				// Medium shadows
				"md-light": "0 4px 6px rgba(0, 0, 0, 0.1)",
				"md-dark": "0 4px 6px rgba(0, 0, 0, 0.3)",

				// Large shadows
				"lg-light": "0 10px 15px rgba(0, 0, 0, 0.1)",
				"lg-dark": "0 10px 15px rgba(0, 0, 0, 0.3)",

				// Extra large shadows (optional)
				"xl-light": "0 20px 25px rgba(0, 0, 0, 0.1)",
				"xl-dark": "0 20px 25px rgba(0, 0, 0, 0.3)",
			},
			borderRadius: {
				sm: "0.125rem",
				md: "0.375rem",
				lg: "0.5rem",
				xl: "0.75rem",
				full: "9999px",
			},
			borderWidth: {
				thin: "1px",
				medium: "2px",
				thick: "4px",
				extra: "8px",
			},
			spacing: {
				1: "4px",
				2: "8px",
				3: "12px",
				4: "16px",
				5: "20px",
				6: "24px",
				10: "40px",
				12: "48px",
				20: "80px",
				...dynamicSpacing,
			},
		},
	},
};
