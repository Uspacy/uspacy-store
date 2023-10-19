import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const getDataPresence = createAsyncThunk('zoho/getDataPresence', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.migrationsService.getDataPresence();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});
