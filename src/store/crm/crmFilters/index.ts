import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilter } from '@uspacy/sdk/lib/models/crm-filters';
import { IFilterField, IFilterPreset } from '@uspacy/sdk/lib/models/filter-preset';

import { IState } from './types';

const initialState: IState = {
	_id: '',
	_rev: '',
	type: '',
	data: null,
};

export const sortPresets = (presets: IFilterPreset<IFilter>[]) => {
	return presets.sort((a, b) => {
		if (a.pinned) return -1;
		if (b.pinned) return 1;
		return 0;
	});
};

const crmFiltersReducer = createSlice({
	name: 'crm/crmFilters',
	initialState,
	reducers: {
		setFilterPresets: (
			state,
			action: PayloadAction<{
				_id: string;
				_rev: string;
				type: string;
				entityCode: string;
				data: IFilterPreset<IFilter>[];
				filtersFromSearchParams: Partial<IFilter>;
				filterFields: Partial<IFilterField[]>;
			}>,
		) => {
			if (!state.data) state.data = { presets: [] };
			const presets = sortPresets(action.payload.data);
			const currentPreset = presets.find((item) => item.current);
			state._id = action.payload._id;
			state._rev = action.payload._rev;
			state.type = action.payload.type;
			state.data = {
				presets,
				filters: {
					...currentPreset?.filters,
					...action.payload.filtersFromSearchParams,
				},
				filterFields: action.payload.filterFields,
			};
		},
		createFilterPreset: (state, action: PayloadAction<{ entityCode: string; data: IFilterPreset<IFilter> }>) => {
			const presets = sortPresets([
				...state.data.presets.map((it) => ({
					...it,
					current: false,
					pinned: false,
				})),
				action.payload.data,
			]);
			const currentPreset = presets.find((item) => item.current);
			state.data = {
				presets,
				filters: currentPreset?.filters,
				filterFields: currentPreset?.filterFields,
			};
		},
		deleteFilterPreset: (state, action: PayloadAction<{ entityCode: string; presetId: IFilterPreset<IFilter>['id'] }>) => {
			let newItems = state.data?.presets.filter((item) => item.id !== action.payload.presetId || item.default);
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
			state.data.presets = newItems;
			if (needChangeFilter) {
				const currentPreset = newItems.find((item) => item.current);
				state.data.filters = currentPreset?.filters;
			}
		},
		updateFilterPreset: (state, action: PayloadAction<{ entityCode: string; data: Partial<IFilterPreset<IFilter>> }>) => {
			state.data.presets = state.data.presets?.map((item) => {
				if (item.id === action.payload.data.id)
					return {
						...item,
						...action.payload.data,
					};
				return item;
			});
		},
		pinFilterPreset: (state, action: PayloadAction<{ entityCode: string; presetId: IFilterPreset<IFilter>['id'] }>) => {
			let needChangeFilter = false;
			const newItems = state.data.presets?.map((item) => {
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
			state.data.presets = sortPresets(newItems);
			if (needChangeFilter) {
				const currentPreset = newItems.find((item) => item.current);
				state.data.filters = currentPreset?.filters;
			}
		},
		unpinFilterPreset: (state, action: PayloadAction<{ entityCode: string; presetId: IFilterPreset<IFilter>['id'] }>) => {
			const newItems = state.data.presets?.map((item) => {
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
			state.data.presets = sortPresets(newItems);
			const currentPreset = newItems.find((item) => item.current);
			state.data.filters = currentPreset?.filters;
		},
		setCurrentFilterPreset: (state, action: PayloadAction<{ entityCode: string; presetId: IFilterPreset<IFilter>['id'] }>) => {
			let needChangeFilter = false;
			const newItems = state.data.presets?.map((item) => {
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
			state.data.presets = newItems;
			if (needChangeFilter) {
				const currentPreset = newItems.find((item) => item.current);
				state.data.filters = currentPreset?.filters;
			}
		},
		updateCurrentPresetFilters: (state, action: PayloadAction<{ entityCode: string; filters: Partial<IFilter> }>) => {
			state.data.presets = state.data.presets?.map((item) => {
				if (item.current) {
					const it = { ...item, filters: { ...item.filters, ...action.payload.filters } };
					return it;
				}
				return item;
			});
			state.data.filters = { ...state.data?.filters, ...action.payload.filters };
		},
		updateCurrentFilters: (state, action: PayloadAction<{ entityCode: string; filters: Partial<IFilter> }>) => {
			state.data.filters = { ...state.data?.filters, ...action.payload.filters };
		},
		updateCurrentFilterFields: (state, action: PayloadAction<{ entityCode: string; filterFields: Partial<IFilterField[]> }>) => {
			state.data.filterFields = action.payload.filterFields;
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
} = crmFiltersReducer.actions;
export default crmFiltersReducer.reducer;
