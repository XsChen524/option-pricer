import React from "react";
import { Route, Routes } from "react-router-dom";
import BinomialTreeView from "view/BinomialTreeView";
import KikoView from "view/KikoView";
import ExtendedBSView from "./view/ExtendedBSView";
import ImpVolView from "./view/ImpVolView";
import Home from "./view/HomeView";
import GeometricView from "./view/CFGeoView";
import BasketGeoView from "./view/BasketGeoView";
import MCAsianView from "./view/MCAsianView";
import MCBasketView from "./view/MCBasketView";

const AppRouter: React.FunctionComponent<{}> = () => {
	return (
		<Routes>
			<Route index path="/" element={<Home />} />
			<Route path="ebs" element={<ExtendedBSView />} />
			<Route path="iv" element={<ImpVolView />} />
			<Route path="cfg" element={<GeometricView />} />
			<Route path="bg" element={<BasketGeoView />} />
			<Route path="mc" element={<MCAsianView />} />
			<Route path="mb" element={<MCBasketView />} />
			<Route path="bt" element={<BinomialTreeView />} />
			<Route path="kiko" element={<KikoView />} />
		</Routes>
	);
};

export default AppRouter;
