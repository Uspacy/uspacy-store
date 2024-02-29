/* eslint-disable @typescript-eslint/no-explicit-any */
export const makeURIParams = (data: any) => {
	let serializedData = '';

	const serializeObject = (obj: any, prefix = '') => {
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				const value = obj[key];
				if (value !== undefined) {
					const newKey = prefix ? `${prefix}[${key}]` : key;

					if (typeof value === 'object') {
						serializeObject(value, newKey);
					} else {
						serializedData += `${newKey}=${encodeURIComponent(value)}&`;
					}
				}
			}
		}
	};

	serializeObject(data);
	return serializedData.slice(0, -1);
};
