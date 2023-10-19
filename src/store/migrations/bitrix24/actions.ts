import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IImportData } from '@uspacy/sdk/lib/services/MigrationsService/dto/get-import-migrations-entities.dto';

export const fetchBitrix24 = createAsyncThunk('bitrix24/fetchEntities', async (webhook: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.migrationsService.getBitrix24Entities(webhook);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const importBitrix24Entities = createAsyncThunk(
	'bitrix24/importBitrix24Entities',
	async ({ webhook, data }: IImportData, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.migrationsService.importBitrix24Entities(webhook, data);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);
