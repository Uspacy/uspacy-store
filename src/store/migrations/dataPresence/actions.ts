import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const getDataPresence = createAsyncThunk('zoho/getDataPresence', async (_, { rejectWithValue }) => {
	try {
		return await uspacySdk.migrationsService.getDataPresence();
	} catch (err) {
		return rejectWithValue('Failure');
	}
});
