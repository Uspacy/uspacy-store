import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IEmailTemplate } from '@uspacy/sdk/lib/models/email-template';
import { IEmailTemplateFilter } from '@uspacy/sdk/lib/models/email-template-filter';

export const getEmailTemplates = createAsyncThunk(
	'marketing/getEmailTemplates',
	async ({ params, signal }: { params: Partial<IEmailTemplateFilter>; signal?: AbortSignal }, thunkAPI) => {
		try {
			const res = await uspacySdk.marketingService.getEmailTemplates(params, signal);
			return res.data;
		} catch (e) {
			if (signal.aborted) return { aborted: true };
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const getEmailTemplate = createAsyncThunk('marketing/getEmailTemplate', async ({ id }: { id: number }, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.getEmailTemplate(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createEmailTemplate = createAsyncThunk('marketing/createEmailTemplate', async (data: Partial<IEmailTemplate>, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.createEmailTemplate(data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const updateEmailTemplate = createAsyncThunk(
	'marketing/updateEmailTemplate',
	async ({ id, data }: { id: number; data: Partial<IEmailTemplate> }, thunkAPI) => {
		try {
			const res = await uspacySdk.marketingService.updateEmailTemplate(id, data);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const deleteEmailTemplate = createAsyncThunk('marketing/deleteEmailTemplate', async ({ id }: { id: number }, thunkAPI) => {
	try {
		return await uspacySdk.marketingService.deleteEmailTemplate(id);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
