import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const stopImport = createAsyncThunk('import/systemStop', async (system: string, { rejectWithValue }) => {
	try {
		return await uspacySdk.migrationsService.stopImport(system);
	} catch (e) {
		return rejectWithValue('Failure');
	}
});
