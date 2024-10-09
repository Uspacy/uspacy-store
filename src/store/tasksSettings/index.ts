import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICouchQueryResponse } from '@uspacy/sdk/lib/models/couchdb';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { ITasksColumnSettings } from '@uspacy/sdk/lib/models/tasks-settings';

import { createSettings, getTasksSettings, updateTasksSettings } from './actions';
import { IState } from './types';

const initialState = {
	tasksSettings: {
		docs: [],
	},
	loadingTasksSettings: false,
	loadingCreateTasksSettings: false,
	loadingUpdateTasksSettings: false,
	errorLoadingTasksSettings: null,
	errorLoadingCreateTasksSettings: null,
	errorLoadingUpdateTasksSettings: null,
} as IState;

const tasksSettingsReducer = createSlice({
	name: 'tasksSettingsReducer',
	initialState,
	reducers: {
		setTasksSettings: (state, action: PayloadAction<ICouchQueryResponse<ITasksColumnSettings>>) => {
			state.tasksSettings = action.payload;
		},
	},
	extraReducers: {
		[getTasksSettings.fulfilled.type]: (state, action: PayloadAction<ICouchQueryResponse<ITasksColumnSettings>>) => {
			state.loadingTasksSettings = false;
			state.errorLoadingTasksSettings = null;
			state.tasksSettings = action.payload;
		},
		[getTasksSettings.pending.type]: (state) => {
			state.loadingTasksSettings = true;
			state.errorLoadingTasksSettings = null;
		},
		[getTasksSettings.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingTasksSettings = false;
			state.errorLoadingTasksSettings = action.payload;
		},
		[createSettings.fulfilled.type]: (state) => {
			state.loadingCreateTasksSettings = false;
			state.errorLoadingCreateTasksSettings = null;
		},
		[createSettings.pending.type]: (state) => {
			state.loadingCreateTasksSettings = true;
			state.errorLoadingCreateTasksSettings = null;
		},
		[createSettings.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreateTasksSettings = false;
			state.errorLoadingCreateTasksSettings = action.payload;
		},
		[updateTasksSettings.fulfilled.type]: (state, action: PayloadAction<ITasksColumnSettings>) => {
			state.loadingUpdateTasksSettings = false;
			state.errorLoadingUpdateTasksSettings = null;
			state.tasksSettings.docs = state.tasksSettings.docs.map((item) => (item._id === action.payload._id ? action.payload : item));
		},
		[updateTasksSettings.pending.type]: (state) => {
			state.loadingUpdateTasksSettings = true;
			state.errorLoadingUpdateTasksSettings = null;
		},
		[updateTasksSettings.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdateTasksSettings = false;
			state.errorLoadingUpdateTasksSettings = action.payload;
		},
	},
});

export const { setTasksSettings } = tasksSettingsReducer.actions;
export default tasksSettingsReducer.reducer;
