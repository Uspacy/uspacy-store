import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const fetchDealsFunnel = createAsyncThunk('dealsFunnel/fetchDealsFunnel', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.crmDealsFunnelsService.getDealsFunnels();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
