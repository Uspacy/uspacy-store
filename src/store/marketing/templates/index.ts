import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEmailTemplate } from '@uspacy/sdk/lib/models/email-template';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

import { IMassActionsMarketingPayload } from '../types';
import {
	createEmailTemplate,
	deleteEmailTemplate,
	getEmailTemplate,
	getEmailTemplates,
	massDeletionEmailTemplates,
	massEditingEmailTemplates,
	updateEmailTemplate,
} from './actions';
import { IState } from './types';

const initialState = {
	items: {
		data: [],
		meta: null,
		aborted: false,
	},
	cards: [],
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

const templatesReducer = createSlice({
	name: 'marketing/templates',
	initialState,
	reducers: {
		clearEmailTemplates: (state) => {
			state.items = initialState.items;
		},
		setEmailTemplates: (state, action: PayloadAction<IResponseWithMeta<IEmailTemplate>>) => {
			state.items = action.payload;
		},
		setEmailTemplatesCards: (state, action: PayloadAction<IEmailTemplate[]>) => {
			state.cards = action.payload;
		},
		setEmailTemplate: (state, action: PayloadAction<IEmailTemplate>) => {
			state.item = action.payload;
		},
	},
	extraReducers: {
		[getEmailTemplates.fulfilled.type]: (state, action: PayloadAction<IResponseWithMeta<IEmailTemplate>>) => {
			state.items = action.payload;
			state.loadingItems = false;
			state.errorLoadingItems = null;
		},
		[getEmailTemplates.pending.type]: (state) => {
			state.loadingItems = true;
			state.errorLoadingItems = null;
		},
		[getEmailTemplates.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingItems = false;
			state.errorLoadingItems = action.payload;
		},

		[getEmailTemplate.fulfilled.type]: (state, action: PayloadAction<IEmailTemplate>) => {
			state.item = action.payload;
			state.loadingItem = false;
			state.errorLoadingItem = null;
		},
		[getEmailTemplate.pending.type]: (state) => {
			state.loadingItem = true;
			state.errorLoadingItem = null;
		},
		[getEmailTemplate.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingItem = false;
			state.errorLoadingItem = action.payload;
		},

		[createEmailTemplate.fulfilled.type]: (state, action: PayloadAction<IEmailTemplate>) => {
			if (state.items && state.items.data) {
				state.items.data.unshift(action.payload);
			}
			state.cards.unshift(action.payload);
			state.items.meta = {
				...state.items.meta,
				total: state.items.meta?.total + 1,
			};
			state.loadingCreating = false;
			state.errorLoadingCreating = null;
		},
		[createEmailTemplate.pending.type]: (state) => {
			state.loadingCreating = true;
			state.errorLoadingCreating = null;
		},
		[createEmailTemplate.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreating = false;
			state.errorLoadingCreating = action.payload;
		},

		[updateEmailTemplate.fulfilled.type]: (state, action: PayloadAction<IEmailTemplate>) => {
			if (state.items && state.items.data) {
				state.items.data = state.items.data.map((emailTemplate) => {
					return emailTemplate.id === action.payload.id ? action.payload : emailTemplate;
				});
			}
			state.cards = state.cards.map((emailTemplate) => {
				return emailTemplate.id === action.payload.id ? action.payload : emailTemplate;
			});
			state.loadingUpdating = false;
			state.errorLoadingUpdating = null;
		},
		[updateEmailTemplate.pending.type]: (state) => {
			state.loadingUpdating = true;
			state.errorLoadingUpdating = null;
		},
		[updateEmailTemplate.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdating = false;
			state.errorLoadingUpdating = action.payload;
		},

		[deleteEmailTemplate.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: { id: number } }>) => {
			const { id } = action.meta.arg;

			if (state.items && state.items.data) {
				state.items.data = state.items.data.filter((emailTemplate) => emailTemplate.id !== id);
				state.items.meta = {
					...state.items.meta,
					total: state.items.meta?.total - 1,
				};
			}
			state.cards = state.cards.filter((emailTemplate) => emailTemplate.id !== id);
			state.loadingDeleting = false;
			state.errorLoadingDeleting = null;
		},
		[deleteEmailTemplate.pending.type]: (state) => {
			state.loadingDeleting = true;
			state.errorLoadingDeleting = null;
		},
		[deleteEmailTemplate.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeleting = false;
			state.errorLoadingDeleting = action.payload;
		},

		[massEditingEmailTemplates.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: IMassActionsMarketingPayload }>) => {
			const { id, payload } = action.meta.arg;

			state.items.data = state.items.data.map((emailTemplate) => {
				if (id?.includes(emailTemplate.id)) {
					const copiedEmailTemplate = { ...emailTemplate };

					for (const key in payload) {
						if (payload.hasOwnProperty(key)) {
							if (Array.isArray(payload[key])) {
								copiedEmailTemplate[key] = Array.from(new Set([...copiedEmailTemplate[key], ...payload[key]]));
							}
						}
					}

					return copiedEmailTemplate;
				}
				return emailTemplate;
			});

			state.loadingUpdating = false;
			state.errorLoadingUpdating = null;
		},
		[massEditingEmailTemplates.pending.type]: (state) => {
			state.loadingUpdating = true;
			state.errorLoadingUpdating = null;
		},
		[massEditingEmailTemplates.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdating = false;
			state.errorLoadingUpdating = action.payload;
		},

		[massDeletionEmailTemplates.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: IMassActionsMarketingPayload }>) => {
			const { id } = action.meta.arg;

			state.items.data = state.items.data.filter((emailTemplate) => !id?.includes(emailTemplate.id));
			state.loadingDeleting = false;
			state.errorLoadingDeleting = null;
		},
		[massDeletionEmailTemplates.pending.type]: (state) => {
			state.loadingDeleting = true;
			state.errorLoadingDeleting = null;
		},
		[massDeletionEmailTemplates.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeleting = false;
			state.errorLoadingDeleting = action.payload;
		},
	},
});

export const { clearEmailTemplates, setEmailTemplates, setEmailTemplatesCards, setEmailTemplate } = templatesReducer.actions;
export default templatesReducer.reducer;
