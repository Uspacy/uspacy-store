import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const fetchStages = createAsyncThunk('stages/fetchStages', async (groupId: number, thunkAPI) => {
	try {
		const res = await uspacySdk.tasksStagesService.getTasksStages(groupId);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const moveTask = createAsyncThunk('stages/moveTask', async ({ cardId, stageId }: { cardId: string; stageId: string }, thunkAPI) => {
	try {
		return await uspacySdk.tasksStagesService.moveTask(cardId, stageId);
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
