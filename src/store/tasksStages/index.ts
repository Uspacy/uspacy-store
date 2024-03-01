/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStage, IStages } from '@uspacy/sdk/lib/models/tasks-stages';

import { fetchStages, moveTask } from './actions';
import { IDnDItem, IMoveTaskId, IState } from './types';

const initialDnD = {
	fromColumnId: '',
	toColumnId: '',
	cardId: '',
	item: {},
};

const initialState = {
	stages: {
		data: [],
	},
	columns: {},
	moveTask: {},
	dndItem: initialDnD,
	loadingStages: false,
	addingStage: false,
	editingStage: false,
	deletingStage: false,
	loadingMoveTask: false,
	errorLoadingStages: '',
	errorAddingStage: '',
	errorEditingStage: '',
	errorDeletingStage: '',
	errorLoadingMoveTask: '',
} as IState;

const stagesReducer = createSlice({
	name: 'stagesReducer',
	initialState,
	reducers: {
		setStages: (state, action: PayloadAction<IStages>) => {
			state.stages = action.payload;
		},
		deleteStageReducer: (state, action: PayloadAction<string | number>) => {
			state.stages.data = state.stages.data.filter((stage) => stage?.id !== String(action?.payload));
		},
		addStageReducer: (state, action: PayloadAction<IStage>) => {
			state.stages.data = state.stages.data.concat(action.payload);
		},
		moveTaskChangeCardInColumn: (state, action: PayloadAction<IDnDItem>) => {
			state.dndItem = action.payload;
		},
		clearDnDItem: (state) => {
			state.dndItem = initialDnD;
		},
	},
	extraReducers: {
		[fetchStages.fulfilled.type]: (state, action: PayloadAction<IStages>) => {
			state.loadingStages = false;
			state.errorLoadingStages = '';
			state.stages = action.payload;
		},
		[fetchStages.pending.type]: (state) => {
			state.loadingStages = true;
			state.errorLoadingStages = '';
		},
		[fetchStages.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingStages = false;
			state.errorLoadingStages = action.payload;
		},
		[moveTask.fulfilled.type]: (state, action: PayloadAction<IMoveTaskId>) => {
			state.loadingMoveTask = false;
			state.errorLoadingMoveTask = '';
			state.moveTask = action.payload;
		},
		[moveTask.pending.type]: (state) => {
			state.loadingMoveTask = true;
			state.errorLoadingMoveTask = '';
		},
		[moveTask.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingMoveTask = false;
			state.errorLoadingMoveTask = action.payload;
		},
	},
});

export const { setStages, deleteStageReducer, addStageReducer, moveTaskChangeCardInColumn, clearDnDItem } = stagesReducer.actions;
export default stagesReducer.reducer;
