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
