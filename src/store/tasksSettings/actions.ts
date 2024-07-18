import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ITableSettings } from '@uspacy/sdk/lib/models/task-settings';

export const getTasksSettings = createAsyncThunk('tasksSettings/getTasksSettings', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.getTasksSettings();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const createSettings = createAsyncThunk('tasksSettings/createSettings', async (body: ITableSettings, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.createSettings(body);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const updateTasksSettings = createAsyncThunk(
	'tasksSettings/updateTasksSettings',
	async ({ id, rev, body }: { id: string; rev: string; body: ITableSettings }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.updateTasksSettings(id, rev, body);
			return res?.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);
