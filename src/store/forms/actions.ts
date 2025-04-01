import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const getForms = createAsyncThunk('forms/getForms', async (_, thunkAPI) => {
	try {
		const res = (await uspacySdk.resourcesService.getResources('form')).data;
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
