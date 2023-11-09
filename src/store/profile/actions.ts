import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IRequisiteUpdate, ITemplate, ITemplateUpdate } from '@uspacy/sdk/lib/models/requisites';

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.profileService.getProfile();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const fetchRequisites = createAsyncThunk('crm/fetchRequisites', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.profileService.getRequisites();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const updateRequisite = createAsyncThunk('crm/updateRequisite', async (data: IRequisiteUpdate, thunkAPI) => {
	try {
		const res = await uspacySdk.profileService.updateRequisite(data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const removeRequisite = createAsyncThunk('crm/removeRequisite', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.profileService.removeRequisite(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const fetchTemplates = createAsyncThunk('crm/fetchTemplates', async (data: { page?: number; list?: number }, thunkAPI) => {
	const { page, list } = data;
	try {
		const res = await uspacySdk.profileService.getTemplates(page, list);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const fetchBasicTemplates = createAsyncThunk('crm/fetchBasicTemplates', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.profileService.getBasicTemplates();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createTemplate = createAsyncThunk('crm/createTemplate', async (data: ITemplate & { region_id: number }, thunkAPI) => {
	try {
		const res = await uspacySdk.profileService.createTemplate(data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const updateTemplate = createAsyncThunk('crm/updateTemplate', async (data: ITemplateUpdate, thunkAPI) => {
	try {
		const res = await uspacySdk.profileService.updateTemplate(data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const removeTemplate = createAsyncThunk('crm/removeTemplate', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.profileService.removeTemplate(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
