import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { store, persistor } from "./redux/store";
import { QueryClient, QueryClientProvider } from "react-query";
import moment from "moment-jalaali";
import { AuthProvider } from "./contexts/JWTContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { CollapseDrawerProvider } from "./contexts/CollapseDrawerContext";
import "moment/locale/fa";

// i18n
import "./locales/i18n";

// highlight
import "./utils/highlight";

// scroll bar

// lightbox

// map
import "mapbox-gl/dist/mapbox-gl.css";

// editor
import "react-quill/dist/quill.snow.css";

// slick-carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// lazy image
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-lazy-load-image-component/src/effects/opacity.css";
import "react-lazy-load-image-component/src/effects/black-and-white.css";

// React toastify
import "react-toastify/dist/ReactToastify.css";

import "./assets/css/index.css";
import "./index.css";

moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
		},
	},
});
// ReactDOM.createRoot(document.getElementById('root')).render("aaaaaaa")
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<HelmetProvider>
				<ReduxProvider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<AuthProvider>
							{/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
							<SettingsProvider>
								<CollapseDrawerProvider>
									<BrowserRouter>
										<App />
									</BrowserRouter>
								</CollapseDrawerProvider>
							</SettingsProvider>
							{/* </LocalizationProvider> */}
						</AuthProvider>
					</PersistGate>
				</ReduxProvider>
			</HelmetProvider>
		</QueryClientProvider>
	</React.StrictMode>
);
