import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

// TODO: import from @uspacy/sdk once published with oauthClients
// NOTE: client fields are SNAKE_CASE (raw shape from auth-service via users-backend).
export interface IOAuthClient {
	client_id: string;
	name: string;
	grant_types: string[];
	redirect_uris: string[] | null;
	confidential: boolean;
	user_id: number | null;
	domain: string | null;
	permissions: string[] | null;
	revoked: boolean;
	created_at: string | number;
	updated_at: string | number;
}

export interface IOAuthClientWithSecret extends IOAuthClient {
	secret: string;
}

export interface IOAuthPermissionGroup {
	key: string;
	title: string;
	entity: string;
	section: string;
	actions: string[];
	permissionKeys: {
		create: string;
		view: string;
		edit: string;
		delete: string;
	};
}

export interface IOAuthClientsResponse {
	data: IOAuthClient[];
	meta?: {
		current_page?: number;
		last_page?: number;
		per_page?: number;
		total?: number;
		from?: number;
		to?: number;
	};
}

export interface IOAuthClientRequest {
	name: string;
	permissions: string[];
}

export interface IState {
	clients: IOAuthClient[];
	createdClient: IOAuthClientWithSecret | null;
	availablePermissions: IOAuthPermissionGroup[];
	loadingClients: boolean;
	loadingPermissions: boolean;
	creating: boolean;
	updating: boolean;
	errorLoadingClients: IErrorsAxiosResponse;
}
