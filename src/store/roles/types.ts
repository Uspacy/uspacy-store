import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IRole } from '@uspacy/sdk/lib/models/roles';
import { IUser } from '@uspacy/sdk/lib/models/user';

export interface IState {
	roles: IRole[];
	loadingRoles: boolean;
	errorLoadingRoles: IErrorsAxiosResponse;
	activeRole?: string;
	roleData: {
		name: string;
		userList: IUser[];
	};
}
