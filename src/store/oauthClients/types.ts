import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

// TODO: import from @uspacy/sdk once published with oauthClients
export interface IOAuthClient {
	clientId: string;
	name: string;
	grantTypes: string[];
	redirectUris: string[] | null;
	confidential: boolean;
	userId: number | null;
	domain: string | null;
	permissions: string[] | null;
	revoked: boolean;
	createdAt: string | number;
	updatedAt: string | number;
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
		currentPage?: number;
		lastPage?: number;
		perPage?: number;
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
	errorLoadingClients: IErrorsAxiosResponse;
}
