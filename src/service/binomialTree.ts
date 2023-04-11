import cdf from "@stdlib/stats-base-dists-normal-cdf";
import { all, create } from "mathjs";
import { AmericanParams } from "service";

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
 * @class BinomialTree
 * @implements AmericanParams
 */
export default class BinomialTree implements AmericanParams {
	spot: number;

	strike: number;

	timeToMaturity: number;

	riskFreeRate: number;

	volatility: number;

	steps: number;

	optionType: "C" | "P";

	private timeStep: number;

	private upFactor: number;

	private downFactor: number;

	private probability: number;

	private discountFactor: number;

	private spotTree: number[][];

	private optionTree: number[][];

	constructor(args: AmericanParams) {
		this.spot = args.spot;
		this.strike = args.strike;
		this.timeToMaturity = args.timeToMaturity;
		this.riskFreeRate = args.riskFreeRate;
		this.volatility = args.volatility;
		this.steps = args.steps;
		this.optionType = args.optionType;
		this.timeStep = <number>math.divide(args.timeToMaturity, args.steps);
		this.upFactor = this.getFactor("up");
		this.downFactor = this.getFactor("down");
		this.probability = this.getProbability();
		this.discountFactor = math.exp(
			0 - math.multiply(this.riskFreeRate, this.timeStep)
		);
		this.spotTree = [];
		this.optionTree = [];
		this.constructSpots(this.spotTree);
	}

	private getFactor(factorType: "up" | "down"): number {
		return factorType === "up"
			? math.exp(
					math.multiply(
						this.volatility,
						<number>math.sqrt(this.timeStep)
					)
			  )
			: math.exp(
					0 -
						math.multiply(
							this.volatility,
							<number>math.sqrt(this.timeStep)
						)
			  );
	}

	private getProbability(): number {
		return <number>(
			math.divide(
				math.subtract(
					math.exp(math.multiply(this.riskFreeRate, this.timeStep)),
					this.downFactor
				),
				math.subtract(this.upFactor, this.downFactor)
			)
		);
	}

	private constructSpots(spotTree: number[][]): void {
		for (let m = 0; m <= this.steps; m += 1) {
			spotTree[m] = [];
			for (let n = 0; n <= m; n += 1) {
				spotTree[m].push(
					math.multiply(
						this.spot,
						math.multiply(
							<number>math.pow(this.upFactor, n),
							<number>math.pow(this.downFactor, m - n)
						)
					)
				);
			}
		}
	}

	debug(): void {
		console.log("timeStep:", this.timeStep);
		console.log("up:", this.upFactor);
		console.log("down:", this.downFactor);
		console.log("probability:", this.probability);
		console.log("DF:", this.discountFactor);
		console.log("spotTree:", this.spotTree);
	}
}
