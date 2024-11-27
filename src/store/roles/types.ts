import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IPermissions, IRole } from '@uspacy/sdk/lib/models/roles';
import { IUser } from '@uspacy/sdk/lib/models/user';
import { IUpdateRolePermissionsFunnels } from '@uspacy/sdk/lib/services/RolesService/create-update-role-dto';

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
	permissionsFunnels: IUpdateRolePermissionsFunnels;
}

export interface IDepartment {
	id: string;
	name: string;
	dateUpdate: number;
}
