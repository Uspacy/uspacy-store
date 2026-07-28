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
// names before the requests come back. Reports what was actually filled, which lets the caller
// hold back the refreshing request for the lists that already have something to show.
export const hydrateStartupCache = async (): Promise<IHydratedFromCache> => {
	const [users, departments, entities] = await Promise.all([
		readStartupCache<IUser[]>('users'),
		readStartupCache<IDepartment[]>('departments'),
		readStartupCache<IResponseWithMeta<IEntityMainData>>('entities'),
	]);

	if (users?.length) store.dispatch(setUsers(users));
	if (departments?.length) store.dispatch(setDepartments(departments));
	if (entities?.data?.length) store.dispatch(setEntities(entities));

	return {
		users: !!users?.length,
		departments: !!departments?.length,
		entities: !!entities?.data?.length,
	};
};
