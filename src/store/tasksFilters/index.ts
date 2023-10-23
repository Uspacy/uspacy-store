import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilterPreset } from '@uspacy/sdk/lib/models/filters-presets';

import { IState } from './types';

const initialState = {
	isNewPreset: false,
	currentPreset: {},
	currentPresetRegular: {},
	standardPreset: {},
	standardPresetRegular: {},
	filterPresets: [],
	filterPresetsRegular: [],
} as IState;

const stagesReducer = createSlice({
	name: 'tasksFilters',
	initialState,
	reducers: {
		setIsNewPreset: (state, action: PayloadAction<boolean>) => {
			state.isNewPreset = action.payload;
		},
		setCurrentPreset: (state, action: PayloadAction<IFilterPreset>) => {
			state.currentPreset = action.payload;
		},
		setCurrentPresetRegular: (state, action: PayloadAction<IFilterPreset>) => {
			state.currentPresetRegular = action.payload;
		},
		setStandardPreset: (state, action: PayloadAction<IFilterPreset>) => {
			state.standardPreset = action.payload;
		},
		setStandardPresetRegular: (state, action: PayloadAction<IFilterPreset>) => {
			state.standardPresetRegular = action.payload;
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
	setIsNewPreset,
	setCurrentPreset,
	setCurrentPresetRegular,
	setStandardPreset,
	setStandardPresetRegular,
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
