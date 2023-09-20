import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ITimerPayload } from '@uspacy/sdk/lib/services/TasksTimerService/dto/create-update-timer.dto';

export const fetchTimerRealTime = createAsyncThunk('timer/fetchTimerRealTime', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksTimerService.getTimerRealtime();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const startTimer = createAsyncThunk('timer/startTimer', async (id: string, { rejectWithValue }) => {
	try {
		await uspacySdk.tasksTimerService.startTimer(id);
		return id;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const stopTimer = createAsyncThunk('timer/stopTimer', async (id: string, { rejectWithValue }) => {
	try {
		return await uspacySdk.tasksTimerService.stopTimer(id);
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const fetchTaskTimerList = createAsyncThunk('timer/fetchTaskTimerList', async (id: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksTimerService.getTimerList(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const createTimer = createAsyncThunk('timer/createTimer', async ({ id, data }: { id: string; data: ITimerPayload }, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksTimerService.createTimer(id, data);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const editTimer = createAsyncThunk(
	'timer/editTimer',
	async ({ taskId, id, data }: { taskId: string; id: string; data: ITimerPayload }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksTimerService.updateTimer(taskId, id, data);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const deleteTimer = createAsyncThunk('timer/deleteTimer', async ({ taskId, id }: { taskId: string; id: string }, { rejectWithValue }) => {
	try {
		await uspacySdk.tasksTimerService.deleteTimer(taskId, id);

		return id;
	} catch (e) {
		return rejectWithValue(e);
	}
});
