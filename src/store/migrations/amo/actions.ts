import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IImportData } from '@uspacy/sdk/lib/services/MigrationsService/dto/get-import-migrations-entities.dto';

export const fetchAmo = createAsyncThunk('amoCRM/fetchEntities', async (systemId: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.migrationsService.getAmoEntites(systemId);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const importAmoEntities = createAsyncThunk('amoCRM/importEntities', async ({ systemId, data }: IImportData, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.migrationsService.importAmoEntities(systemId, data);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});
