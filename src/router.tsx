import React from "react";
import { Route, Routes } from "react-router-dom";
import ExtendedBSView from "./view/ExtendedBSView";
import ImpVolView from "./view/ImpVolView";
import Home from "./view/HomeView";
import GeometricView from "./view/CFGeoView";
import BasketGeoView from "./view/BasketGeoView";

const AppRouter: React.FunctionComponent<{}> = () => {
	return (
		<Routes>
			<Route index path="/" element={<Home />} />
			<Route path="ebs" element={<ExtendedBSView />} />
			<Route path="iv" element={<ImpVolView />} />
			<Route path="cfg" element={<GeometricView />} />
			<Route path="bg" element={<BasketGeoView />} />
		</Routes>
	);
};

export default AppRouter;
