import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilterPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { IFilter } from '@uspacy/sdk/lib/models/crm-filters';

import { IState } from './types';

const initialState: IState = {};

export const sortPresets = (presets: IFilterPreset[]) => {
	return presets.sort((a, b) => {
		if (a.pinned) return -1;
		if (b.pinned) return 1;
		return 0;
	});
};

const filtersReducer = createSlice({
	name: 'crm/filters',
	initialState,
	reducers: {
		setFilterPresets: (
			state,
			action: PayloadAction<{ entityCode: string; data: IFilterPreset[]; filtersFromSearchParams: Partial<IFilter> }>,
		) => {
			if (!state[action.payload.entityCode]) state[action.payload.entityCode] = { presets: [] };
			const presets = sortPresets(action.payload.data);
			const currentPreset = presets.find((item) => item.current);
			state[action.payload.entityCode] = {
				presets,
				filters: {
					...currentPreset?.filters,
					...action.payload.filtersFromSearchParams,
				},
			};
		},
		createFilterPreset: (state, action: PayloadAction<{ entityCode: string; data: IFilterPreset }>) => {
			const presets = sortPresets([
				...state[action.payload.entityCode].presets.map((it) => ({
					...it,
					current: false,
					pinned: false,
				})),
				action.payload.data,
			]);
			const currentPreset = presets.find((item) => item.current);
			state[action.payload.entityCode] = {
				presets,
				filters: currentPreset?.filters,
			};
		},
		deleteFilterPreset: (state, action: PayloadAction<{ entityCode: string; presetId: IFilterPreset['id'] }>) => {
			let newItems = state[action.payload.entityCode]?.presets.filter((item) => item.id !== action.payload.presetId || item.default);
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
			state[action.payload.entityCode].presets = newItems;
			if (needChangeFilter) {
				const currentPreset = newItems.find((item) => item.current);
				state[action.payload.entityCode].filters = currentPreset?.filters;
			}
		},
		updateFilterPreset: (state, action: PayloadAction<{ entityCode: string; data: Partial<IFilterPreset> }>) => {
			state[action.payload.entityCode].presets = state[action.payload.entityCode].presets?.map((item) => {
				if (item.id === action.payload.data.id)
					return {
						...item,
						...action.payload.data,
					};
				return item;
			});
		},
		pinFilterPreset: (state, action: PayloadAction<{ entityCode: string; presetId: IFilterPreset['id'] }>) => {
			let needChangeFilter = false;
			const newItems = state[action.payload.entityCode].presets?.map((item) => {
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
			state[action.payload.entityCode].presets = sortPresets(newItems);
			if (needChangeFilter) {
				const currentPreset = newItems.find((item) => item.current);
				state[action.payload.entityCode].filters = currentPreset?.filters;
			}
		},
		unpinFilterPreset: (state, action: PayloadAction<{ entityCode: string; presetId: IFilterPreset['id'] }>) => {
			const newItems = state[action.payload.entityCode].presets?.map((item) => {
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
			state[action.payload.entityCode].presets = sortPresets(newItems);
			const currentPreset = newItems.find((item) => item.current);
			state[action.payload.entityCode].filters = currentPreset?.filters;
		},
		setCurrentFilterPreset: (state, action: PayloadAction<{ entityCode: string; presetId: IFilterPreset['id'] }>) => {
			let needChangeFilter = false;
			const newItems = state[action.payload.entityCode].presets?.map((item) => {
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
			state[action.payload.entityCode].presets = newItems;
			if (needChangeFilter) {
				const currentPreset = newItems.find((item) => item.current);
				state[action.payload.entityCode].filters = currentPreset?.filters;
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
} = filtersReducer.actions;
export default filtersReducer.reducer;
