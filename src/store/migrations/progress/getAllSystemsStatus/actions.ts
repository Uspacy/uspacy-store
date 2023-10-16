import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const getAllSystemsStatus = createAsyncThunk('import/systemStatus', async (_, { rejectWithValue }) => {
	try {
		return await uspacySdk.migrationsService.getAllSystemsStatus();
	} catch (e) {
		return rejectWithValue('Failure');
	}
});
