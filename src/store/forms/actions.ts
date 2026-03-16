import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const getForms = createAsyncThunk('forms/getForms', async (params?: Record<string, string | number>) => {
	try {
		const res = (await uspacySdk.resourcesService.getResources('form', params)).data;
		return res.data;
	} catch (e) {
		return e;
	}
});
