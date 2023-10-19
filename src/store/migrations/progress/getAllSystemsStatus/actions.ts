import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const getAllSystemsStatus = createAsyncThunk('import/systemStatus', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.migrationsService.getAllSystemsStatus();
		return res.data;
	} catch (e) {
		return rejectWithValue('Failure');
	}
});
