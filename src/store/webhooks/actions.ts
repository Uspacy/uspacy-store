import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IWebhookRequest } from '@uspacy/sdk/lib/services/WebhooksService/dto/create-webhook.dto';

export const fetchWebhooks = createAsyncThunk(
	'webhooks/fetchWebhooks',
	async ({ page, list, isIncoming }: { page: number; list: number; isIncoming?: boolean }, thunkAPI) => {
		try {
			const res = await uspacySdk.webhooksService.getWebhooks(page, list, isIncoming);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const createWebhook = createAsyncThunk(
	'webhooks/createWebhook',
	async ({ data, isIncoming }: { data: IWebhookRequest; isIncoming?: boolean }, thunkAPI) => {
		try {
			const res = await uspacySdk.webhooksService.createWebhook(data, isIncoming);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteWebhook = createAsyncThunk(
	'webhooks/deletehWebhook',
	async ({ id, isIncoming }: { id: number; isIncoming?: boolean }, thunkAPI) => {
		try {
			await uspacySdk.webhooksService.deleteWebhook(id, isIncoming);

			return id;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const getWebhookById = createAsyncThunk(
	'webhooks/getWebhookById',
	async ({ id, isIncoming }: { id: number; isIncoming?: boolean }, thunkAPI) => {
		try {
			const res = await uspacySdk.webhooksService.getWebhookById(id, isIncoming);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const toggleWebhook = createAsyncThunk(
	'webhooks/toggleWebhook',
	async ({ id, isIncoming }: { id: number; isIncoming?: boolean }, thunkAPI) => {
		try {
			await uspacySdk.webhooksService.toggleWebhook(id, isIncoming);
			return id;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const repeatWebhook = createAsyncThunk(
	'webhooks/repeatWebhook',
	async ({ id, isIncoming }: { id: number; isIncoming?: boolean }, thunkAPI) => {
		try {
			await uspacySdk.webhooksService.repeatWebhook(id, isIncoming);
			return id;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteSelectedWebhooks = createAsyncThunk(
	'webhooks/deleteSelectedWebhooks',
	async ({ ids, isIncoming }: { ids: number[]; isIncoming?: boolean }, thunkAPI) => {
		try {
			await uspacySdk.webhooksService.deleteSelectedWebhooks(ids, isIncoming);
			return ids;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);
