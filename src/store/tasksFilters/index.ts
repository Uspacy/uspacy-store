import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICouchItemData, ICouchQueryResponse, ICreateCouchItemResponse } from '@uspacy/sdk/lib/models/couchdb';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IFilterPreset } from '@uspacy/sdk/lib/models/filter-preset';
import { IFilterTasks } from '@uspacy/sdk/lib/models/tasks';

import { bulkUpdateFiltersPresets, createFilterPreset, deleteFilterPreset, getFiltersPreset, getFiltersPresets, updateFilterPreset } from './actions';
import { IState } from './types';

const initialState = {
	isNewPreset: false,
	presets: {},
	preset: {},
	loadingPresets: false,
	loadingCreatePreset: false,
	loadingUpdatePreset: false,
	loadingDeletePreset: false,
	errorLoadingPresets: null,
	errorLoadingCreatePreset: null,
	errorLoadingUpdatePreset: null,
	errorLoadingDeletePreset: null,
} as IState;

const tasksFilters = createSlice({
	name: 'tasksFilters',
	initialState,
	reducers: {
		setIsNewPreset: (state, action: PayloadAction<boolean>) => {
			state.isNewPreset = action.payload;
		},
		setPresets: (state, action: PayloadAction<ICouchQueryResponse<IFilterPreset<IFilterTasks>>>) => {
			state.presets = action.payload;
		},
	},
	extraReducers: {
		[getFiltersPresets.fulfilled.type]: (state, action: PayloadAction<ICouchQueryResponse<IFilterPreset<IFilterTasks>>>) => {
			state.presets = action.payload;
			state.loadingPresets = false;
			state.errorLoadingPresets = null;
		},
		[getFiltersPresets.pending.type]: (state) => {
			state.loadingPresets = true;
			state.errorLoadingPresets = null;
		},
		[getFiltersPresets.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingPresets = false;
			state.errorLoadingPresets = action.payload;
		},

		[getFiltersPreset.fulfilled.type]: (state, action: PayloadAction<ICouchItemData<IFilterPreset<IFilterTasks>>>) => {
			state.preset = action.payload;
			state.loadingPreset = false;
			state.errorLoadingPreset = null;
		},
		[getFiltersPreset.pending.type]: (state) => {
			state.loadingPreset = true;
			state.errorLoadingPreset = null;
		},
		[getFiltersPreset.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingPreset = false;
			state.errorLoadingPreset = action.payload;
		},

		[createFilterPreset.fulfilled.type]: (
			state,
			action: PayloadAction<
				ICreateCouchItemResponse,
				string,
				{ arg: { id: string; rev: string; body: ICouchItemData<IFilterPreset<IFilterTasks>> } }
			>,
		) => {
			const payload = { _id: action.payload.id, _rev: action.payload.rev, ...action.meta.arg.body };

			state.presets.docs.unshift({ _id: payload._id, _rev: payload._rev, ...payload });
			state.loadingCreatePreset = false;
			state.errorLoadingCreatePreset = null;
		},
		[createFilterPreset.pending.type]: (state) => {
			state.loadingCreatePreset = true;
			state.errorLoadingCreatePreset = null;
		},
		[createFilterPreset.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreatePreset = false;
			state.errorLoadingCreatePreset = action.payload;
		},

		[updateFilterPreset.fulfilled.type]: (
			state,
			action: PayloadAction<
				ICreateCouchItemResponse,
				string,
				{ arg: { id: string; rev: string; body: ICouchItemData<IFilterPreset<IFilterTasks>> } }
			>,
		) => {
			const payload = { _id: action.payload.id, _rev: action.payload.rev, ...action.meta.arg.body };

			state.presets.docs = state.presets.docs.map((preset) => {
				return preset._id === payload._id ? payload : preset;
			});
			state.loadingUpdatePreset = false;
			state.errorLoadingUpdatePreset = null;
		},
		[updateFilterPreset.pending.type]: (state) => {
			state.loadingUpdatePreset = true;
			state.errorLoadingUpdatePreset = null;
		},
		[updateFilterPreset.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatePreset = false;
			state.errorLoadingUpdatePreset = action.payload;
		},

		[bulkUpdateFiltersPresets.fulfilled.type]: (
			state,
			action: PayloadAction<ICreateCouchItemResponse[], string, { arg: ICouchItemData<IFilterPreset<IFilterTasks>>[] }>,
		) => {
			const payload = { res: action.payload, body: action.meta.arg };

			state.presets.docs = state.presets.docs.map((preset) => {
				const responseItem = payload?.res?.find((res) => res?.id === preset?._id);
				const bodyItem = payload?.body?.find((body) => body?._id === preset?._id);

				if (responseItem?.id) {
					const updatedPreset = { ...preset, ...bodyItem };

					updatedPreset._rev = responseItem?.rev;

					return updatedPreset;
				}

				return preset;
			});

			state.loadingUpdatePreset = false;
			state.errorLoadingUpdatePreset = null;
		},
		[bulkUpdateFiltersPresets.pending.type]: (state) => {
			state.loadingUpdatePreset = true;
			state.errorLoadingUpdatePreset = null;
		},
		[bulkUpdateFiltersPresets.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatePreset = false;
			state.errorLoadingUpdatePreset = action.payload;
		},

		[deleteFilterPreset.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: { id: string; rev: string } }>) => {
			state.presets.docs = state.presets.docs.filter((preset) => preset._id !== action.meta.arg.id);
			state.loadingDeletePreset = false;
			state.errorLoadingDeletePreset = null;
		},
		[deleteFilterPreset.pending.type]: (state) => {
			state.loadingDeletePreset = true;
			state.errorLoadingDeletePreset = null;
		},
		[deleteFilterPreset.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.errorLoadingDeletePreset = action.payload;
			state.loadingDeletePreset = false;
		},
	},
});

export const { setIsNewPreset, setPresets } = tasksFilters.actions;
export default tasksFilters.reducer;
