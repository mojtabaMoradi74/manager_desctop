import ComponentsOverrides from "./override";
import { useEffect, useMemo, useState } from "react";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider as MUIThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import useSiteStore from "../store/siteStore";
import palette from "./palette";
import shadows, { customShadows } from "./shadows";
import typography from "./typography";
import createCustomShadow from "./createCustomShadow";

const ThemeProvider = ({ children }) => {
	const [themeShadows, setThemeShadows] = useState({ light: {}, dark: {} });
	const siteStore = useSiteStore((state) => state);

	const isLight = !siteStore.theme.isDark;

	console.log({ isLight });

	useEffect(() => {
		const gray500 = getComputedStyle(document.documentElement).getPropertyValue("--gray-500").trim().replace(/\s+/g, ",") || "0,0,0";
		const DARK_MODE = gray500 ? `rgb(${gray500})` : palette.light.grey[500];
		const LIGHT_MODE = gray500 ? `rgb(${gray500})` : palette.light.grey[500];

		// Set the shadows using the computed values
		setThemeShadows({
			light: createCustomShadow(LIGHT_MODE),
			dark: createCustomShadow(DARK_MODE),
		});
	}, []); // Run once on mount

	const themeOptions = useMemo(
		() => ({
			palette: isLight ? palette.light : palette.dark,
			shadows: isLight ? shadows.light : shadows.dark,
			customShadows: isLight ? themeShadows.light : themeShadows.dark,
			// customShadows: isLight ? customShadows.light : customShadows.dark,
			typography,
			shape: { borderRadius: 3 },
			direction: "rtl",
		}),
		[isLight, themeShadows]
	);

	const theme = createTheme(themeOptions);

	theme.components = ComponentsOverrides(theme);

	return (
		<StyledEngineProvider injectFirst>
			<MUIThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</MUIThemeProvider>
		</StyledEngineProvider>
	);
};
export default ThemeProvider;
