export interface ExtendedBSParams {
	spot: number;
	strike: number;
	timeToMaturity: number;
	riskFreeRate: number;
	repoRate: number;
	volatility: number;
	optionType: "C" | "P";
}
