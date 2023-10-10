import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilterPreset } from '@uspacy/sdk/lib/models/filters-presets';
import { ITasksParams } from '@uspacy/sdk/lib/models/tasks';

import { IState } from './types';

const initialState = {
	currentFilter: {},
	currentFilterRegular: {},
	filterPresets: [],
	filterPresetsRegular: [],
} as IState;

const stagesReducer = createSlice({
	name: 'tasksFilters',
	initialState,
	reducers: {
		setCurrentFilter: (state, action: PayloadAction<ITasksParams>) => {
			state.currentFilter = action.payload;
		},
		setCurrentFilterRegular: (state, action: PayloadAction<ITasksParams>) => {
			state.currentFilterRegular = action.payload;
		},
		setFilterPresets: (state, action: PayloadAction<IFilterPreset[]>) => {
			state.filterPresets = action.payload;
		},
		setFilterPresetsRegular: (state, action: PayloadAction<IFilterPreset[]>) => {
			state.filterPresetsRegular = action.payload;
		},
		createFilterPreset: (state, action: PayloadAction<IFilterPreset>) => {
			state.filterPresets = [...state.filterPresets, action.payload];
		},
		createFilterPresetRegular: (state, action: PayloadAction<IFilterPreset>) => {
			state.filterPresetsRegular = [...state.filterPresetsRegular, action.payload];
		},
		updateFilterPreset: (state, action: PayloadAction<IFilterPreset>) => {
			state.filterPresets = state.filterPresets.map((preset) => {
				if (preset.title === action.payload.title) return action.payload;
				return preset;
			});
		},
		updateFilterPresetRegular: (state, action: PayloadAction<IFilterPreset>) => {
			state.filterPresetsRegular = state.filterPresets.map((preset) => {
				if (preset.title === action.payload.title) return action.payload;
				return preset;
			});
		},
		deleteFilterPreset: (state, action: PayloadAction<string>) => {
			state.filterPresets = state.filterPresets.filter((preset) => preset.title !== action.payload);
		},
		deleteFilterPresetRegular: (state, action: PayloadAction<string>) => {
			state.filterPresetsRegular = state.filterPresetsRegular.filter((preset) => preset.title !== action.payload);
		},
	},
});

export const {
	setCurrentFilter,
	setCurrentFilterRegular,
	setFilterPresets,
	setFilterPresetsRegular,
	createFilterPreset,
	createFilterPresetRegular,
	updateFilterPreset,
	updateFilterPresetRegular,
	deleteFilterPreset,
	deleteFilterPresetRegular,
} = stagesReducer.actions;
export default stagesReducer.reducer;
