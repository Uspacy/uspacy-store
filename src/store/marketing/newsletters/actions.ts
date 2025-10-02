import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IEmailNewsletter } from '@uspacy/sdk/lib/models/email-newsletter';
import { IMarketingFilter } from '@uspacy/sdk/lib/models/marketing-filter';

import { IMassActionsMarketingPayload } from '../types';

export const getEmailNewsletters = createAsyncThunk(
	'marketing/newsletters/getEmailNewsletters',
	async ({ params, signal }: { params: Partial<IMarketingFilter>; signal?: AbortSignal }, thunkAPI) => {
		try {
			const res = await uspacySdk.marketingService.getEmailNewsletters(params, signal);
			return res.data;
		} catch (e) {
			if (signal.aborted) return { aborted: true };
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const getEmailNewsletter = createAsyncThunk('marketing/newsletters/getEmailNewsletter', async (id: number, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.getEmailNewsletter(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const getEmailNewsletterStatistics = createAsyncThunk('marketing/newsletters/getEmailNewsletterStatistics', async (id: number, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.getEmailNewsletterStatistics(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createEmailNewsletter = createAsyncThunk(
	'marketing/newsletters/createEmailNewsletter',
	async (data: Partial<IEmailNewsletter>, thunkAPI) => {
		try {
			const res = await uspacySdk.marketingService.createEmailNewsletter(data);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const updateEmailNewsletter = createAsyncThunk(
	'marketing/newsletters/updateEmailNewsletter',
	async ({ id, data }: { id: number; data: Partial<IEmailNewsletter> }, thunkAPI) => {
		try {
			const res = await uspacySdk.marketingService.updateEmailNewsletter(id, data);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const deleteEmailNewsletter = createAsyncThunk('marketing/newsletters/deleteEmailNewsletter', async (id: number, thunkAPI) => {
	try {
		return await uspacySdk.marketingService.deleteEmailNewsletter(id);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const sendEmailNewsletter = createAsyncThunk('marketing/newsletters/sendEmailNewsletter', async (id: number, thunkAPI) => {
	try {
		return await uspacySdk.marketingService.sendEmailNewsletter(id);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const startEmailNewsletterMailings = createAsyncThunk('marketing/newsletters/startEmailNewsletterMailings', async (_, thunkAPI) => {
	try {
		return await uspacySdk.marketingService.startEmailNewsletterMailings();
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const massSendingEmailNewsletters = createAsyncThunk(
	'marketing/newsletters/massSendingEmailNewsletters',
	async ({ id, all, params }: IMassActionsMarketingPayload, thunkAPI) => {
		try {
			return await uspacySdk.marketingService.massSendingEmailNewsletters(id, all, params);
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const massDeletionEmailNewsletters = createAsyncThunk(
	'marketing/newsletters/massDeletionEmailNewsletters',
	async ({ id, all, params }: IMassActionsMarketingPayload, thunkAPI) => {
		try {
			return await uspacySdk.marketingService.massDeletionEmailNewsletters(id, all, params);
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);
