import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IEmailTemplate } from '@uspacy/sdk/lib/models/email-template';
import { IEmailTemplateFilter } from '@uspacy/sdk/lib/models/email-template-filter';
import { ISender } from '@uspacy/sdk/lib/models/newsletters-sender';

import { IMassActionsEmailTemplatesPayload } from './types';

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

export const massEditingEmailTemplates = createAsyncThunk(
	'marketing/massEditingEmailTemplates',
	async ({ id, payload, all, params }: IMassActionsEmailTemplatesPayload, thunkAPI) => {
		try {
			return await uspacySdk.marketingService.massEditingEmailTemplates(id, payload, all, params);
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const massDeletionEmailTemplates = createAsyncThunk(
	'marketing/massDeletionEmailTemplates',
	async ({ id, all, params }: IMassActionsEmailTemplatesPayload, thunkAPI) => {
		try {
			return await uspacySdk.marketingService.massDeletionEmailTemplates(id, all, params);
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const getDomains = createAsyncThunk('marketing/getDomains', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.getDomains();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const getDomain = createAsyncThunk('marketing/getDomain', async (id: number, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.getDomain(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const getDomainStatus = createAsyncThunk('marketing/getDomainStatus', async (id: number, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.getDomainStatus(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createDomain = createAsyncThunk('marketing/createDomain', async (domain: string, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.createDomain({ domain });
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const deleteDomain = createAsyncThunk('marketing/deleteDomain', async (id: number, thunkAPI) => {
	try {
		return await uspacySdk.marketingService.deleteDomain(id);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const getSenders = createAsyncThunk('marketing/getSenders', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.getSenders();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const getSender = createAsyncThunk('marketing/getSender', async (id: number, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.getSender(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createSender = createAsyncThunk('marketing/createSender', async (data: Partial<ISender>, thunkAPI) => {
	try {
		return await uspacySdk.marketingService.createSender(data);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const updateSender = createAsyncThunk('marketing/updateSender', async ({ id, data }: { id: number; data: Partial<ISender> }, thunkAPI) => {
	try {
		return await uspacySdk.marketingService.updateSender(id, data);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const deleteSender = createAsyncThunk('marketing/deleteSender', async (id: number, thunkAPI) => {
	try {
		return await uspacySdk.marketingService.deleteSender(id);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
