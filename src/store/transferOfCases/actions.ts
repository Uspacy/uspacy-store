import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const getTransferTasksProgress = createAsyncThunk('transferOfCases/getTransferTasksProgress', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.getTransferTasksProgress();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getTransferActivitiesProgress = createAsyncThunk('transferOfCases/getTransferActivitiesProgress', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.crmTasksService.getTransferActivitiesProgress();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getTransferEntitiesProgress = createAsyncThunk('transferOfCases/getTransferEntitiesProgress', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.crmEntitiesService.getTransferEntitiesProgress();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});
