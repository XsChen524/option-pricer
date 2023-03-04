import { all, create } from "mathjs";
import { ImpVolParams } from ".";
import ExtendedBS from "./extendedBs";

/**
 * @constant TOLERANCE
 * @type {number}
 * @description Newton Method tolerance
 */
const TOLERANCE = 1e-8;

/**
 * @constant MAX_ITERATION
 * @type {number}
 * @description Maximun iteration time to find Implied Volatility
 */
const MAX_ITERATION = 100;

/**
 * Instance of math.js
 */
const math = create(all, {
	number: "number",
});

/**
 * Calculate sigmaHat with given parameters
 * @param {ImpVolParams} args
 * @returns sigmaHat
 */
const getSigmaHat = (args: ImpVolParams): number => {
	// ln(S/K) + (r-q)*T
	const numerator =
		math.log<number>(math.divide(args.spot, args.strike)) +
		math.multiply(args.riskFreeRate - args.repoRate, args.termToMaturity);
	return math.sqrt(
		2 * math.abs(math.divide(numerator, args.termToMaturity))
	) as number;
};

/**
 * Check if the option value is in proper range, such that there is unique root IV to V(sigma) - V = 0
 * Adjusted to repo rate q.
 * @param {ImpVolParams} args
 * @returns True if the unique root exist.
 */
const hasUniqueIV = (args: ImpVolParams): boolean => {
	let upperBoundary;
	let lowerBoundary;
	const assetPv = math.multiply(
		args.spot,
		math.exp(0 - args.repoRate * args.termToMaturity)
	);
	const strikePv = math.multiply(
		args.spot,
		math.exp(0 - args.riskFreeRate * args.termToMaturity)
	);

	if (args.optionType === "C") {
		// European Call
		upperBoundary = assetPv;
		lowerBoundary = assetPv - strikePv > 0 ? assetPv - strikePv : 0;
	} else {
		// European Put
		upperBoundary = strikePv;
		lowerBoundary = strikePv - assetPv > 0 ? strikePv - assetPv : 0;
	}

	return args.value >= lowerBoundary && args.value <= upperBoundary;
};

/**
 * Newton Method to calculate Implied Volatility with given parameters
 * @param {ImpVolParams} args
 * @return Implied Volatility or null if has no unique root
 */
const newtonMethod = (args: ImpVolParams): number | undefined => {
	if (!hasUniqueIV(args)) {
		return undefined; // Incase no unique value
	}
	const sigmaHat = getSigmaHat(args);
	let sigma = sigmaHat;
	let n = 1; // Iteration variable
	let sigmaDiff = 1;

	while (sigmaDiff >= TOLERANCE && n < MAX_ITERATION) {
		const extendBS = new ExtendedBS({ ...args, volatility: sigma });
		const value = extendBS.vanilla();
		const vega = extendBS.vega();
		const increasement = math.divide(value - args.value, vega);
		sigma -= increasement;
		n += 1;
		sigmaDiff = math.abs(increasement);
	}

	return sigma;
};

export default newtonMethod;
