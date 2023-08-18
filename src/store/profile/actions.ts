import { createAsyncThunk } from '@reduxjs/toolkit';

import { uspacySdk } from '../../utls/sdk';

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.profileService.getProfile();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
