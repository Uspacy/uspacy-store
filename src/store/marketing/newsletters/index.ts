import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ENewsletterStatus, IEmailNewsletter } from '@uspacy/sdk/lib/models/email-newsletter';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

import { IMassActionsMarketingPayload } from '../types';
import {
	createEmailNewsletter,
	deleteEmailNewsletter,
	getEmailNewsletter,
	getEmailNewsletters,
	getEmailNewsletterStatistics,
	massDeletionEmailNewsletters,
	massSendingEmailNewsletters,
	sendEmailNewsletter,
	startEmailNewsletterMailings,
	updateEmailNewsletter,
} from './actions';
import { IState } from './types';

const initialState = {
	items: {
		data: [],
		meta: null,
		aborted: false,
	},
	item: null,
	loadingItems: false,
	loadingItem: false,
	loadingStatistics: false,
	loadingCreating: false,
	loadingUpdating: false,
	loadingDeleting: false,
	loadingSending: false,
	errorLoadingItems: null,
	errorLoadingItem: null,
	errorLoadingStatistics: null,
	errorLoadingCreating: null,
	errorLoadingUpdating: null,
	errorLoadingDeleting: null,
	errorLoadingSending: null,
} as IState;

const newslettersReducer = createSlice({
	name: 'marketing/newsletters',
	initialState,
	reducers: {
		clearEmailNewsletters: (state) => {
			state.items = initialState.items;
		},
		setEmailNewsletters: (state, action: PayloadAction<IResponseWithMeta<IEmailNewsletter>>) => {
			state.items = action.payload;
		},
		setEmailNewsletter: (state, action: PayloadAction<IEmailNewsletter>) => {
			state.item = action.payload;
		},
	},
	extraReducers: {
		[getEmailNewsletters.fulfilled.type]: (state, action: PayloadAction<IResponseWithMeta<IEmailNewsletter>>) => {
			state.items = action.payload;
			state.loadingItems = false;
			state.errorLoadingItems = null;
		},
		[getEmailNewsletters.pending.type]: (state) => {
			state.loadingItems = true;
			state.errorLoadingItems = null;
		},
		[getEmailNewsletters.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingItems = false;
			state.errorLoadingItems = action.payload;
		},

		[getEmailNewsletter.fulfilled.type]: (state, action: PayloadAction<IEmailNewsletter>) => {
			state.item = action.payload;
			state.loadingItem = false;
			state.errorLoadingItem = null;
		},
		[getEmailNewsletter.pending.type]: (state) => {
			state.loadingItem = true;
			state.errorLoadingItem = null;
		},
		[getEmailNewsletter.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingItem = false;
			state.errorLoadingItem = action.payload;
		},

		[getEmailNewsletterStatistics.fulfilled.type]: (state, action: PayloadAction<IEmailNewsletter>) => {
			state.item = { ...state.item, statistics: action.payload.statistics };
			state.loadingStatistics = false;
			state.errorLoadingStatistics = null;
		},
		[getEmailNewsletterStatistics.pending.type]: (state) => {
			state.loadingStatistics = true;
			state.errorLoadingStatistics = null;
		},
		[getEmailNewsletterStatistics.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingStatistics = false;
			state.errorLoadingStatistics = action.payload;
		},

		[createEmailNewsletter.fulfilled.type]: (state, action: PayloadAction<IEmailNewsletter>) => {
			if (state.items && state.items.data) {
				state.items.data.unshift(action.payload);
				state.items.meta = {
					...state.items.meta,
					total: state.items.meta?.total + 1,
				};
			}
			state.loadingCreating = false;
			state.errorLoadingCreating = null;
		},
		[createEmailNewsletter.pending.type]: (state) => {
			state.loadingCreating = true;
			state.errorLoadingCreating = null;
		},
		[createEmailNewsletter.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreating = false;
			state.errorLoadingCreating = action.payload;
		},

		[updateEmailNewsletter.fulfilled.type]: (state, action: PayloadAction<IEmailNewsletter>) => {
			if (state.items && state.items.data) {
				state.items.data = state.items.data.map((emailNewsletter) => {
					return emailNewsletter.id === action.payload.id ? action.payload : emailNewsletter;
				});
			}
			if (state.item && state.item.id) {
				state.item = { ...state.item, ...action.payload };
			}
			state.loadingUpdating = false;
			state.errorLoadingUpdating = null;
		},
		[updateEmailNewsletter.pending.type]: (state) => {
			state.loadingUpdating = true;
			state.errorLoadingUpdating = null;
		},
		[updateEmailNewsletter.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdating = false;
			state.errorLoadingUpdating = action.payload;
		},

		[deleteEmailNewsletter.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: number }>) => {
			if (state.items && state.items.data) {
				state.items.data = state.items.data.filter((emailNewsletter) => emailNewsletter.id !== action.meta.arg);
				state.items.meta = {
					...state.items.meta,
					total: state.items.meta?.total - 1,
				};
			}
			state.loadingDeleting = false;
			state.errorLoadingDeleting = null;
		},
		[deleteEmailNewsletter.pending.type]: (state) => {
			state.loadingDeleting = true;
			state.errorLoadingDeleting = null;
		},
		[deleteEmailNewsletter.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeleting = false;
			state.errorLoadingDeleting = action.payload;
		},

		[sendEmailNewsletter.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: number }>) => {
			state.items.data = state.items.data.map((emailNewsletter) => {
				return emailNewsletter.id === action.meta.arg ? { ...emailNewsletter, status: ENewsletterStatus.SENDING } : emailNewsletter;
			});
			if (state.item && state.item.id) {
				state.item = { ...state.item, status: ENewsletterStatus.SENDING };
			}
			state.loadingSending = false;
			state.errorLoadingSending = null;
		},
		[sendEmailNewsletter.pending.type]: (state) => {
			state.loadingSending = true;
			state.errorLoadingSending = null;
		},
		[sendEmailNewsletter.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingSending = false;
			state.errorLoadingSending = action.payload;
		},

		[startEmailNewsletterMailings.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: number }>) => {
			state.items.data = state.items.data.map((emailNewsletter) => {
				return emailNewsletter.id === action.meta.arg ? { ...emailNewsletter, status: ENewsletterStatus.SENDING } : emailNewsletter;
			});
			state.loadingSending = false;
			state.errorLoadingSending = null;
		},
		[startEmailNewsletterMailings.pending.type]: (state) => {
			state.loadingSending = true;
			state.errorLoadingSending = null;
		},
		[startEmailNewsletterMailings.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingSending = false;
			state.errorLoadingSending = action.payload;
		},

		[massSendingEmailNewsletters.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: IMassActionsMarketingPayload }>) => {
			const { id, payload } = action.meta.arg;

			state.items.data = state.items.data.map((emailNewsletter) => {
				if (id?.includes(emailNewsletter?.id)) {
					const copiedEmailNewsletter = { ...emailNewsletter };

					for (const key in payload) {
						if (payload.hasOwnProperty(key)) {
							if (Array.isArray(payload[key])) {
								copiedEmailNewsletter[key] = Array.from(new Set([...copiedEmailNewsletter[key], ...payload[key]]));
							}
						}
					}

					return copiedEmailNewsletter;
				}
				return emailNewsletter;
			});
			state.loadingSending = false;
			state.errorLoadingSending = null;
		},
		[massSendingEmailNewsletters.pending.type]: (state) => {
			state.loadingSending = true;
			state.errorLoadingSending = null;
		},
		[massSendingEmailNewsletters.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingSending = false;
			state.errorLoadingSending = action.payload;
		},

		[massDeletionEmailNewsletters.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: IMassActionsMarketingPayload }>) => {
			const { id } = action.meta.arg;

			state.items.data = state.items.data.filter((emailNewsletter) => !id?.includes(emailNewsletter?.id));
			state.loadingDeleting = false;
			state.errorLoadingDeleting = null;
		},
		[massDeletionEmailNewsletters.pending.type]: (state) => {
			state.loadingDeleting = true;
			state.errorLoadingDeleting = null;
		},
		[massDeletionEmailNewsletters.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeleting = false;
			state.errorLoadingDeleting = action.payload;
		},
	},
});

export const { clearEmailNewsletters, setEmailNewsletters, setEmailNewsletter } = newslettersReducer.actions;
export default newslettersReducer.reducer;
