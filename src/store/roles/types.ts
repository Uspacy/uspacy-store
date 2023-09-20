import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IRole } from '@uspacy/sdk/lib/models/roles';

export interface IState {
	roles: IRole[];
	loadingRoles: boolean;
	errorLoadingRoles: IErrorsAxiosResponse;
}
