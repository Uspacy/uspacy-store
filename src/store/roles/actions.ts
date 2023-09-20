import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const fetchRoles = createAsyncThunk('users/fetchRoles', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.rolesService.getRoles();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});
