import localforage from 'localforage';

export const getOrCreateTable = (storeName: string) => {
	return localforage.createInstance({
		name: 'Uspacy',
		storeName,
	});
};
