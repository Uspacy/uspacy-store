import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { ITransferOfCasesProgress } from '@uspacy/sdk/lib/models/transferOfCases';

import {
	getTransferActivitiesProgress,
	getTransferEntitiesProgress,
	getTransferTasksProgress,
	stopTransferActivities,
	stopTransferEntities,
	stopTransferTasks,
} from './actions';
import { IDataForTransferOfCases, IState } from './types';

const initialState = {
	dataForTransferOfCases: {
		open: false,
		expand: false,
		userId: null,
		status: 'preparing',
	},
	transferProgress: {
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
			total_quantity: null,
			quantity: null,
			created_at: null,
		},
		crmEntities: {
			status: null,
			total_quantity: null,
			quantity: null,
			created_at: null,
		},
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
		setDataTransferOfCases: (state, action: PayloadAction<IDataForTransferOfCases>) => {
			state.dataForTransferOfCases = action.payload;
		},
		setTransferTasksProgress: (state, action: PayloadAction<ITransferOfCasesProgress>) => {
			state.transferProgress.tasks = action.payload;
		},
		setTransferGroupsProgress: (state, action: PayloadAction<ITransferOfCasesProgress>) => {
			state.transferProgress.groups = action.payload;
		},
		setTransferActivitiesProgress: (state, action: PayloadAction<ITransferOfCasesProgress>) => {
			state.transferProgress.activities = action.payload;
		},
		setTransferCrmEntitiesProgress: (state, action: PayloadAction<ITransferOfCasesProgress>) => {
			state.transferProgress.crmEntities = action.payload;
		},
	},
	extraReducers: {
		[getTransferTasksProgress.fulfilled.type]: (state, action: PayloadAction<ITransferOfCasesProgress>) => {
			state.transferProgress.tasks = action.payload;
			state.loadingTasksProgress = false;
			state.errorLoadingTasksProgress = null;
		},
		[getTransferTasksProgress.pending.type]: (state) => {
			state.loadingTasksProgress = true;
			state.errorLoadingTasksProgress = null;
		},
		[getTransferTasksProgress.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingTasksProgress = false;
			state.errorLoadingTasksProgress = action.payload;
		},

		[getTransferActivitiesProgress.fulfilled.type]: (state, action: PayloadAction<ITransferOfCasesProgress>) => {
			state.transferProgress.activities = action.payload;
			state.loadingActivitiesProgress = false;
			state.errorLoadingActivitiesProgress = null;
		},
		[getTransferActivitiesProgress.pending.type]: (state) => {
			state.loadingActivitiesProgress = true;
			state.errorLoadingActivitiesProgress = null;
		},
		[getTransferActivitiesProgress.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingActivitiesProgress = false;
			state.errorLoadingActivitiesProgress = action.payload;
		},

		[getTransferEntitiesProgress.fulfilled.type]: (state, action: PayloadAction<ITransferOfCasesProgress>) => {
			state.transferProgress.crmEntities = action.payload;
			state.loadingActivitiesProgress = false;
			state.errorLoadingActivitiesProgress = null;
		},
		[getTransferEntitiesProgress.pending.type]: (state) => {
			state.loadingActivitiesProgress = true;
			state.errorLoadingActivitiesProgress = null;
		},
		[getTransferEntitiesProgress.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingActivitiesProgress = false;
			state.errorLoadingActivitiesProgress = action.payload;
		},

		[stopTransferTasks.fulfilled.type]: (state) => {
			state.transferProgress.tasks = { status: null, totalQuantity: null, quantity: null, createdAt: null };
			state.loadingStopTasksTransfer = false;
			state.errorLoadingStopTasksTransfer = null;
		},
		[stopTransferTasks.pending.type]: (state) => {
			state.loadingStopTasksTransfer = true;
			state.errorLoadingStopTasksTransfer = null;
		},
		[stopTransferTasks.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingStopTasksTransfer = false;
			state.errorLoadingStopTasksTransfer = action.payload;
		},
		[stopTransferActivities.fulfilled.type]: (state) => {
			state.transferProgress.activities = { status: null, total_quantity: null, quantity: null, created_at: null };
			state.loadingActivitiesProgress = false;
			state.errorLoadingActivitiesProgress = null;
		},
		[stopTransferActivities.pending.type]: (state) => {
			state.loadingActivitiesProgress = true;
			state.errorLoadingActivitiesProgress = null;
		},
		[stopTransferActivities.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingActivitiesProgress = false;
			state.errorLoadingActivitiesProgress = action.payload;
		},
		[stopTransferEntities.fulfilled.type]: (state) => {
			state.transferProgress.crmEntities = { status: null, total_quantity: null, quantity: null, created_at: null };
			state.loadingCrmEntitiesProgress = false;
			state.errorLoadingCrmEntitiesProgress = null;
		},
		[stopTransferEntities.pending.type]: (state) => {
			state.loadingCrmEntitiesProgress = true;
			state.errorLoadingCrmEntitiesProgress = null;
		},
		[stopTransferEntities.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCrmEntitiesProgress = false;
			state.errorLoadingCrmEntitiesProgress = action.payload;
		},
	},
});

export const {
	setDataTransferOfCases,
	setTransferTasksProgress,
	setTransferGroupsProgress,
	setTransferActivitiesProgress,
	setTransferCrmEntitiesProgress,
} = transferOfCasesReducer.actions;
export default transferOfCasesReducer.reducer;
