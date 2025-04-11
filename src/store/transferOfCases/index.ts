import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { ITransferOfCasesProgress } from '@uspacy/sdk/lib/models/transferOfCases';

import { transferActivitiesProgress, transferCrmEntitiesProgress, transferTasksProgress } from './actions';
import { IState } from './types';

const initialState = {
	openTransferOfCases: false,
	tasks: {
		status: null,
		totalQuantity: null,
		quantity: null,
		createdAt: null,
	},
	groups: {
		status: null,
		totalQuantity: null,
		quantity: null,
		createdAt: null,
	},
	activities: {
		status: null,
		totalQuantity: null,
		quantity: null,
		createdAt: null,
	},
	crmEntities: {
		status: null,
		totalQuantity: null,
		quantity: null,
		createdAt: null,
	},
	loadingTasksProgress: false,
	loadingGroupsProgress: false,
	loadingActivitiesProgress: false,
	loadingCrmEntitiesProgress: false,
	errorLoadingTasksProgress: null,
	errorLoadingGroupsProgress: null,
	errorLoadingActivitiesProgress: null,
	errorLoadingCrmEntitiesProgress: null,
} as IState;

const transferOfCasesReducer = createSlice({
	name: 'transferOfCasesReducer',
	initialState,
	reducers: {
		setOpenTransferOfCases: (state, action: PayloadAction<boolean>) => {
			state.openTransferOfCases = action.payload;
		},
		setTransferTasksProgress: (state, action: PayloadAction<ITransferOfCasesProgress>) => {
			state.tasks = action.payload;
		},
		setTransferGroupsProgress: (state, action: PayloadAction<ITransferOfCasesProgress>) => {
			state.groups = action.payload;
		},
		setTransferActivitiesProgress: (state, action: PayloadAction<ITransferOfCasesProgress>) => {
			state.activities = action.payload;
		},
		setTransferCrmEntitiesProgress: (state, action: PayloadAction<ITransferOfCasesProgress>) => {
			state.crmEntities = action.payload;
		},
	},
	extraReducers: {
		[transferTasksProgress.fulfilled.type]: (state, action: PayloadAction<ITransferOfCasesProgress>) => {
			state.tasks = action.payload;
			state.loadingTasksProgress = false;
			state.errorLoadingTasksProgress = null;
		},
		[transferTasksProgress.pending.type]: (state) => {
			state.loadingTasksProgress = true;
			state.errorLoadingTasksProgress = null;
		},
		[transferTasksProgress.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingTasksProgress = false;
			state.errorLoadingTasksProgress = action.payload;
		},

		[transferActivitiesProgress.fulfilled.type]: (state, action: PayloadAction<ITransferOfCasesProgress>) => {
			state.activities = action.payload;
			state.loadingActivitiesProgress = false;
			state.errorLoadingActivitiesProgress = null;
		},
		[transferActivitiesProgress.pending.type]: (state) => {
			state.loadingActivitiesProgress = true;
			state.errorLoadingActivitiesProgress = null;
		},
		[transferActivitiesProgress.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingActivitiesProgress = false;
			state.errorLoadingActivitiesProgress = action.payload;
		},

		[transferCrmEntitiesProgress.fulfilled.type]: (state, action: PayloadAction<ITransferOfCasesProgress>) => {
			state.crmEntities = action.payload;
			state.loadingActivitiesProgress = false;
			state.errorLoadingActivitiesProgress = null;
		},
		[transferCrmEntitiesProgress.pending.type]: (state) => {
			state.loadingActivitiesProgress = true;
			state.errorLoadingActivitiesProgress = null;
		},
		[transferCrmEntitiesProgress.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingActivitiesProgress = false;
			state.errorLoadingActivitiesProgress = action.payload;
		},
	},
});

export const { setTransferTasksProgress, setTransferGroupsProgress, setTransferActivitiesProgress, setTransferCrmEntitiesProgress } =
	transferOfCasesReducer.actions;
export default transferOfCasesReducer.reducer;
