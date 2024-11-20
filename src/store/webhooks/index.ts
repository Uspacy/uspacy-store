import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IWebhook, IWebhooksResponse } from '@uspacy/sdk/lib/models/webhooks';

import { createWebhook, deleteSelectedWebhooks, deleteWebhook, fetchWebhooks, repeatWebhook, toggleWebhook } from './actions';
import { IMode, IState } from './types';

const initialState = {
	webhooks: {},
	webhook: {},
	modalModes: { create: false, edit: false, copy: false, isIncoming: false },
	isModalOpen: false,
	loadingWebhooks: false,
	errorLoadingErrors: null,
} as IState;

const webhooksReducer = createSlice({
	name: 'webhooksReducer',
	initialState,
	reducers: {
		setModalMode: (state, action: PayloadAction<IMode>) => {
			state.modalModes = action.payload;
		},

		setModalOpen: (state, action: PayloadAction<boolean>) => {
			state.isModalOpen = action.payload;
		},

		getCopyWebhook: (state, action: PayloadAction<number>) => {
			state.webhook = state.webhooks.data.find((it) => it.id === action.payload);
		},

		addWebhookToEndTable: (state, action: PayloadAction<IWebhook>) => {
			state.webhooks.data.push(action.payload);
		},
		deleteLastElementTable: (state) => {
			state.webhooks.data = state.webhooks.data.slice(0, -1);
		},
	},
	extraReducers: {
		[fetchWebhooks.fulfilled.type]: (state, action: PayloadAction<IWebhooksResponse>) => {
			state.loadingWebhooks = false;
			state.errorLoadingErrors = null;
			state.webhooks.data = action.payload.data;
			state.webhooks.meta = action.payload.meta;
		},
		[fetchWebhooks.pending.type]: (state) => {
			state.loadingWebhooks = true;
			state.errorLoadingErrors = null;
		},
		[fetchWebhooks.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingWebhooks = false;
			state.errorLoadingErrors = action.payload;
		},
		[createWebhook.fulfilled.type]: (state, action: PayloadAction<IWebhook>) => {
			state.loadingWebhooks = false;
			state.errorLoadingErrors = null;
			state.webhooks.data.unshift(action.payload);
			state.webhooks.meta.total = state.webhooks.meta.total + 1;
		},
		[createWebhook.pending.type]: (state) => {
			state.loadingWebhooks = true;
			state.errorLoadingErrors = null;
		},
		[createWebhook.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingWebhooks = false;
			state.errorLoadingErrors = action.payload;
		},
		[deleteWebhook.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loadingWebhooks = false;
			state.errorLoadingErrors = null;
			state.webhooks.data = state.webhooks.data.filter((el) => el.id !== action.payload);
			state.webhooks.meta.total = state.webhooks.meta.total - 1;
		},
		[deleteWebhook.pending.type]: (state) => {
			state.loadingWebhooks = true;
			state.errorLoadingErrors = null;
		},
		[deleteWebhook.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingWebhooks = false;
			state.errorLoadingErrors = action.payload;
		},
		[toggleWebhook.fulfilled.type]: (state) => {
			state.loadingWebhooks = false;
			state.errorLoadingErrors = null;
		},
		[toggleWebhook.pending.type]: (state) => {
			state.loadingWebhooks = true;
			state.errorLoadingErrors = null;
		},
		[toggleWebhook.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingWebhooks = false;
			state.errorLoadingErrors = action.payload;
		},
		[repeatWebhook.fulfilled.type]: (state) => {
			state.loadingWebhooks = false;
			state.errorLoadingErrors = null;
		},
		[repeatWebhook.pending.type]: (state) => {
			state.loadingWebhooks = true;
			state.errorLoadingErrors = null;
		},
		[repeatWebhook.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingWebhooks = false;
			state.errorLoadingErrors = action.payload;
		},
		[deleteSelectedWebhooks.fulfilled.type]: (state, action: PayloadAction<number[]>) => {
			state.loadingWebhooks = false;
			state.errorLoadingErrors = null;
			state.webhooks.data = state.webhooks.data.filter((el) => !action.payload.includes(el.id));
		},
		[deleteSelectedWebhooks.pending.type]: (state) => {
			state.loadingWebhooks = true;
			state.errorLoadingErrors = null;
		},
		[deleteSelectedWebhooks.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingWebhooks = false;
			state.errorLoadingErrors = action.payload;
		},
	},
});

export const { setModalMode, setModalOpen, getCopyWebhook, addWebhookToEndTable, deleteLastElementTable } = webhooksReducer.actions;
export default webhooksReducer.reducer;
