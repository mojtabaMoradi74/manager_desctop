import { ThemeProvider } from "@material-tailwind/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SetupWizard from "./components/setup/SetupWizard";
import MainLayout from "./components/layout/main";
import WizardLayout from "./components/layout/wizard";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<Router>
					<Routes>
						<Route
							path="/setup/*"
							element={
								<WizardLayout>
									<SetupWizard />
								</WizardLayout>
							}
						/>
						<Route path="/*" element={<MainLayout />} />
					</Routes>
				</Router>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;
