import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

import { IOAuthClientRequest } from './types';

// TODO: remove cast once @uspacy/sdk is published with oauthClientsService
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sdk = uspacySdk as any;

export const fetchOAuthClients = createAsyncThunk('oauthClients/fetchOAuthClients', async (_, thunkAPI) => {
	try {
		const res = await sdk.oauthClientsService.getOAuthClients();
		return res.data.data.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createOAuthClient = createAsyncThunk('oauthClients/createOAuthClient', async (data: IOAuthClientRequest, thunkAPI) => {
	try {
		const res = await sdk.oauthClientsService.createOAuthClient(data);
		return res.data.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateOAuthClient = createAsyncThunk(
	'oauthClients/updateOAuthClient',
	async ({ id, data }: { id: string; data: Partial<IOAuthClientRequest> }, thunkAPI) => {
		try {
			const res = await sdk.oauthClientsService.updateOAuthClient(id, data);
			return res.data.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteOAuthClient = createAsyncThunk('oauthClients/deleteOAuthClient', async (id: string, thunkAPI) => {
	try {
		await sdk.oauthClientsService.deleteOAuthClient(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const fetchAvailablePermissions = createAsyncThunk('oauthClients/fetchAvailablePermissions', async (_, thunkAPI) => {
	try {
		const res = await sdk.oauthClientsService.getAvailablePermissions();
		return res.data.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
