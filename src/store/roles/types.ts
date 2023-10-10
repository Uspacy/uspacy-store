import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IPermissions, IRole } from '@uspacy/sdk/lib/models/roles';
import { IUser } from '@uspacy/sdk/lib/models/user';

export interface IState {
	roles: IRole[];
	permissions: IPermissions;
	createPermissions: IPermissions;
	loadingRoles: boolean;
	errorLoadingRoles: IErrorsAxiosResponse;
	filterCounter?: number;
	selectedRole: string;
	activeRole?: string;
	roleData: {
		name: string;
		userList: IUser[];
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	permissionsControllerView: any[];
	modalActiveType: string;
	createPermissionsModal: IPermissions;
}

export interface IDepartment {
	id: string;
	name: string;
	dateUpdate: number;
}
