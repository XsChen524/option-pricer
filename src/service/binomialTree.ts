import { all, create } from "mathjs";
import { AmericanParams } from "service";

/**
 * Instance of mathjs
 */
const math = create(all, {
	number: "number",
});

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
		this.constructOptionTree(this.optionTree);
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

	private async constructSpots(spotTree: number[][]): Promise<void> {
		return new Promise<void>((resolve) => {
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
			resolve();
		});
	}

	private static getIntrinsicValue(
		optionType: "C" | "P",
		spot: number,
		strike: number
	): number {
		// American Call
		if (optionType === "C") {
			return math.subtract(spot, strike) > 0
				? math.subtract(spot, strike)
				: 0;
		}
		// American Put
		return math.subtract(strike, spot) > 0
			? math.subtract(strike, spot)
			: 0;
	}

	private async constructOptionTree(optionTree: number[][]): Promise<void> {
		return new Promise<void>((resolve) => {
			for (let m = this.steps; m >= 0; m -= 1) {
				optionTree[m] = [];
				for (let n = 0; n <= m; n += 1) {
					/**
					 * If m is the last row, no need to consider early exercise
					 * option value equals to intrinsic value
					 *
					 * Orderwise, consider to early exercise if option value less than intrinsic value
					 * if less than intrinsic value, exercise immediately and get intrinsic value
					 */
					if (m === this.steps) {
						optionTree[m].push(
							BinomialTree.getIntrinsicValue(
								this.optionType,
								this.spotTree[m][n],
								this.strike
							)
						);
					} else {
						// Consider early exercise
						const tmpValue = math.multiply(
							this.discountFactor,
							math.add<number>(
								math.multiply(
									this.probability,
									this.optionTree[m + 1][n + 1]
								),
								math.multiply(
									math.subtract(1, this.probability),
									this.optionTree[m + 1][n]
								)
							)
						);
						const tmpIntrinsic =
							this.optionType === "C"
								? math.subtract(
										this.spotTree[m][n],
										this.strike
								  )
								: math.subtract(
										this.strike,
										this.spotTree[m][n]
								  );
						optionTree[m].push(
							tmpIntrinsic > tmpValue ? tmpIntrinsic : tmpValue
						);
					}
				}
			}
			resolve();
		});
	}

	getPrice(): number {
		return this.optionTree[0][0];
	}

	debug(): void {
		console.log("timeStep:", this.timeStep);
		console.log("up:", this.upFactor);
		console.log("down:", this.downFactor);
		console.log("probability:", this.probability);
		console.log("DF:", this.discountFactor);
		console.log("spotTree:", this.spotTree);
		console.log("optionTree:", this.optionTree);
	}
}
