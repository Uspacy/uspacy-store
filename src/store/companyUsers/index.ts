import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilterField, IFilterPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { IFilter } from '@uspacy/sdk/lib/models/crm-filters';

import { IState } from './types';

export const sortPresets = (presets: IFilterPreset[]) => {
	return presets.sort((a, b) => {
		if (a.pinned) return -1;
		if (b.pinned) return 1;
		return 0;
	});
};

const initialState: IState = {
	data: [],
	loading: true,
	loadingUpdatingUser: false,
	errorLoadingUpdatingUser: null,
	userFilter: null,
};

export const companyUserFilterSlice = createSlice({
	name: 'companyUsers',
	initialState,
	reducers: {
		setFilterPresets: (
			state,
			action: PayloadAction<{
				data: IFilterPreset[];
				filterFields: Partial<IFilterField[]>;
			}>,
		) => {
			if (!state.userFilter) state.userFilter = { presets: [] };
			const presets = sortPresets(action.payload.data);
			const currentPreset = presets.find((item) => item.current);
			state.userFilter = {
				presets,
				filters: {
					...currentPreset?.filters,
				},
				filterFields: action.payload.filterFields,
			};
		},
		createFilterPreset: (state, action: PayloadAction<{ data: IFilterPreset }>) => {
			const presets = sortPresets([
				...state.userFilter.presets.map((it) => ({
					...it,
					current: false,
					pinned: false,
				})),
				action.payload.data,
			]);
			const currentPreset = presets.find((item) => item.current);
			state.userFilter = {
				presets,
				filters: currentPreset?.filters,
				filterFields: currentPreset?.filterFields,
			};
		},
		deleteFilterPreset: (state, action: PayloadAction<{ presetId: IFilterPreset['id'] }>) => {
			let newItems = state.userFilter?.presets.filter((item) => item.id !== action.payload.presetId || item.default);
			let needChangeFilter = false;
			const pinnedItem = newItems?.find((item) => item.pinned);
			if (!pinnedItem) {
				newItems = newItems.map((item) => {
					if (item.default) {
						needChangeFilter = true;
						return {
							...item,
							pinned: true,
							current: true,
						};
					}
					return item;
				});
			}
			state.userFilter.presets = newItems;
			if (needChangeFilter) {
				const currentPreset = newItems.find((item) => item.current);
				state.userFilter.filters = currentPreset?.filters;
			}
		},
		updateFilterPreset: (state, action: PayloadAction<{ data: Partial<IFilterPreset> }>) => {
			state.userFilter.presets = state.userFilter.presets?.map((item) => {
				if (item.id === action.payload.data.id)
					return {
						...item,
						...action.payload.data,
					};
				return item;
			});
		},
		pinFilterPreset: (state, action: PayloadAction<{ presetId: IFilterPreset['id'] }>) => {
			let needChangeFilter = false;
			const newItems = state.userFilter.presets?.map((item) => {
				if (item.id === action.payload.presetId && !item.pinned) {
					needChangeFilter = true;
					return {
						...item,
						pinned: true,
						current: true,
					};
				}
				return {
					...item,
					pinned: false,
				};
			});
			state.userFilter.presets = sortPresets(newItems);
			if (needChangeFilter) {
				const currentPreset = newItems.find((item) => item.current);
				state.userFilter.filters = currentPreset?.filters;
			}
		},
		unpinFilterPreset: (state, action: PayloadAction<{ presetId: IFilterPreset['id'] }>) => {
			const newItems = state.userFilter.presets?.map((item) => {
				if (item.id === action.payload.presetId && item.pinned)
					return {
						...item,
						pinned: false,
					};
				if (item.default && !item.pinned) {
					return {
						...item,
						pinned: true,
						current: true,
					};
				}
				return item;
			});
			state.userFilter.presets = sortPresets(newItems);
			const currentPreset = newItems.find((item) => item.current);
			state.userFilter.filters = currentPreset?.filters;
		},
		setCurrentFilterPreset: (state, action: PayloadAction<{ presetId: IFilterPreset['id'] }>) => {
			let needChangeFilter = false;
			const newItems = state.userFilter.presets?.map((item) => {
				if (item.id === action.payload.presetId) {
					needChangeFilter = true;
					return {
						...item,
						current: true,
					};
				}
				return {
					...item,
					current: false,
				};
			});
			state.userFilter.presets = newItems;
			if (needChangeFilter) {
				const currentPreset = newItems.find((item) => item.current);
				state.userFilter.filters = currentPreset?.filters;
			}
		},
		updateCurrentPresetFilters: (state, action: PayloadAction<{ entityCode: string; filters: Partial<IFilter> }>) => {
			state[action.payload.entityCode].presets = state[action.payload.entityCode].presets?.map((item) => {
				if (item.current) {
					const it = { ...item, filters: { ...item.filters, ...action.payload.filters } };
					return it;
				}
				return item;
			});
			state[action.payload.entityCode].filters = { ...state[action.payload.entityCode]?.filters, ...action.payload.filters };
		},
		updateCurrentFilters: (state, action: PayloadAction<{ entityCode: string; filters: Partial<IFilter> }>) => {
			state[action.payload.entityCode].filters = { ...state[action.payload.entityCode]?.filters, ...action.payload.filters };
		},
		updateCurrentFilterFields: (state, action: PayloadAction<{ entityCode: string; filterFields: Partial<IFilterField[]> }>) => {
			state[action.payload.entityCode].filterFields = action.payload.filterFields;
		},
	},
});

export const {
	setFilterPresets,
	createFilterPreset,
	deleteFilterPreset,
	updateFilterPreset,
	updateCurrentPresetFilters,
	updateCurrentFilters,
	pinFilterPreset,
	unpinFilterPreset,
	setCurrentFilterPreset,
	updateCurrentFilterFields,
} = companyUserFilterSlice.actions;

export default companyUserFilterSlice.reducer;
