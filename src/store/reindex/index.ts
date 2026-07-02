import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IReindexJob } from '@uspacy/sdk/lib/models/reindex';

import { createReindexJob, deleteReindexJob, getReindexJobs, retryReindexJob } from './actions';
import { IState } from './types';

const initialState: IState = {
	reindexJobs: [],
	loadingReindexJobs: false,
	loadingCreateReindexJob: false,
	loadingDeleteReindexJob: false,
	loadingRetryReindexJob: false,
	errorLoadingReindexJobs: null,
	errorCreatingReindexJob: null,
	errorDeletingReindexJob: null,
	errorRetryingReindexJob: null,
};

const reindexReducer = createSlice({
	name: 'reindexReducer',
	initialState,
	reducers: {
		setReindexJobs: (state, action: PayloadAction<IReindexJob[]>) => {
			state.reindexJobs = action.payload;
		},
	},
	extraReducers: {
		[getReindexJobs.fulfilled.type]: (state, action: PayloadAction<IReindexJob[]>) => {
			state.reindexJobs = action.payload;
			state.loadingReindexJobs = false;
		},
		[getReindexJobs.pending.type]: (state) => {
			state.loadingReindexJobs = true;
		},
		[getReindexJobs.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingReindexJobs = false;
			state.errorLoadingReindexJobs = action.payload;
		},

		[createReindexJob.fulfilled.type]: (state, action: PayloadAction<IReindexJob>) => {
			state.reindexJobs.unshift(action.payload);
			state.loadingCreateReindexJob = false;
		},
		[createReindexJob.pending.type]: (state) => {
			state.loadingCreateReindexJob = true;
		},
		[createReindexJob.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreateReindexJob = false;
			state.errorCreatingReindexJob = action.payload;
		},

		[retryReindexJob.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: { jobId: number } }>) => {
			state.reindexJobs = state.reindexJobs.map((job) => (job.id === action.meta.arg.jobId ? { ...job, status: 'pending' } : job));
			state.loadingRetryReindexJob = false;
		},
		[retryReindexJob.pending.type]: (state) => {
			state.loadingRetryReindexJob = true;
		},
		[retryReindexJob.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingRetryReindexJob = false;
			state.errorRetryingReindexJob = action.payload;
		},

		[deleteReindexJob.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: { jobId: number } }>) => {
			state.reindexJobs = state.reindexJobs.filter((job) => job?.id !== action.meta.arg.jobId);
			state.loadingDeleteReindexJob = false;
		},
		[deleteReindexJob.pending.type]: (state) => {
			state.loadingDeleteReindexJob = true;
		},
		[deleteReindexJob.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeleteReindexJob = false;
			state.errorDeletingReindexJob = action.payload;
		},
	},
});

export const { setReindexJobs } = reindexReducer.actions;
export default reindexReducer.reducer;
