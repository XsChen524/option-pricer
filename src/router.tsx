import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./views/HomeView";

const MainRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
		</Routes>
	);
};

const AppRouter = () => {
	return (
		<HashRouter>
			<MainRouter />
		</HashRouter>
	);
};

export default AppRouter;
