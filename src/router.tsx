import React from "react";
import { Route, Routes } from "react-router-dom";
import ExtendedBSView from "./view/ExtendedBSView";
import IvView from "./view/IvView";
import Home from "./view/HomeView";

const AppRouter: React.FunctionComponent<{}> = () => {
	return (
		<Routes>
			<Route index path="/" element={<Home />} />
			<Route path="ebs" element={<ExtendedBSView />} />
			<Route path="iv" element={<IvView />} />
		</Routes>
	);
};

export default AppRouter;
