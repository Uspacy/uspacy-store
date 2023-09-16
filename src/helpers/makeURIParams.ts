// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const makeURIParams = (query: { [key: string]: any } = {}): string => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const data: any[] = Object.entries(query);
	return data
		.reduce((acc, el) => {
			if (typeof el[1] === 'boolean' || el[1]) {
				if (Array.isArray(el[1])) {
					el[1].forEach((value) => {
						acc.push([`${el[0]}[]`, value].join('='));
					});
				} else {
					acc.push(el.join('='));
				}
			}
			return acc;
		}, [])
		.join('&');
};
