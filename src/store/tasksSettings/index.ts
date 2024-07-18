import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICouchItemData } from '@uspacy/sdk/lib/models/couchdb';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { ITableSettings } from '@uspacy/sdk/lib/models/task-settings';

import { createSettings, getTasksSettings, updateTasksSettings } from './actions';
import { IState } from './types';

const initialState = {
	tasksSettings: {
		_id: '',
		_rev: '',
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
	reducers: {},
	extraReducers: {
		[getTasksSettings.fulfilled.type]: (state, action: PayloadAction<ICouchItemData<ITableSettings>>) => {
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
		[createSettings.fulfilled.type]: (state, action: PayloadAction<ICouchItemData<ITableSettings>>) => {
			state.loadingCreateTasksSettings = false;
			state.errorLoadingCreateTasksSettings = null;
			state.tasksSettings = action.payload;
		},
		[createSettings.pending.type]: (state) => {
			state.loadingCreateTasksSettings = true;
			state.errorLoadingCreateTasksSettings = null;
		},
		[createSettings.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreateTasksSettings = false;
			state.errorLoadingCreateTasksSettings = action.payload;
		},
		[updateTasksSettings.fulfilled.type]: (state, action: PayloadAction<ICouchItemData<ITableSettings>>) => {
			state.loadingUpdateTasksSettings = false;
			state.errorLoadingUpdateTasksSettings = null;
			state.tasksSettings = action.payload;
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

export default tasksSettingsReducer.reducer;
