import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SetupWizard from "./components/setup/SetupWizard";
import MainLayout from "./components/layout/main";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<Routes>
					<Route path="/setup/*" element={<SetupWizard />} />
					<Route path="/*" element={<MainLayout />} />
				</Routes>
			</Router>
		</QueryClientProvider>
	);
}

export default App;
