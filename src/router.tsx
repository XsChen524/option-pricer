import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./views/HomeView";

const MainRouter: React.FunctionComponent<{}> = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
		</Routes>
	);
};

const AppRouter: React.FunctionComponent<{}> = () => {
	return (
		<HashRouter>
			<MainRouter />
		</HashRouter>
	);
};

export default AppRouter;
