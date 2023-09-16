import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IColumns, IStage, IStages } from '@uspacy/sdk/lib/models/tasks-stages';

import { changeColumn } from '../../helpers/changeColumn';
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
		deleteStageReducer: (state, action: PayloadAction<string | number>) => {
			state.stages.data = state.stages.data.filter((stage) => stage?.id !== String(action?.payload));
		},
		addStageReducer: (state, action: PayloadAction<IStage>) => {
			state.stages.data = state.stages.data.concat(action.payload);
		},
		changeColumnsState: (state, action: PayloadAction<{ data: IColumns; isColumnsChanged: boolean }>) => {
			state.columns = action.payload.data;
			const { isUpdateStages, newStageArray } = changeColumn(action.payload.data, action.payload.isColumnsChanged, state.stages.data);

			if (isUpdateStages) {
				state.stages.data = newStageArray;
			}
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

export const { deleteStageReducer, addStageReducer, changeColumnsState, moveTaskChangeCardInColumn, clearDnDItem } = stagesReducer.actions;
export default stagesReducer.reducer;
