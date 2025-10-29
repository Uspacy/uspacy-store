/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStages } from '@uspacy/sdk/lib/models/tasks-stages';

import { fetchStages } from './actions';
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
	dndItem: initialDndItem,
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
	},
});

export const { clearStages, setDndItem } = stagesReducer.actions;
export default stagesReducer.reducer;
