import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const getDomains = createAsyncThunk('marketing/domains/getDomains', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.getDomains();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const getDomain = createAsyncThunk('marketing/domains/getDomain', async (id: number, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.getDomain(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const getDomainStatus = createAsyncThunk('marketing/domains/getDomainStatus', async (id: number, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.getDomainStatus(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createDomain = createAsyncThunk('marketing/domains/createDomain', async (domain: string, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.createDomain({ domain });
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const deleteDomain = createAsyncThunk('marketing/domains/deleteDomain', async (id: number, thunkAPI) => {
	try {
		return await uspacySdk.marketingService.deleteDomain(id);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
