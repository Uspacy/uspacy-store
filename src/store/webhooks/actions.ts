import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IWebhookRequest } from '@uspacy/sdk/lib/services/WebhooksService/dto/create-webhook.dto';

export const fetchWebhooks = createAsyncThunk('webhooks/fetchWebhooks', async (data: { page: number; list: number }, thunkAPI) => {
	try {
		const res = await uspacySdk.webhooksService.getWebhooks(data.page, data.list);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createWebhook = createAsyncThunk('webhooks/createWebhook', async (data: IWebhookRequest, thunkAPI) => {
	try {
		const res = await uspacySdk.webhooksService.createWebhook(data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteWebhook = createAsyncThunk('webhooks/deletehWebhook', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.webhooksService.deleteWebhook(id);

		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const getWebhookById = createAsyncThunk('webhooks/getWebhookById', async (id: number, thunkAPI) => {
	try {
		const res = await uspacySdk.webhooksService.getWebhookById(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const toggleWebhook = createAsyncThunk('webhooks/toggleWebhook', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.webhooksService.toggleWebhook(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const repeatWebhook = createAsyncThunk('webhooks/repeatWebhook', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.webhooksService.repeatWebhook(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteSelectedWebhooks = createAsyncThunk('webhooks/deleteSelectedWebhooks', async (ids: number[], thunkAPI) => {
	try {
		await uspacySdk.webhooksService.deleteSelectedWebhooks(ids);
		return ids;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
