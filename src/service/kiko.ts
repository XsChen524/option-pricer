import { Gaussian } from "ts-gaussian";
import { KikoParams, KikoResult } from "service";
import { create, all, Matrix } from "mathjs";
import * as lobos from "lobos";

/**
 * Instance of mathjs
 */
const math = create(all, {
	number: "number",
});

/**
 * Instance of Gaussian Distribution
 */
const std = new Gaussian(0, 1);

/**
 * @constant NUM_OF_PATHS
 * @description number of paths in Monte Carlo
 */
const NUM_OF_PATHS = 100;

/**
 * Class for KIKO Put option
 * @class Kiko
 * @implements KikoParams
 */
export default class Kiko implements KikoParams {
	spot: number;

	strike: number;

	timeToMaturity: number;

	riskFreeRate: number;

	volatility: number;

	/**
	 * down-and-in at lowerBarrier
	 * up-and-out at upperBarrier with rebate
	 */
	lowerBarrier: number;

	upperBarrier: number;

	observeTime: number;

	rebate: number;

	private interval: number; // Delta t

	private samples: number[][];

	private samplesCumSum: number[][];

	private spots: Matrix;

	private values: number[];

	constructor(args: KikoParams) {
		this.spot = args.spot;
		this.strike = args.strike;
		this.timeToMaturity = args.timeToMaturity;
		this.riskFreeRate = args.riskFreeRate;
		this.volatility = args.volatility;
		this.lowerBarrier = args.lowerBarrier;
		this.upperBarrier = args.upperBarrier;
		this.observeTime = args.observeTime;
		this.rebate = args.rebate;
		this.interval = math.divide(this.timeToMaturity, this.observeTime);
		this.samples = [];
		this.samplesCumSum = [];
		this.values = [];
		this.setSamples(this.samples);
		this.setCumSum(this.samplesCumSum);
		this.spots = this.setSpots();
		this.setValues(this.values);
	}

	/**
	 * Set the samples 2D array with std normal samples
	 * @param samples [M][N] array
	 * @returns Promise<void>
	 */
	private async setSamples(samples: number[][]): Promise<void> {
		return new Promise<void>((resolve) => {
			const sequence = new lobos.Sobol(this.observeTime, {
				params: "new-joe-kuo-6.21201",
				resolution: 32,
			});
			/**
			 * The uniformSamples slice the first row, take care
			 */
			const uniformSamples: number[][] = sequence
				.take(NUM_OF_PATHS + 1)
				.slice(1);
			for (let m = 0; m < NUM_OF_PATHS; m += 1) {
				samples[m] = [];
				for (let n = 0; n < this.observeTime; n += 1) {
					samples[m].push(
						math.add<number>(
							<number>(
								math.multiply(
									this.interval,
									math.subtract(
										this.riskFreeRate,
										math.multiply(
											0.5,
											math.pow(this.volatility, 2)
										)
									)
								)
							),
							<number>(
								math.multiply(
									math.multiply(
										this.volatility,
										std.ppf(uniformSamples[m][n])
									),
									math.sqrt(this.interval)
								)
							)
						)
					);
				}
			}
			resolve();
		});
	}

	private async setCumSum(samplesCumSum: number[][]): Promise<void> {
		return new Promise<void>((resolve) => {
			for (let n = 0; n < this.observeTime; n += 1) {
				samplesCumSum[n] = [];
				let colSum = 0;
				for (let m = 0; m < NUM_OF_PATHS; m += 1) {
					colSum += this.samples[m][n];
					samplesCumSum[n].push(colSum);
				}
			}
			this.samplesCumSum = math.transpose(samplesCumSum);
			resolve();
		});
	}

	private setSpots(): Matrix {
		const result = <Matrix>math.multiply(
			this.spot,
			this.samplesCumSum.map((row: number[]) => {
				return row.map((x: number) => math.exp(x));
			})
		);
		return result;
	}

	private setValues(values: number[]): Promise<void> {
		const getRow = (m: Matrix, r: number) =>
			math.flatten(math.row(m, r).valueOf());

		// eslint-disable-next-line no-unused-vars
		const getCol = (m: Matrix, c: number) =>
			math.flatten(math.column(m, c).valueOf());

		return new Promise<void>((resolve) => {
			const { spots } = this;
			const size = <number[]>math.size(spots);
			for (let m = 0; m < size[0]; m += 1) {
				const pathMax = math.max(...getRow(spots, m));
				const pathMin = math.min(...getRow(spots, m));
				if (pathMax >= this.upperBarrier) {
					// Up-and-out
					const outTime = getRow(spots, m).indexOf(pathMax);
					const payoff = math.multiply(
						this.rebate,
						math.exp(
							0 -
								math.multiply(
									math.multiply(outTime, this.riskFreeRate),
									this.interval
								)
						)
					);
					values.push(payoff);
				} else if (pathMin <= this.lowerBarrier) {
					// Down-and-in
					const finalValue = getRow(spots, m).at(-1) as number;
					const payoff = math.multiply(
						<number>(
							math.exp(
								0 -
									math.multiply(
										this.riskFreeRate,
										this.timeToMaturity
									)
							)
						),
						<number>math.max(this.strike - finalValue, 0)
					);
					values.push(payoff);
				} else {
					// No knock out or knock in
					values.push(0);
				}
			}
			resolve();
		});
	}

	public getResults(): KikoResult {
		const value = math.mean(...this.values);
		const stdDev = math.std(...this.values);
		const upper = math.add<number>(
			value,
			<number>(
				math.divide(
					math.multiply(1.96, stdDev),
					math.sqrt(NUM_OF_PATHS)
				)
			)
		);
		const lower = math.subtract<number>(
			value,
			<number>(
				math.divide(
					math.multiply(1.96, stdDev),
					math.sqrt(NUM_OF_PATHS)
				)
			)
		);
		return {
			value,
			std: stdDev,
			confInt: [lower, upper],
		};
	}

	public debug(): void {
		console.log("Samples:", this.samples);
		console.log("CumSum:", this.samplesCumSum);
		console.log("Spots:", this.spots);
		console.log("Values:", this.values);
		console.log(this.getResults());
	}
}
