import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const fetchEntities = createAsyncThunk('entities/fetchEntities', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.crmEntitiesService.getEntities();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
