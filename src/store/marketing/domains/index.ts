import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IDomain } from '@uspacy/sdk/lib/models/newsletters-domain';

import { createDomain, deleteDomain, getDomain, getDomains, getDomainStatus } from './actions';
import { IState } from './types';

const initialState = {
	items: [],
	item: null,
	loadingItems: false,
	loadingItem: false,
	loadingCreating: false,
	loadingDeleting: false,
	errorLoadingItems: null,
	errorLoadingItem: null,
	errorLoadingCreating: null,
	errorLoadingDeleting: null,
} as IState;

const domainsReducer = createSlice({
	name: 'marketing/domains',
	initialState,
	reducers: {
		setDomains: (state, action: PayloadAction<IDomain[]>) => {
			state.items = action.payload;
		},
		setDomain: (state, action: PayloadAction<IDomain>) => {
			state.item = action.payload;
		},
	},
	extraReducers: {
		[getDomains.fulfilled.type]: (state, action: PayloadAction<IDomain[]>) => {
			state.items = action.payload;
			state.loadingItems = false;
			state.errorLoadingItems = null;
		},
		[getDomains.pending.type]: (state) => {
			state.loadingItems = true;
			state.errorLoadingItems = null;
		},
		[getDomains.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingItems = false;
			state.errorLoadingItems = action.payload;
		},

		[getDomain.fulfilled.type]: (state, action: PayloadAction<IDomain>) => {
			state.item = action.payload;
			state.loadingItem = false;
			state.errorLoadingItem = null;
		},
		[getDomain.pending.type]: (state) => {
			state.loadingItem = true;
			state.errorLoadingItem = null;
		},
		[getDomain.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingItem = false;
			state.errorLoadingItem = action.payload;
		},

		[getDomainStatus.fulfilled.type]: (state, action: PayloadAction<IDomain>) => {
			state.item = action.payload;
			state.loadingItem = false;
			state.errorLoadingItem = null;
		},
		[getDomainStatus.pending.type]: (state) => {
			state.loadingItem = true;
			state.errorLoadingItem = null;
		},
		[getDomainStatus.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingItem = false;
			state.errorLoadingItem = action.payload;
		},

		[createDomain.fulfilled.type]: (state, action: PayloadAction<IDomain>) => {
			state.items = [...state.items, action.payload];
			state.loadingCreating = false;
			state.errorLoadingCreating = null;
		},
		[createDomain.pending.type]: (state) => {
			state.loadingCreating = true;
			state.errorLoadingCreating = null;
		},
		[createDomain.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreating = false;
			state.errorLoadingCreating = action.payload;
		},

		[deleteDomain.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: number }>) => {
			state.items = state.items.filter((domain) => domain.id !== action.meta.arg);
			state.loadingDeleting = false;
			state.errorLoadingDeleting = null;
		},
		[deleteDomain.pending.type]: (state) => {
			state.loadingDeleting = true;
			state.errorLoadingDeleting = null;
		},
		[deleteDomain.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeleting = false;
			state.errorLoadingDeleting = action.payload;
		},
	},
});

export const { setDomains, setDomain } = domainsReducer.actions;
export default domainsReducer.reducer;
