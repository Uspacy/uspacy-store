import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const fetchLeadsFunnel = createAsyncThunk('leadsFunnel/fetchLeadsFunnel', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.crmLeadsFunnelsService.getLeadsFunnels();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
