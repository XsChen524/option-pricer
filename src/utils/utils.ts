const isValidKey = (
	key: string | number | symbol,
	object: object
): key is keyof typeof object => {
	return key in object;
};

export const parseRawParams = <RawT extends object, T extends object>(
	rawObj: RawT
): T => {
	const obj = {} as any;

	Object.keys(rawObj).forEach((key) => {
		if (isValidKey(key, rawObj)) {
			obj[key] = !Number.isNaN(Number(rawObj[key]))
				? Number(rawObj[key])
				: rawObj[key];
		}
	});

	return obj;
};
