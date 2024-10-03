import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IHistoryRequest } from '@uspacy/sdk/lib/models/history';

export const fetchChangesHistory = createAsyncThunk(
	'history/fetchChangesHistory',
	async ({ service, entityTableName, id, page, list, action }: IHistoryRequest, thunkAPI) => {
		try {
			const res = await uspacySdk.historyService.getChangesHistory({ service, entityTableName, id, page, list, action });
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);
