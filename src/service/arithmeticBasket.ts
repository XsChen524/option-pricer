import cdf from "@stdlib/stats-base-dists-normal-cdf";
import { create, all } from "mathjs";
import { MCBasketParams } from ".";
import BasketGeometric from "./basketGeo";

/**
 * Instance of mathjs
 */
// eslint-disable-next-line no-unused-vars
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
 * Generate standard normal random variables using Box-Muller method
 * @return {number} a random number
 */
// eslint-disable-next-line no-unused-vars
function randomNormalDistribution(): number[] {
	let u = 0.0;
	let v = 0.0;
	let w = 0.0;
	let c = 0.0;
	do {
		u = Math.random() * 2 - 1.0;
		v = Math.random() * 2 - 1.0;
		w = u * u + v * v;
	} while (w === 0.0 || w >= 1.0);
	c = Math.sqrt((-2 * Math.log(w)) / w);
	return [u * c, v * c];
}

export default class ArithmeticBasket implements MCBasketParams {
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

	constructor(props: MCBasketParams) {
		this.spot1 = props.spot1;
		this.spot2 = props.spot2;
		this.volatility1 = props.volatility1;
		this.volatility2 = props.volatility2;
		this.riskFreeRate = props.riskFreeRate;
		this.timeToMaturity = props.timeToMaturity;
		this.strike = props.strike;
		this.correlation = props.correlation;
		this.optionType = props.optionType;
		this.path = props.path;
		this.method = props.method;
	}

	geo(): number {
		return new BasketGeometric({
			spot1: this.spot1,
			spot2: this.spot2,
			volatility1: this.volatility1,
			volatility2: this.volatility2,
			riskFreeRate: this.riskFreeRate,
			timeToMaturity: this.timeToMaturity,
			strike: this.strike,
			correlation: this.correlation,
			optionType: this.optionType,
		}).price();
	}

	price(): number[] {
		const dt = this.timeToMaturity;
		const drift1 = math.exp(
			(this.riskFreeRate - 0.5 * this.volatility1 * this.volatility1) * dt
		);
		const drift2 = math.exp(
			(this.riskFreeRate - 0.5 * this.volatility2 * this.volatility2) * dt
		);
		const arithPayoff = [];
		const geoPayoff = [];
		for (let i = 0; i < this.path; i += 1) {
			const rdn = randomNormalDistribution();
			const z1 = rdn[0];
			const z2 =
				z1 * this.correlation +
				<number>math.sqrt(1 - this.correlation * this.correlation) *
					rdn[1];
			const growthFactor1 =
				this.spot1 *
				drift1 *
				math.exp(this.volatility1 * <number>math.sqrt(dt) * z1);
			const growthFactor2 =
				this.spot2 *
				drift2 *
				math.exp(this.volatility2 * <number>math.sqrt(dt) * z2);
			const arithMean = (1 / 2) * (growthFactor1 + growthFactor2);
			const geoMean = math.exp(
				(1 / 2) * math.log(growthFactor1 * growthFactor2)
			);
			if (this.optionType === "C") {
				// Arithmetic payoff
				arithPayoff.push(
					math.exp(-this.riskFreeRate * this.timeToMaturity) *
						math.max(arithMean - this.strike, 0)
				);
				// Geometric payoff
				geoPayoff.push(
					math.exp(-this.riskFreeRate * this.timeToMaturity) *
						math.max(geoMean - this.strike, 0)
				);
			} else {
				// Arithmetic payoff
				arithPayoff.push(
					math.exp(-this.riskFreeRate * this.timeToMaturity) *
						math.max(this.strike - arithMean, 0)
				);
				// Geometric payoff
				geoPayoff.push(
					math.exp(-this.riskFreeRate * this.timeToMaturity) *
						math.max(this.strike - geoMean, 0)
				);
			}
		}
		// Standard Monte Carlo
		const Pmean = math.mean(arithPayoff);
		const Pstd = math.std(arithPayoff, "unbiased");
		const confmc = [
			Pmean - (1.96 * Pstd) / <number>math.sqrt(this.path),
			Pmean + (1.96 * Pstd) / <number>math.sqrt(this.path),
		];
		if (this.method === "MC") return confmc;
		// Control Variate
		const covXY =
			math.mean(math.dotMultiply(arithPayoff, geoPayoff)) -
			math.mean(arithPayoff) * math.mean(geoPayoff);
		const theta = covXY / math.variance(<number[]>geoPayoff, "unbiased");
		// control variate version
		const geo = this.geo();
		const gt = geoPayoff.slice();
		gt.forEach((v, id, a) => {
			a[id] = theta * (geo - v);
		});
		const Z = arithPayoff.map((v, i) => {
			return v + gt[i];
		});
		const Zmean = math.mean(Z);
		const Zstd = math.std(Z, "unbiased");
		const confcv = [
			Zmean - (1.96 * Zstd) / <number>math.sqrt(this.path),
			Zmean + (1.96 * Zstd) / <number>math.sqrt(this.path),
		];
		return confcv;
	}
}
