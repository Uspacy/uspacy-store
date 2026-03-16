import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IAppsFilter } from '@uspacy/sdk/lib/models/app';

export const fetchApps = createAsyncThunk('apps/fetchApps', async (data: { filters: IAppsFilter; lng: string }, thunkAPI) => {
	try {
		const result = await uspacySdk.appsService.getAppsWithFilters(data.filters, data?.lng || 'uk');
		return result.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const fetchAppById = createAsyncThunk('apps/fetchAppById', async (data: { id: number; lng: string }, thunkAPI) => {
	try {
		const result = await uspacySdk.appsService.getApp(data.id, data?.lng || 'uk');
		return result.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
