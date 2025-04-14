import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

function createGradient(color1, color2) {
	return `linear-gradient(to bottom, ${color1}, ${color2})`;
}
const getCssVariable = (variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
console.log({ aaaaaa: getCssVariable("--grey-60") });
// SETUP COLORS
const PRIMARY = {
	// lighter: '#C8FACD',
	// light: '#5BE584',
	// main: '#00AB55',
	// dark: '#007B55',
	// darker: '#005249',
	lighter: "#3BCE99",
	light: "#3BCE99",
	main: "#3BCE99",
	dark: "#3BCE99",
	darker: "#3BCE99",
};
const SECONDARY = {
	lighter: "#D6E4FF",
	light: "#84A9FF",
	main: "#f50057",
	dark: "#1939B7",
	darker: "#091A7A",
};
const INFO = {
	lighter: "#D0F2FF",
	light: "#74CAFF",
	main: "#1890FF",
	dark: "#0C53B7",
	darker: "#04297A",
};
const SUCCESS = {
	lighter: "#09A363",
	light: "#09A363",
	// main: '#09A363',
	main: "#006738",
	dark: "#09A363",
	darker: "#09A363",
};
const WARNING = {
	lighter: "#FFF7CD",
	light: "#FFE16A",
	main: "#FFC107",
	dark: "#B78103",
	darker: "#7A4F01",
};
const ERROR = {
	lighter: "#FFE7D9",
	light: "#FFA48D",
	main: "#FF4842",
	dark: "#B72136",
	darker: "#7A0C2E",
};

const GREY = {
	dark: "rgb(243 ,244 ,246)",
	// 0: "rgb(249, 250 ,251)",
	// 50: "rgb(249, 250 ,251)",
	// 100: "rgb(243 ,244 ,246)",
	// 200: "rgb( 229, 231 ,235)",
	// 300: "rgb(209 ,213, 219)",
	// 400: "rgb(156 ,163, 175)",
	// 500: "rgb(107 ,114, 128)",
	// 600: "rgb(75, 85, 99)",
	// 700: "rgb(55, 65, 81)",
	// 800: "rgb(31, 41, 55)",
	// 900: "rgb(17, 24, 39)",
	main: "rgb(var(--gray-500))",
	50: "rgb(var(--gray-50))",
	100: "rgb(var(--gray-100))",
	200: "rgb(var(--gray-200))",
	300: "rgb(var(--gray-300))",
	400: "rgb(var(--gray-400))",
	500: "rgb(var(--gray-500))",
	600: "rgb(var(--gray-600))",
	700: "rgb(var(--gray-700))",
	800: "rgb(var(--gray-800))",
	900: "rgb(var(--gray-900))",
	// 0: `rgb(${getCssVariable("--grey-0")})`,
	// 50: `rgb(${getCssVariable("--grey-50")})`,
	// 100: `rgb(${getCssVariable("--grey-100")})`,
	// 200: `rgb(${getCssVariable("--grey-200")})`,
	// 300: `rgb(${getCssVariable("--grey-300")})`,
	// 400: `rgb(${getCssVariable("--grey-400")})`,
	// 500: `rgb(${getCssVariable("--grey-500")})`,
	// 600: `rgb(${getCssVariable("--grey-600")})`,
	// 700: `rgb(${getCssVariable("--grey-700")})`,
	// 800: `rgb(${getCssVariable("--grey-800")})`,
	// 900: `rgb(${getCssVariable("--grey-900")})`,
	500_8: alpha("#919EAB", 0.08),
	500_12: alpha("#919EAB", 0.12),
	500_16: alpha("#919EAB", 0.16),
	500_24: alpha("#919EAB", 0.24),
	500_32: alpha("#919EAB", 0.32),
	500_48: alpha("#919EAB", 0.48),
	500_56: alpha("#919EAB", 0.56),
	500_80: alpha("#919EAB", 0.8),
};

const GREY_LIGHT = {
	dark: "rgb(0 ,0 ,0)",
	main: "rgb(var(--gray-500))",
	50: "rgb(var(--gray-50))",
	100: "rgb(var(--gray-100))",
	200: "rgb(var(--gray-200))",
	300: "rgb(var(--gray-300))",
	400: "rgb(var(--gray-400))",
	500: "rgb(var(--gray-500))",
	600: "rgb(var(--gray-600))",
	700: "rgb(var(--gray-700))",
	800: "rgb(var(--gray-800))",
	900: "rgb(var(--gray-900))",
	500_8: alpha("#919EAB", 0.08),
	500_12: alpha("#919EAB", 0.12),
	500_16: alpha("#919EAB", 0.16),
	500_24: alpha("#919EAB", 0.24),
	500_32: alpha("#919EAB", 0.32),
	500_48: alpha("#919EAB", 0.48),
	500_56: alpha("#919EAB", 0.56),
	500_80: alpha("#919EAB", 0.8),
};

const GREY_DARK = {
	dark: "rgb(0 ,0 ,0)",
	0: "rgb(0 ,0 ,0)",
	main: "rgb(var(--gray-500))",
	50: "rgb(var(--gray-50))",
	100: "rgb(var(--gray-100))",
	200: "rgb(var(--gray-200))",
	300: "rgb(var(--gray-300))",
	400: "rgb(var(--gray-400))",
	500: "rgb(var(--gray-500))",
	600: "rgb(var(--gray-600))",
	700: "rgb(var(--gray-700))",
	800: "rgb(var(--gray-800))",
	900: "rgb(var(--gray-900))",
	500_8: alpha("#919EAB", 0.08),
	500_12: alpha("#919EAB", 0.12),
	500_16: alpha("#919EAB", 0.16),
	500_24: alpha("#919EAB", 0.24),
	500_32: alpha("#919EAB", 0.32),
	500_48: alpha("#919EAB", 0.48),
	500_56: alpha("#919EAB", 0.56),
	500_80: alpha("#919EAB", 0.8),
};
// const GREY_DARK = {
// 	main: "rgb(0 ,0 ,0)",
// 	dark: "rgb(0 ,0 ,0)",
// 	0: "rgb(0 ,0 ,0)",
// 	900: "rgb(249, 250 ,251)",
// 	800: "rgb(243 ,244 ,246)",
// 	700: "rgb( 229, 231 ,235)",
// 	600: "rgb(209 ,213, 219)",
// 	500: "rgb(156 ,163, 175)",
// 	400: "rgb(107 ,114, 128)",
// 	300: "rgb(75, 85, 99)",
// 	200: "rgb(55, 65, 81)",
// 	100: "rgb(31, 41, 55)",
// 	50: "rgb(17, 24, 39)",
// };
const GRADIENTS = {
	primary: createGradient(PRIMARY.light, PRIMARY.main),
	info: createGradient(INFO.light, INFO.main),
	success: createGradient(SUCCESS.light, SUCCESS.main),
	warning: createGradient(WARNING.light, WARNING.main),
	error: createGradient(ERROR.light, ERROR.main),
};

const CHART_COLORS = {
	violet: ["#826AF9", "#9E86FF", "#D0AEFF", "#F7D2FF"],
	blue: ["#2D99FF", "#83CFFF", "#A5F3FF", "#CCFAFF"],
	green: ["#2CD9C5", "#60F1C8", "#A4F7CC", "#C0F2DC"],
	yellow: ["#FFE700", "#FFEF5A", "#FFF7AE", "#FFF3D6"],
	red: ["#FF6C40", "#FF8F6D", "#FFBD98", "#FFF2D4"],
};

const COMMON = {
	common: { black: "#000", white: "#fff" },
	primary: { ...PRIMARY, contrastText: "#fff" },
	secondary: { ...SECONDARY, contrastText: "#fff" },
	info: { ...INFO, contrastText: "#fff" },
	success: { ...SUCCESS, contrastText: "#fff" },
	warning: { ...WARNING, contrastText: "#fff" },
	error: { ...ERROR, contrastText: "#fff" },
	// grey: { ...GREY, contrastText: "#000" },
	// gradients: GRADIENTS,
	// chart: CHART_COLORS,
	// divider: GREY[500_24],
	// action: {
	//   hover: GREY[500_8],
	//   selected: GREY[500_16],
	//   disabled: GREY[500_80],
	//   disabledBackground: GREY[500_24],
	//   focus: GREY[500_24],
	//   hoverOpacity: 0.08,
	//   disabledOpacity: 0.48,
	// },
};

const palette = {
	light: {
		...COMMON,
		grey: { ...GREY_LIGHT },
		mode: "light",
		text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
		// background: { paper: "#fff", default: "#fff", neutral: GREY[200] },
		action: { active: GREY[600], ...COMMON.action },
	},
	dark: {
		...COMMON,
		grey: { ...GREY_DARK },
		mode: "dark",
		text: { primary: "#fff", secondary: GREY[500], disabled: GREY[600] },
		// background: { paper: GREY[800], default: GREY[900], neutral: GREY[500_16] },
		action: { active: GREY[500], ...COMMON.action },
	},
};

export default palette;
