import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ICreateReindexJob } from '@uspacy/sdk/lib/services/ReindexService/dto/create-reindex-job.dto';

export const getReindexJobs = createAsyncThunk('reindex/getReindexJobs', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.reindexService.getReindexJobs();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createReindexJob = createAsyncThunk('reindex/createReindexJob', async (data: ICreateReindexJob, thunkAPI) => {
	try {
		const res = await uspacySdk.reindexService.createReindexJob(data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const retryReindexJob = createAsyncThunk('reindex/retryReindexJob', async (jobId: number, thunkAPI) => {
	try {
		const res = await uspacySdk.reindexService.retryReindexJob(jobId);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const deleteReindexJob = createAsyncThunk('reindex/deleteReindexJob', async (jobId: number, thunkAPI) => {
	try {
		const res = await uspacySdk.reindexService.deleteReindexJob(jobId);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
