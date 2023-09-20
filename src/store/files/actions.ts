import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const fetchFiles = createAsyncThunk(
	'files/fetchFiles',
	async ({ entityId, entityType }: { entityId: string; entityType: string }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.filesService.getFiles(entityId, entityType);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const fetchFilesSize = createAsyncThunk('files/fetchFilesSize', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.filesService.getFilesSize();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});
