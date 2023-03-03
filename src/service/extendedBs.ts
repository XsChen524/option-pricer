import { create, all } from "mathjs";
import cdf from "@stdlib/stats-base-dists-normal-cdf";
import { ExtendedBSParams } from "./input";

/**
 * Instance of mathjs
 */
const math = create(all, {
	number: "number",
});

/**
 * N(x): standard normal cdf.
 * @param {number} arg input number
 */
// eslint-disable-next-line no-unused-vars
const standardNormalCdf: (arg: number) => number = cdf.factory(0, 1);

/**
 * @class ExtendedBS
 * @implements ExtendedBSParams
 */
export default class ExtendedBS implements ExtendedBSParams {
	spot: number;

	strike: number;

	termToMaturity: number;

	riskFreeRate: number;

	repoRate: number;

	volatility: number;

	optionType: "C" | "P";

	constructor(props: ExtendedBSParams) {
		this.spot = props.spot;
		this.strike = props.strike;
		this.riskFreeRate = props.riskFreeRate;
		this.repoRate = props.repoRate;
		this.optionType = props.optionType;
		this.termToMaturity = props.termToMaturity;
		this.volatility = props.volatility;
	}

	/**
	 * Get the value of d1 and d2 of this Extended Black Scholes
	 * @param {'1' | '2'} dType return d1 if '1'
	 * @return {number} return d param
	 */
	dParam(dType: "1" | "2"): number {
		const firstTerm =
			math.log<number>(math.divide(this.spot, this.strike)) +
			(this.riskFreeRate - this.repoRate) * this.termToMaturity;
		const secondTerm =
			this.volatility * (math.sqrt(this.termToMaturity) as number);
		const thirdTerm = 0.5 * secondTerm;

		return dType === "1"
			? math.divide(firstTerm, secondTerm) + thirdTerm
			: math.divide(firstTerm, secondTerm) - thirdTerm;
	}

	/**
	 * Get the value of European Option.
	 * @return {number} return European Option value
	 */
	vanilla(): number {
		if (this.optionType === "C") {
			// European Call Option
			const firstTerm =
				this.spot *
				math.exp(0 - this.repoRate * this.termToMaturity) *
				standardNormalCdf(this.dParam("1"));
			const secondTerm =
				this.spot *
				math.exp(0 - this.riskFreeRate * this.termToMaturity) *
				standardNormalCdf(this.dParam("2"));
			return firstTerm - secondTerm;
		}
		// European Put Option
		const firstTerm =
			this.spot *
			math.exp(0 - this.riskFreeRate * this.termToMaturity) *
			standardNormalCdf(0 - this.dParam("2"));
		const secondTerm =
			this.spot *
			math.exp(0 - this.repoRate * this.termToMaturity) *
			standardNormalCdf(0 - this.dParam("1"));
		return firstTerm - secondTerm;
	}

	/**
	 * Vega: amount that an option contract's price changes in reaction to change
	 * in the implied volatility of the underlying asset.
	 * @return {number} vega of the given option(sigma)
	 */
	vega(): number {
		const constTerm = math.divide(
			this.spot *
				math.exp(0 - this.repoRate * this.termToMaturity) *
				(math.sqrt(this.termToMaturity) as number),
			math.sqrt(2 * math.pi) as number
		);
		const expTerm = math.exp(
			0 - math.divide(math.pow(this.dParam("1"), 2) as number, 2)
		);
		return math.multiply(constTerm, expTerm);
	}
}
