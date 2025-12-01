export const transformKeysToCaseByType = (object: object, type: 'snake' | 'camel') => {
	if (type === 'snake') {
		return Object.keys(object || {}).reduce((acc, key) => {
			const snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
			acc[snakeCaseKey] = object[key];
			return acc;
		}, {});
	}

	return Object.keys(object || {}).reduce((acc, key) => {
		const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
		acc[camelCaseKey] = object[key];
		return acc;
	}, {});
};
