import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const getForms = createAsyncThunk('forms/getForms', async (params?: Record<string, string | number>) => {
	try {
		const res = (await uspacySdk.resourcesService.getResources('form', params)).data;
		return { data: res.data, meta: res.meta };
	} catch (e) {
		return e;
	}
});
