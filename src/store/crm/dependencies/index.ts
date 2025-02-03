import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDependenciesList } from '@uspacy/sdk/lib/models/dependencies-list';

import { createDependenciesList, deleteDependenciesList, fetchDependenciesLists, updateDependenciesLists } from './actions';
import { IState } from './types';

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
		[fetchDependenciesLists.fulfilled.type]: (
			state,
			action: PayloadAction<IDependenciesList[], string, { arg: { entityCode: string } }>,
		) => {
			state[action.meta.arg.entityCode].loading = false;
			state[action.meta.arg.entityCode].errorMessage = '';
			state[action.meta.arg.entityCode].data = action.payload;
		},
		[fetchDependenciesLists.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string } }>) => {
			console.log(action, 'action');
			const entityCode = action.meta.arg;
			console.log(entityCode, 'entityCode');
			console.log(action.payload, 'action.payload');
			state[action.meta.arg.entityCode].loading = true;
			state[action.meta.arg.entityCode].errorMessage = '';
		},
		[fetchDependenciesLists.rejected.type]: (state, action: PayloadAction<string, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loading = false;
			state[action.meta.arg.entityCode].errorMessage = action.payload;
		},

		[createDependenciesList.fulfilled.type]: (
			state,
			action: PayloadAction<{ data: IDependenciesList }, string, { arg: { entityCode: string } }>,
		) => {
			state[action.meta.arg.entityCode].loading = false;
			state[action.meta.arg.entityCode].errorMessage = '';
			const entityCode = action.meta.arg.entityCode;
			state[entityCode].data = [...(state[entityCode]?.data || []), action.payload.data];
		},
		[createDependenciesList.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loading = true;
			state[action.meta.arg.entityCode].errorMessage = '';
		},
		[createDependenciesList.rejected.type]: (state, action: PayloadAction<string, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loading = false;
			state[action.meta.arg.entityCode].errorMessage = action.payload;
		},

		[updateDependenciesLists.fulfilled.type]: (
			state,
			action: PayloadAction<{ data: IDependenciesList }, string, { arg: { entityCode: string } }>,
		) => {
			state[action.meta.arg.entityCode].loading = false;
			state[action.meta.arg.entityCode].errorMessage = '';

			const entityCode = action.meta.arg.entityCode;
			state[entityCode].data = state[entityCode].data.map((dependencies) => {
				if (dependencies.id === action.payload.data.id) {
					return { ...dependencies, ...action.payload.data };
				}
				return dependencies;
			});
		},
		[updateDependenciesLists.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loading = true;
			state[action.meta.arg.entityCode].errorMessage = '';
		},
		[updateDependenciesLists.rejected.type]: (state, action: PayloadAction<string, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loading = false;
			state[action.meta.arg.entityCode].errorMessage = action.payload;
		},

		[deleteDependenciesList.pending.type]: (state, action: PayloadAction<number, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].data = state[action.meta.arg.entityCode].data.filter(
				(dependencies) => dependencies.id !== action.payload,
			);
		},
	},
});
export const { clearEntityDependenciesLists } = dependenciesReducer.actions;
export default dependenciesReducer.reducer;
