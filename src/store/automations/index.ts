import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAutomation, IAutomationsResponse } from '@uspacy/sdk/lib/models/automations';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

import { deleteAutomation, fetchAutomations, toggleAutomation } from './actions';
import { IState } from './types';

const initialState = {
	automations: {
		data: [],
		meta: {},
	},
	automation: {},
	loadingAutomations: false,
	errorLoadingAutomations: null,
} as IState;

const automationsReducer = createSlice({
	name: 'automationsReducer',
	initialState,
	reducers: {
		addAutomationToEndTable: (state, action: PayloadAction<IAutomation>) => {
			state.automations.data.push(action.payload);
		},
		toggleActiveAutomation: (state, action: PayloadAction<number>) => {
			state.automations.data = state.automations.data.map((it) => (it.id === action.payload ? { ...it, active: !it.active } : it));
		},
		addAutomationToStartTable: (state, action: PayloadAction<IAutomation>) => {
			state.automations.data = [action.payload, ...state.automations.data];
			state.automations.meta.total = state.automations.meta.total + 1;
		},
	},
	extraReducers: {
		[fetchAutomations.fulfilled.type]: (state, action: PayloadAction<IAutomationsResponse>) => {
			state.loadingAutomations = false;
			state.errorLoadingAutomations = null;
			state.automations.data = action.payload.data;
			state.automations.meta = action.payload.meta;
		},
		[fetchAutomations.pending.type]: (state) => {
			state.loadingAutomations = true;
			state.errorLoadingAutomations = null;
		},
		[fetchAutomations.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingAutomations = false;
			state.errorLoadingAutomations = action.payload;
		},
		[deleteAutomation.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loadingAutomations = false;
			state.errorLoadingAutomations = null;
			state.automations.data = state.automations.data.filter((el) => el.portal_id !== action.payload);
			state.automations.meta.total = state.automations.meta.total - 1;
		},
		[deleteAutomation.pending.type]: (state) => {
			state.loadingAutomations = true;
			state.errorLoadingAutomations = null;
		},
		[deleteAutomation.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingAutomations = false;
			state.errorLoadingAutomations = action.payload;
		},
		[toggleAutomation.fulfilled.type]: (state) => {
			state.loadingAutomations = false;
			state.errorLoadingAutomations = null;
		},
		[toggleAutomation.pending.type]: (state) => {
			state.loadingAutomations = true;
			state.errorLoadingAutomations = null;
		},
		[toggleAutomation.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingAutomations = false;
			state.errorLoadingAutomations = action.payload;
		},
	},
});

export const { addAutomationToEndTable, toggleActiveAutomation, addAutomationToStartTable } = automationsReducer.actions;
export default automationsReducer.reducer;
