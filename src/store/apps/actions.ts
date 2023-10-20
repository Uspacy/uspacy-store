import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const fetchApps = createAsyncThunk('apps/fetchApps', async (data: { page: number; lng: string }, thunkAPI) => {
	try {
		const result = await uspacySdk.appsService.getApps(data.page, data?.lng || 'uk', 12);
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
