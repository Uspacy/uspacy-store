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
} = stagesReducer.actions;
export default stagesReducer.reducer;
