import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ITasksColumnSettings } from '@uspacy/sdk/lib/models/tasks-settings';

export const getTasksSettings = createAsyncThunk('tasksSettings/getTasksSettings', async (type: string, { rejectWithValue }) => {
	try {
		const domain = (async () => {
			const docodedToken = await uspacySdk.tokensService.decodeToken();
			return `${docodedToken.domain}-${docodedToken.id}`;
		})();
		const domainKey = await domain;

		const res = await uspacySdk.tasksService.getTasksSettings(domainKey, type);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const createSettings = createAsyncThunk('tasksSettings/createSettings', async (body: ITasksColumnSettings, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.createSettings(body);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const updateTasksSettings = createAsyncThunk(
	'tasksSettings/updateTasksSettings',
	async ({ id, rev, body }: { id: string; rev: string; body: ITasksColumnSettings }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.updateTasksSettings(id, rev, body);
			return { _id: res?.data?.id, _rev: res?.data?.rev, ...body };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);
