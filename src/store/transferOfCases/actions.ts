import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const transferTasksProgress = createAsyncThunk('transferOfCases/transferTasksProgress', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.transferTasksProgress();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const transferActivitiesProgress = createAsyncThunk('transferOfCases/transferActivitiesProgress', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.crmTasksService.transferActivitiesProgress();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const transferCrmEntitiesProgress = createAsyncThunk('transferOfCases/transferEntitiesProgress', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.crmEntitiesService.transferEntitiesProgress();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});
