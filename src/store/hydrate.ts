import { IEntityMainData } from '@uspacy/sdk/lib/models/crm-entities';
import { IDepartment } from '@uspacy/sdk/lib/models/department';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';
import { IUser } from '@uspacy/sdk/lib/models/user';

import { readStartupCache } from '../helpers/startupCache';
import { setEntities } from './crm/entities';
import { setDepartments } from './departments';
import { store } from './provider';
import { setUsers } from './users';

export interface IHydratedFromCache {
	users: boolean;
	departments: boolean;
	entities: boolean;
}

// Puts the previous session's lists into the store, so a service can render its menu and user
// names before the requests come back. Reports which lists have something to show afterwards,
// which lets the caller hold back the refreshing request for them.
//
// A list is only filled while its slice is still untouched. Reading the cache can lose a race
// against the network — IndexedDB does not only fail, it also hangs, on an upgrade another tab
// is blocking — and a caller that stopped waiting has already asked for fresh data by then.
// Without the check the previous session's copy would land on top of that response.
export const hydrateStartupCache = async (): Promise<IHydratedFromCache> => {
	const [users, departments, entities] = await Promise.all([
		readStartupCache<IUser[]>('users'),
		readStartupCache<IDepartment[]>('departments'),
		readStartupCache<IResponseWithMeta<IEntityMainData>>('entities'),
	]);

	const state = store.getState();
	const hasUsers = !!state.users.data?.length;
	const hasDepartments = !!state.departments.departments?.length;
	const hasEntities = !!state.crm.entities.items?.data?.length;

	if (users?.length && !hasUsers) store.dispatch(setUsers(users));
	if (departments?.length && !hasDepartments) store.dispatch(setDepartments(departments));
	if (entities?.data?.length && !hasEntities) store.dispatch(setEntities(entities));

	return {
		users: hasUsers || !!users?.length,
		departments: hasDepartments || !!departments?.length,
		entities: hasEntities || !!entities?.data?.length,
	};
};
