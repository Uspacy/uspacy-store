/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IStages } from '@uspacy/sdk/lib/models/tasks-stages';

import { fetchStages, getTasksAllGroupsStages } from './actions';
import { IMoveCard, IState } from './types';

const initialDndItem = {
	fromColumnId: '',
	toColumnId: '',
	cardId: '',
	item: null,
	fromCard: false,
	isSameColumn: false,
	isComplete: false,
};

const initialState = {
	stages: null,
	allGroupsStages: null,
	dndItem: initialDndItem,
	loadingStages: false,
	addingStage: false,
	editingStage: false,
	deletingStage: false,
	loadingMoveTask: false,
	errorLoadingStages: null,
	errorLoadingAllGroupsStages: null,
	errorAddingStage: null,
	errorEditingStage: null,
	errorDeletingStage: null,
	errorLoadingMoveTask: null,
} as IState;

const stagesReducer = createSlice({
	name: 'stagesReducer',
	initialState,
	reducers: {
		clearStages: (state) => {
			state.stages = initialState.stages;
		},
		setDndItem: (state, action: PayloadAction<IMoveCard>) => {
			state.dndItem = action.payload;
		},
	},
	extraReducers: {
		[fetchStages.fulfilled.type]: (state, action: PayloadAction<IStages>) => {
			state.loadingStages = false;
			state.errorLoadingStages = null;
			state.stages = action.payload;
		},
		[fetchStages.pending.type]: (state) => {
			state.loadingStages = true;
			state.errorLoadingStages = null;
		},
		[fetchStages.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingStages = false;
			state.errorLoadingStages = action.payload;
		},
		[getTasksAllGroupsStages.fulfilled.type]: (state, action: PayloadAction<IStages>) => {
			state.errorLoadingAllGroupsStages = null;
			state.allGroupsStages = action.payload;
		},
		[getTasksAllGroupsStages.pending.type]: (state) => {
			state.errorLoadingAllGroupsStages = null;
		},
		[getTasksAllGroupsStages.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.errorLoadingAllGroupsStages = action.payload;
		},
	},
});

export const { clearStages, setDndItem } = stagesReducer.actions;
export default stagesReducer.reducer;
