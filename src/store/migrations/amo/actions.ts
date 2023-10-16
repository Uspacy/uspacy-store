import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IImportData } from '@uspacy/sdk/lib/services/MigrationsService/dto/get-import-migrations-entities.dto';

export const fetchAmo = createAsyncThunk('amoCRM/fetchEntities', async (systemId: string, { rejectWithValue }) => {
	try {
		return await uspacySdk.migrationsService.getAmoEntites(systemId);
	} catch (err) {
		return rejectWithValue('Failure');
	}
});

export const importAmoEntities = createAsyncThunk('amoCRM/importEntities', async ({ systemId, data }: IImportData, { rejectWithValue }) => {
	try {
		return await uspacySdk.migrationsService.importAmoEntities(systemId, data);
	} catch (e) {
		return rejectWithValue('Failure');
	}
});
