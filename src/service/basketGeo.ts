import cdf from "@stdlib/stats-base-dists-normal-cdf";
import { create, all } from "mathjs";
import { BGParams } from ".";

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

export default class BasketGeometric implements BGParams {
	spot1: number;

	spot2: number;

	volatility1: number;

	volatility2: number;

	riskFreeRate: number;

	timeToMaturity: number;

	strike: number;

	correlation: number;

	optionType: "C" | "P";

	constructor(props: BGParams) {
		this.spot1 = props.spot1;
		this.spot2 = props.spot2;
		this.volatility1 = props.volatility1;
		this.volatility2 = props.volatility2;
		this.riskFreeRate = props.riskFreeRate;
		this.timeToMaturity = props.timeToMaturity;
		this.strike = props.strike;
		this.correlation = props.correlation;
		this.optionType = props.optionType;
	}

	/**
	 * Get the price of Geometric Basket Option.
	 * @return {number} return Basket Option price
	 */
	price(): number {
		const BG = <number>math.sqrt(this.spot1 * this.spot2);
		const sigma =
			<number>(
				math.sqrt(
					this.volatility1 *
						this.volatility2 *
						(this.correlation * 2 + 2)
				)
			) / 2;
		const mu =
			this.riskFreeRate -
			(this.volatility1 * this.volatility1 +
				this.volatility2 * this.volatility2) /
				4 +
			(sigma * sigma) / 2;
		const d1 =
			(math.log(BG / this.strike) +
				(mu + (sigma * sigma) / 2) * this.timeToMaturity) /
			(sigma * <number>math.sqrt(this.timeToMaturity));
		const d2 = d1 - sigma * <number>math.sqrt(this.timeToMaturity);
		const form1 = math.exp(-this.riskFreeRate * this.timeToMaturity);
		const form2 = BG * math.exp(mu * this.timeToMaturity);
		if (this.optionType === "C") {
			return (
				form1 *
				(form2 * standardNormalCdf(d1) -
					this.strike * standardNormalCdf(d2))
			);
		}
		return (
			form1 *
			(this.strike * standardNormalCdf(-d2) -
				form2 * standardNormalCdf(-d1))
		);
	}
}
