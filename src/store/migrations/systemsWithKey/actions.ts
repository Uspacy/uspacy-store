import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IImportData } from '@uspacy/sdk/lib/services/MigrationsService/dto/get-import-migrations-entities.dto';

export const fetchMigrationEntity = createAsyncThunk(
	'systemsWithKey/fetchMigrationEntities',
	async (data: { apiKey: string; systemName: string }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.migrationsService.getMigrationEntities(data.apiKey, data.systemName);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const importMigrationEntities = createAsyncThunk(
	'systemsWithKey/importMigrationEntities',
	async ({ apiKey, data, systemName, body }: IImportData, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.migrationsService.importMigrationEntities(apiKey, data, systemName, body);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);
