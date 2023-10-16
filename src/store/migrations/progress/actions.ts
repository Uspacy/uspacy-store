import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const getSystemStatus = createAsyncThunk('import/systemStatus', async (system: string, { rejectWithValue }) => {
	try {
		return await uspacySdk.migrationsService.getSystemProgress(system);
	} catch (e) {
		return rejectWithValue('Failure');
	}
});
