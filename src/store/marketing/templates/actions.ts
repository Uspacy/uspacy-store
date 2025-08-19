import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IEmailTemplate } from '@uspacy/sdk/lib/models/email-template';
import { IMarketingFilter } from '@uspacy/sdk/lib/models/marketing-filter';

import { IMassActionsMarketingPayload } from '../types';

export const getEmailTemplates = createAsyncThunk(
	'marketing/templates/getEmailTemplates',
	async ({ params, signal }: { params: Partial<IMarketingFilter>; signal?: AbortSignal }, thunkAPI) => {
		try {
			const res = await uspacySdk.marketingService.getEmailTemplates(params, signal);
			return res.data;
		} catch (e) {
			if (signal.aborted) return { aborted: true };
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const getEmailTemplate = createAsyncThunk('marketing/templates/getEmailTemplate', async ({ id }: { id: number }, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.getEmailTemplate(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createEmailTemplate = createAsyncThunk('marketing/templates/createEmailTemplate', async (data: Partial<IEmailTemplate>, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.createEmailTemplate(data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const updateEmailTemplate = createAsyncThunk(
	'marketing/templates/updateEmailTemplate',
	async ({ id, data }: { id: number; data: Partial<IEmailTemplate> }, thunkAPI) => {
		try {
			const res = await uspacySdk.marketingService.updateEmailTemplate(id, data);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const deleteEmailTemplate = createAsyncThunk('marketing/templates/deleteEmailTemplate', async ({ id }: { id: number }, thunkAPI) => {
	try {
		return await uspacySdk.marketingService.deleteEmailTemplate(id);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const massEditingEmailTemplates = createAsyncThunk(
	'marketing/templates/massEditingEmailTemplates',
	async ({ id, payload, all, params }: IMassActionsMarketingPayload, thunkAPI) => {
		try {
			return await uspacySdk.marketingService.massEditingEmailTemplates(id, payload, all, params);
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const massDeletionEmailTemplates = createAsyncThunk(
	'marketing/templates/massDeletionEmailTemplates',
	async ({ id, all, params }: IMassActionsMarketingPayload, thunkAPI) => {
		try {
			return await uspacySdk.marketingService.massDeletionEmailTemplates(id, all, params);
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);
