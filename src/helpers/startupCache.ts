import { getOrCreateTable } from './db';

export type StartupCacheKey = 'users' | 'departments' | 'entities';

// Lists every service reads on start and that change rarely. IndexedDB rather than localStorage:
// reads do not block the main thread while it is busy with the first render, the quota is not the
// few megabytes shared with the whole origin, and values are kept as structured clones instead of
// a JSON.stringify of the ~170 KB user list.
const table = getOrCreateTable('startup-cache');

export const readStartupCache = async <T>(key: StartupCacheKey): Promise<T> => {
	try {
		return await table.getItem<T>(key);
	} catch {
		return null;
	}
};

export const writeStartupCache = async <T>(key: StartupCacheKey, value: T): Promise<void> => {
	try {
		await table.setItem(key, value);
	} catch {}
};
