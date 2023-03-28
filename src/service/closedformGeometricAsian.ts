import cdf from "@stdlib/stats-base-dists-normal-cdf";
import { create, all } from "mathjs";
import { CFGeoParams } from ".";

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
 * @class CFGeoAsian
 * @implements CFGeoParams
 */
export default class CFGeoAsian implements CFGeoParams {
	spot: number;

	strike: number;

	volatility: number;

	timeToMaturity: number;

	riskFreeRate: number;

	optionType: "C" | "P";

	observeTime: number;

	constructor(props: CFGeoParams) {
		this.spot = props.spot;
		this.strike = props.strike;
		this.volatility = props.volatility;
		this.timeToMaturity = props.timeToMaturity;
		this.riskFreeRate = props.riskFreeRate;
		this.optionType = props.optionType;
		this.observeTime = props.observeTime;
	}

	estiSigma(): number {
		return (
			this.volatility *
			<number>(
				math.sqrt(
					((1 + this.observeTime) * (2 * this.observeTime + 1)) /
						(6 * this.observeTime * this.observeTime)
				)
			)
		);
	}

	estiMu(): number {
		return (
			((this.riskFreeRate - 0.5 * this.volatility * this.volatility) *
				(this.observeTime + 1)) /
				(2 * this.observeTime) +
			0.5 * this.estiSigma() * this.estiSigma()
		);
	}

	dParam(dType: "1" | "2"): number {
		const estiSigma = this.estiSigma();
		const estiMu = this.estiMu();
		const form1 =
			(math.log<number>(this.spot / this.strike) +
				(estiMu + 0.5 * estiSigma * estiSigma) * this.timeToMaturity) /
			(estiSigma * <number>math.sqrt(this.timeToMaturity));
		const form2 = estiSigma * <number>math.sqrt(this.timeToMaturity);
		return dType === "1" ? form1 : form1 - form2;
	}

	/**
	 * Get the value of Geometric Asian Option.
	 * @return {number} return Geometric Asian Option value
	 */
	price(): number {
		const LNprefix = <number>(
			math.exp(-this.riskFreeRate * this.timeToMaturity)
		);
		if (this.optionType === "C") {
			const firstTerm =
				this.spot *
					<number>math.exp(this.estiMu() * this.timeToMaturity) *
					standardNormalCdf(this.dParam("1")) -
				this.strike * standardNormalCdf(this.dParam("2"));
			// Call option
			return LNprefix * firstTerm;
		}
		const firstTerm =
			this.strike * standardNormalCdf(-this.dParam("2")) -
			this.spot *
				<number>math.exp(this.estiMu() * this.timeToMaturity) *
				standardNormalCdf(-this.dParam("1"));
		return LNprefix * firstTerm;
	}
}
