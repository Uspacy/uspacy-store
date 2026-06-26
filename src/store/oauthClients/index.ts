import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

import { createOAuthClient, deleteOAuthClient, fetchAvailablePermissions, fetchOAuthClients } from './actions';
import { IOAuthClient, IOAuthClientWithSecret, IOAuthPermissionGroup, IState } from './types';

const initialState = {
	clients: [],
	createdClient: null,
	availablePermissions: [],
	loadingClients: false,
	loadingPermissions: false,
	creating: false,
	errorLoadingClients: null,
} as IState;

const oauthClientsReducer = createSlice({
	name: 'oauthClientsReducer',
	initialState,
	reducers: {
		clearCreatedClient: (state) => {
			state.createdClient = null;
		},
	},
	extraReducers: {
		[fetchOAuthClients.fulfilled.type]: (state, action: PayloadAction<IOAuthClient[]>) => {
			state.loadingClients = false;
			state.errorLoadingClients = null;
			state.clients = action.payload;
		},
		[fetchOAuthClients.pending.type]: (state) => {
			state.loadingClients = true;
			state.errorLoadingClients = null;
		},
		[fetchOAuthClients.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingClients = false;
			state.errorLoadingClients = action.payload;
		},
		[createOAuthClient.fulfilled.type]: (state, action: PayloadAction<IOAuthClientWithSecret>) => {
			state.creating = false;
			state.errorLoadingClients = null;
			state.createdClient = action.payload;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { secret, ...client } = action.payload;
			state.clients.unshift(client);
		},
		[createOAuthClient.pending.type]: (state) => {
			state.creating = true;
			state.errorLoadingClients = null;
		},
		[createOAuthClient.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.creating = false;
			state.errorLoadingClients = action.payload;
		},
		[deleteOAuthClient.fulfilled.type]: (state, action: PayloadAction<string>) => {
			state.loadingClients = false;
			state.errorLoadingClients = null;
			state.clients = state.clients.filter((c) => c.clientId !== action.payload);
		},
		[deleteOAuthClient.pending.type]: (state) => {
			state.loadingClients = true;
		},
		[deleteOAuthClient.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingClients = false;
			state.errorLoadingClients = action.payload;
		},
		[fetchAvailablePermissions.fulfilled.type]: (state, action: PayloadAction<IOAuthPermissionGroup[]>) => {
			state.loadingPermissions = false;
			state.availablePermissions = action.payload;
		},
		[fetchAvailablePermissions.pending.type]: (state) => {
			state.loadingPermissions = true;
		},
		[fetchAvailablePermissions.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingPermissions = false;
			state.errorLoadingClients = action.payload;
		},
	},
});

export const { clearCreatedClient } = oauthClientsReducer.actions;
export default oauthClientsReducer.reducer;
