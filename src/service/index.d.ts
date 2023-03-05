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
