import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { ISender } from '@uspacy/sdk/lib/models/newsletters-sender';

import { createSender, deleteSender, getSender, getSenders, updateSender } from './actions';
import { IState } from './types';

const initialState = {
	items: [],
	item: null,
	loadingItems: false,
	loadingItem: false,
	loadingCreating: false,
	loadingUpdating: false,
	loadingDeleting: false,
	errorLoadingItems: null,
	errorLoadingItem: null,
	errorLoadingCreating: null,
	errorLoadingUpdating: null,
	errorLoadingDeleting: null,
} as IState;

const sendersReducer = createSlice({
	name: 'marketing/senders',
	initialState,
	reducers: {
		setSenders: (state, action: PayloadAction<ISender[]>) => {
			state.items = action.payload;
		},
		setSender: (state, action: PayloadAction<ISender>) => {
			state.item = action.payload;
		},
	},
	extraReducers: {
		[getSenders.fulfilled.type]: (state, action: PayloadAction<ISender[]>) => {
			state.items = action.payload;
			state.loadingItems = false;
			state.errorLoadingItems = null;
		},
		[getSenders.pending.type]: (state) => {
			state.loadingItems = true;
			state.errorLoadingItems = null;
		},
		[getSenders.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingItems = false;
			state.errorLoadingItems = action.payload;
		},

		[getSender.fulfilled.type]: (state, action: PayloadAction<ISender>) => {
			state.item = action.payload;
			state.loadingItem = false;
			state.errorLoadingItem = null;
		},
		[getSender.pending.type]: (state) => {
			state.loadingItem = true;
			state.errorLoadingItem = null;
		},
		[getSender.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingItem = false;
			state.errorLoadingItem = action.payload;
		},

		[createSender.fulfilled.type]: (state, action: PayloadAction<ISender>) => {
			state.items = [...state.items, action.payload];
			state.loadingCreating = false;
			state.errorLoadingCreating = null;
		},
		[createSender.pending.type]: (state) => {
			state.loadingCreating = true;
			state.errorLoadingCreating = null;
		},
		[createSender.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreating = false;
			state.errorLoadingCreating = action.payload;
		},

		[updateSender.fulfilled.type]: (state, action: PayloadAction<ISender>) => {
			state.items = state.items.map((sender) => {
				return sender.id === action.payload.id ? action.payload : sender;
			});
			if (state.item && state.item.id) {
				state.item = action.payload;
			}
			state.loadingUpdating = false;
			state.errorLoadingUpdating = null;
		},
		[updateSender.pending.type]: (state) => {
			state.loadingUpdating = true;
			state.errorLoadingUpdating = null;
		},
		[updateSender.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdating = false;
			state.errorLoadingUpdating = action.payload;
		},

		[deleteSender.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: number }>) => {
			state.items = state.items.filter((sender) => sender.id !== action.meta.arg);
			state.loadingDeleting = false;
			state.errorLoadingDeleting = null;
		},
		[deleteSender.pending.type]: (state) => {
			state.loadingDeleting = true;
			state.errorLoadingDeleting = null;
		},
		[deleteSender.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeleting = false;
			state.errorLoadingDeleting = action.payload;
		},
	},
});

export const { setSenders, setSender } = sendersReducer.actions;
export default sendersReducer.reducer;
