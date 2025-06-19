import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const getForms = createAsyncThunk('forms/getForms', async (_, thunkAPI) => {
	// eslint-disable-next-line no-console
	console.log(111);
	try {
		const res = (await uspacySdk.resourcesService.getResources('form', { page: 1, list: 5 })).data;
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
