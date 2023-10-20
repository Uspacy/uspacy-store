import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApp } from '@uspacy/sdk/lib/models/app';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

import { fetchAppById, fetchApps } from './actions';
import { IState } from './types';

const initialState = {
	data: [],
	meta: {},
	allApps: [],
	app: {},
	error: null,
	loading: true,
} as IState;

const appsReducer = createSlice({
	name: 'apps',
	initialState,
	reducers: {
		clearApps: (state) => {
			state.allApps = initialState.allApps;
		},
		clearApp: (state) => {
			state.app = initialState.app;
			state.error = initialState.error;
		},
		fillApp: (state, action: PayloadAction<IApp>) => {
			state.app = action.payload;
			state.loading = false;
		},
		handlerInstallAppForList: (state, action: PayloadAction<{ id: number; status: boolean }>) => {
			state.allApps = state.allApps.map((it) => (it.id === action.payload.id ? { ...it, installed: action.payload.status } : it));
		},
		handlerInstallApp: (state, action: PayloadAction<{ id: number; status: boolean }>) => {
			state.app = state.app.id === action.payload.id ? { ...state.app, installed: action.payload.status } : state.app;
		},
	},
	extraReducers: {
		[fetchApps.fulfilled.type]: (state, action: PayloadAction<IResponseWithMeta<IApp>>) => {
			state.loading = false;
			state.error = null;
			state.data = action.payload.data;
			state.meta = action.payload.meta;
			state.allApps = state.allApps.concat(action.payload.data);
		},
		[fetchApps.pending.type]: (state) => {
			state.loading = true;
			state.error = null;
		},
		[fetchApps.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loading = false;
			state.error = action.payload;
		},
		[fetchAppById.fulfilled.type]: (state, action: PayloadAction<IApp>) => {
			state.loading = false;
			state.error = null;
			state.app = action.payload;
		},
		[fetchAppById.pending.type]: (state) => {
			state.loading = true;
			state.error = null;
		},
		[fetchAppById.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loading = false;
			state.error = action.payload;
		},
	},
});

export const { clearApps, handlerInstallApp, handlerInstallAppForList, fillApp, clearApp } = appsReducer.actions;
export default appsReducer.reducer;
