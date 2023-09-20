import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const fetchGroup = createAsyncThunk('groups/fetchGroup', async (id: string, thunkAPI) => {
	try {
		const res = await uspacySdk.groupsService.getGroup(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
