import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDependenciesList } from '@uspacy/sdk/lib/models/dependencies-list';

import { createDependenciesList, deleteDependenciesList, fetchDependenciesLists, updateDependenciesLists } from './actions';
import { DependenciesLists, IState } from './types';

const initialState: IState = {};

const dependenciesReducer = createSlice({
	name: 'crm/dependencies',
	initialState,
	reducers: {
		clearEntityDependenciesLists: (state, action: PayloadAction<string>) => {
			state[action.payload] = undefined;
		},
	},
	extraReducers: {
		[fetchDependenciesLists.fulfilled.type]: (state, action: PayloadAction<IDependenciesList[], string, { arg: string }>) => {
			const entityCode = action.meta.arg;
			if (!state?.[entityCode]) return;
			state[entityCode].loading = false;
			state[entityCode].errorMessage = '';
			state[entityCode].data = action.payload;
		},
		[fetchDependenciesLists.pending.type]: (state, action: PayloadAction<unknown, string, { arg: string }>) => {
			const entityCode = action.meta.arg;
			state[entityCode] ??= { loading: true, data: [], errorMessage: '' } as DependenciesLists;
			state[entityCode].loading = true;
			state[entityCode].errorMessage = '';
		},
		[fetchDependenciesLists.rejected.type]: (state, action: PayloadAction<string, string, { arg: string }>) => {
			const entityCode = action.meta.arg;
			if (!state?.[entityCode]) return;
			state[entityCode].loading = false;
			state[entityCode].errorMessage = action.payload;
		},

		[createDependenciesList.fulfilled.type]: (state, action: PayloadAction<IDependenciesList, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loadingItem = false;
			state[action.meta.arg.entityCode].errorMessage = '';
			const entityCode = action.meta.arg.entityCode;
			state[entityCode].data = [...(state[entityCode]?.data || []), action.payload];
		},
		[createDependenciesList.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string } }>) => {
			const entityCode = action.meta.arg.entityCode;
			state[entityCode] ??= { loading: false, data: [], errorMessage: '', loadingItem: true } as DependenciesLists;
			state[action.meta.arg.entityCode].loadingItem = true;
			state[action.meta.arg.entityCode].errorMessage = '';
		},
		[createDependenciesList.rejected.type]: (state, action: PayloadAction<string, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loadingItem = false;
			state[action.meta.arg.entityCode].errorMessage = action.payload;
		},

		[updateDependenciesLists.pending.type]: (
			state,
			action: PayloadAction<unknown, string, { arg: { entityCode: string; data: IDependenciesList } }>,
		) => {
			const entityCode = action.meta.arg?.entityCode;
			const newValue = action.meta.arg?.data;
			state[entityCode].data = state[entityCode]?.data?.map((dependencies) => {
				if (dependencies?.id === newValue?.id) {
					return { ...dependencies, ...newValue };
				}
				return dependencies;
			});
		},

		[deleteDependenciesList.pending.type]: (state, action: PayloadAction<number, string, { arg: { entityCode: string; id: number } }>) => {
			const deleteId = action.meta.arg?.id;
			state[action.meta.arg.entityCode].data = state[action.meta.arg.entityCode].data.filter((dependencies) => dependencies.id !== deleteId);
		},
	},
});
export const { clearEntityDependenciesLists } = dependenciesReducer.actions;
export default dependenciesReducer.reducer;
