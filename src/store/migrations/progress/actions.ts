import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const getSystemStatus = createAsyncThunk('import/systemStatus', async (system: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.migrationsService.getSystemProgress(system);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getMondayStatus = createAsyncThunk('progress/mondayStatus', async (system: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.migrationsService.getMondayProgress(system);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});
