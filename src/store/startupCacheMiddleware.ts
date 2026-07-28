import { Middleware } from '@reduxjs/toolkit';

import { StartupCacheKey, writeStartupCache } from '../helpers/startupCache';
import type { RootState } from '.';
import { setEntities } from './crm/entities';
import { setDepartments } from './departments';
import { setUsers, updateUserPresence } from './users';
import { getUsersOnlineStatuses } from './users/actions';

interface IWatched {
	key: StartupCacheKey;
	select: (state: RootState) => unknown;
}

const watched: IWatched[] = [
	{ key: 'users', select: (state) => state.users.data },
	{ key: 'departments', select: (state) => state.departments.departments },
	{ key: 'entities', select: (state) => state.crm.entities.items },
];

// Presence and online statuses rewrite the whole user list on every socket event, and the setters
// only ever carry what was just read from the cache
const ignoredActions: string[] = [
	updateUserPresence.type,
	getUsersOnlineStatuses.fulfilled.type,
	setUsers.type,
	setDepartments.type,
	setEntities.type,
];

const isWorthCaching = (value: unknown) => !!value && (!Array.isArray(value) || value.length > 0);

// Keeps the startup cache in step with the store: whatever changes these lists — a full fetch or a
// single user being renamed — the cached copy the next start reads from is updated.
export const startupCacheMiddleware: Middleware<unknown, RootState> = (store) => (next) => (action) => {
	if (ignoredActions.includes(action?.type)) return next(action);

	const before = watched.map(({ select }) => select(store.getState()));
	const result = next(action);

	watched.forEach(({ key, select }, index) => {
		const value = select(store.getState());
		if (value === before[index] || !isWorthCaching(value)) return;
		writeStartupCache(key, value);
	});

	return result;
};
