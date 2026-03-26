import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IAutomation } from '@uspacy/sdk/lib/models/automations';

export const fetchWorkflows = createAsyncThunk(
	'workflows/fetchWorkflows',
	async ({ page, list, search }: { page: number; list?: number; search?: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.automationsService.getWorkflows(page, list, search);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteWorkflow = createAsyncThunk('workflows/deleteWorkflow', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.automationsService.deleteWorkflow(id);

		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const toggleWorkflow = createAsyncThunk('workflows/toggleWorkflow', async ({ id, body }: { id: number; body: IAutomation }, thunkAPI) => {
	try {
		await uspacySdk.automationsService.toggleWorkflow(id, body);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
