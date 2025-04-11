import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const getBookings = createAsyncThunk('booking/getBookings', async (_, thunkAPI) => {
	try {
		const res = (await uspacySdk.resourcesService.getResources('calendar')).data;
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
