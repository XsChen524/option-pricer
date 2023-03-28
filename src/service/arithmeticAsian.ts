import cdf from "@stdlib/stats-base-dists-normal-cdf";
import { create, all } from "mathjs";
import { MCAsianParams } from ".";
import CFGeoAsian from "./closedformGeometricAsian";

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
function randomNormalDistribution(): number {
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
	return u * c;
}

export default class ArithmeticAsian implements MCAsianParams {
	spot: number; // S

	strike: number; // E

	timeToMaturity: number;

	riskFreeRate: number;

	volatility: number; // sigma

	observeTime: number; // N

	path: number; // M

	method: "MC" | "Geo";

	optionType: "C" | "P";

	constructor(props: MCAsianParams) {
		this.spot = props.spot;
		this.strike = props.strike;
		this.timeToMaturity = props.timeToMaturity;
		this.riskFreeRate = props.riskFreeRate;
		this.volatility = props.volatility;
		this.observeTime = props.observeTime;
		this.path = props.path;
		this.method = props.method;
		this.optionType = props.optionType;
	}

	geo(): number {
		return new CFGeoAsian({
			spot: this.spot,
			strike: this.strike,
			timeToMaturity: this.timeToMaturity,
			riskFreeRate: this.riskFreeRate,
			volatility: this.volatility,
			observeTime: this.observeTime,
			optionType: this.optionType,
		}).price();
	}

	price(): number[] {
		const dt = this.timeToMaturity / this.observeTime;
		const drift = math.exp(
			(this.riskFreeRate - 0.5 * this.volatility * this.volatility) * dt
		);
		const arithPayoff = [];
		const geoPayoff = [];
		for (let i = 0; i < this.path; i += 1) {
			const sPath = [];
			let growthFactor =
				drift *
				math.exp(
					this.volatility *
						<number>math.sqrt(dt) *
						randomNormalDistribution()
				);
			sPath.push(growthFactor * this.spot);
			for (let j = 1; j < this.observeTime; j += 1) {
				growthFactor =
					drift *
					math.exp(
						this.volatility *
							<number>math.sqrt(dt) *
							randomNormalDistribution()
					);
				sPath.push(sPath[j - 1] * growthFactor);
			}
			if (this.optionType === "C") {
				// Arithmetic mean
				const arithMean = math.mean(sPath);
				arithPayoff.push(
					math.exp(-this.riskFreeRate * this.timeToMaturity) *
						math.max(arithMean - this.strike, 0)
				);
				// Geometric mean
				sPath.forEach((v, id, a) => {
					a[id] = math.log(v);
				});
				const geoMean = math.exp(
					(1 / this.observeTime) * math.sum(sPath)
				);
				geoPayoff.push(
					math.exp(-this.riskFreeRate * this.timeToMaturity) *
						math.max(geoMean - this.strike, 0)
				);
			} else {
				// Arithmetic mean
				const arithMean = math.mean(sPath);
				arithPayoff.push(
					math.exp(-this.riskFreeRate * this.timeToMaturity) *
						math.max(this.strike - arithMean, 0)
				);
				// Geometric mean
				sPath.forEach((v, id, a) => {
					a[id] = math.log(v);
				});
				const geoMean = math.exp(
					(1 / this.observeTime) * math.sum(sPath)
				);
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
