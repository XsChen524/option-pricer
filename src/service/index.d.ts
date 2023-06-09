export interface ExtendedBSRawParams {
	spot: string;
	strike: string;
	termToMaturity: string;
	riskFreeRate: string;
	repoRate: string;
	volatility: string;
	optionType: string;
}
export interface ExtendedBSParams {
	spot: number;
	strike: number;
	termToMaturity: number;
	riskFreeRate: number;
	repoRate: number;
	volatility: number;
	optionType: "C" | "P";
}

export interface ImpVolParams {
	spot: number;
	strike: number;
	termToMaturity: number;
	riskFreeRate: number;
	repoRate: number;
	optionType: "C" | "P";
	value: number;
}

export interface ImpVolRawParams {
	spot: string;
	strike: string;
	termToMaturity: string;
	riskFreeRate: string;
	repoRate: string;
	optionType: string;
	value: string;
}

export interface CFGeoParams {
	spot: number;
	strike: number;
	timeToMaturity: number;
	riskFreeRate: number;
	volatility: number;
	observeTime: number;
	optionType: "C" | "P";
}

export interface CFGeoRawParams {
	spot: string;
	strike: string;
	timeToMaturity: string;
	riskFreeRate: string;
	volatility: string;
	observeTime: string;
	optionType: string;
}

export interface BGParams {
	spot1: number;
	spot2: number;
	volatility1: number;
	volatility2: number;
	riskFreeRate: number;
	timeToMaturity: number;
	strike: number;
	correlation: number;
	optionType: "C" | "P";
}

export interface BGRawParams {
	spot1: string;
	spot2: string;
	volatility1: string;
	volatility2: string;
	riskFreeRate: string;
	timeToMaturity: string;
	strike: string;
	correlation: string;
	optionType: string;
}

export interface MCAsianParams {
	spot: number;
	strike: number;
	timeToMaturity: number;
	riskFreeRate: number;
	volatility: number;
	observeTime: number;
	path: number;
	method: "MC" | "Geo";
	optionType: "C" | "P";
}

export interface MCAsianRawParams {
	spot: string;
	strike: string;
	timeToMaturity: string;
	riskFreeRate: string;
	volatility: string;
	observeTime: string;
	path: string;
	method: string;
	optionType: string;
}

export interface MCBasketParams {
	spot1: number;
	spot2: number;
	volatility1: number;
	volatility2: number;
	riskFreeRate: number;
	timeToMaturity: number;
	strike: number;
	correlation: number;
	optionType: "C" | "P";
	path: number;
	method: "MC" | "Geo";
}

export interface MCBasketRawParams {
	spot1: string;
	spot2: string;
	volatility1: string;
	volatility2: string;
	riskFreeRate: string;
	timeToMaturity: string;
	strike: string;
	correlation: string;
	optionType: string;
	path: string;
	method: string;
}

export interface AmericanParams {
	spot: number;
	strike: number;
	timeToMaturity: number;
	riskFreeRate: number;
	volatility: number;
	steps: number;
	optionType: "C" | "P";
}

export interface AmericanRawParams {
	spot: string;
	strike: string;
	timeToMaturity: string;
	riskFreeRate: string;
	volatility: string;
	steps: string;
	optionType: string;
}

export interface KikoParams {
	spot: number;
	strike: number;
	timeToMaturity: number;
	riskFreeRate: number;
	volatility: number;
	lowerBarrier: number;
	upperBarrier: number;
	observeTime: number;
	rebate: number;
	numPaths: number;
}

export interface KikoRawParams {
	spot: string;
	strike: string;
	timeToMaturity: string;
	riskFreeRate: string;
	volatility: string;
	lowerBarrier: string;
	upperBarrier: string;
	observeTime: string;
	rebate: string;
	numPaths: number;
}

export interface KikoResult {
	value: number;
	std: number;
	confInt: number[];
}
