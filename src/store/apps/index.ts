import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApp } from '@uspacy/sdk/lib/models/app';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

import { fetchApps } from './actions';
import { IState } from './types';

const initialState = {
	data: [],
	meta: {},
	errorMessage: '',
	loading: true,
} as IState;

const appsReducer = createSlice({
	name: 'apps',
	initialState,
	reducers: {
		clearApps: (state) => {
			state.data = initialState.data;
		},
		handlerInstallApp: (state, action: PayloadAction<{ id: number; status: boolean }>) => {
			state.data = state.data.map((it) => (it.id === action.payload.id ? { ...it, installed: action.payload.status } : it));
		},
	},
	extraReducers: {
		[fetchApps.fulfilled.type]: (state, action: PayloadAction<IResponseWithMeta<IApp>>) => {
			state.loading = false;
			state.errorMessage = '';
			state.data = action.payload.data;
			state.meta = action.payload.meta;
		},
		[fetchApps.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[fetchApps.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
	},
});

export const { clearApps, handlerInstallApp } = appsReducer.actions;
export default appsReducer.reducer;
