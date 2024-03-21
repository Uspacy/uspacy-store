import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IAutomation } from '@uspacy/sdk/lib/models/automations';

export const fetchAutomations = createAsyncThunk('automations/fetchAutomations', async ({ page, list }: { page: number; list: number }, thunkAPI) => {
	try {
		const res = await uspacySdk.automationsService.getAutomations(page, list);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteAutomation = createAsyncThunk('automations/deleteAutomations', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.automationsService.deleteAutomation(id);

		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const toggleAutomation = createAsyncThunk(
	'automations/toggleAutomation',
	async ({ id, body }: { id: number; body: IAutomation }, thunkAPI) => {
		try {
			await uspacySdk.automationsService.toggleAutomation(id, body);
			return id;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);
