import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEmailTemplate } from '@uspacy/sdk/lib/models/email-template';
import { IEmailTemplateFilter } from '@uspacy/sdk/lib/models/email-template-filter';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

import {
	createEmailTemplate,
	deleteEmailTemplate,
	getEmailTemplate,
	getEmailTemplates,
	massDeletionEmailTemplates,
	massEditingEmailTemplates,
	updateEmailTemplate,
} from './actions';
import { IMassActionsEmailTemplatesPayload, IState } from './types';

const initialState = {
	emailTemplates: {
		data: [],
		meta: null,
		aborted: false,
	},
	emailTemplatesCards: [],
	emailTemplate: null,
	emailTemplatesFilter: {
		page: 1,
		list: 20,
		sections: [],
		created_by: [],
		user_ids: [],
		created_at: [],
		updated_at: [],
		q: '',
		title: '',
		time_label_created_at: [],
		time_label_updated_at: [],
		certainDateOrPeriod: [],
		certainDateOrPeriod_created_at: [],
		certainDateOrPeriod_updated_at: [],
		openCalendar: false,
	},
	loadingEmailTemplates: false,
	loadingEmailTemplate: false,
	loadingCreatingEmailTemplate: false,
	loadingUpdatingEmailTemplate: false,
	loadingDeletingEmailTemplate: false,
	errorLoadingEmailTemplates: null,
	errorLoadingEmailTemplate: null,
	errorLoadingCreatingEmailTemplate: null,
	errorLoadingUpdatingEmailTemplate: null,
	errorLoadingDeletingEmailTemplate: null,
} as IState;

const marketingReducer = createSlice({
	name: 'marketingReducer',
	initialState,
	reducers: {
		clearEmailTemplates: (state) => {
			state.emailTemplates = initialState.emailTemplates;
		},
		clearEmailTemplatesFilter: (state) => {
			state.emailTemplatesFilter = initialState.emailTemplatesFilter;
		},
		setEmailTemplates: (state, action: PayloadAction<IResponseWithMeta<IEmailTemplate>>) => {
			state.emailTemplates = action.payload;
		},
		setEmailTemplatesCards: (state, action: PayloadAction<IEmailTemplate[]>) => {
			state.emailTemplatesCards = action.payload;
		},
		setEmailTemplate: (state, action: PayloadAction<IEmailTemplate>) => {
			state.emailTemplate = action.payload;
		},
		setEmailTemplatesFilter: (state, action: PayloadAction<IEmailTemplateFilter>) => {
			state.emailTemplatesFilter = action.payload;
		},
	},
	extraReducers: {
		[getEmailTemplates.fulfilled.type]: (state, action: PayloadAction<IResponseWithMeta<IEmailTemplate>>) => {
			state.emailTemplates = action.payload;
			state.loadingEmailTemplates = false;
			state.errorLoadingEmailTemplates = null;
		},
		[getEmailTemplates.pending.type]: (state) => {
			state.loadingEmailTemplates = true;
			state.errorLoadingEmailTemplates = null;
		},
		[getEmailTemplates.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingEmailTemplates = false;
			state.errorLoadingEmailTemplates = action.payload;
		},

		[getEmailTemplate.fulfilled.type]: (state, action: PayloadAction<IEmailTemplate>) => {
			state.emailTemplate = action.payload;
			state.loadingEmailTemplate = false;
			state.errorLoadingEmailTemplate = null;
		},
		[getEmailTemplate.pending.type]: (state) => {
			state.loadingEmailTemplate = true;
			state.errorLoadingEmailTemplate = null;
		},
		[getEmailTemplate.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingEmailTemplate = false;
			state.errorLoadingEmailTemplate = action.payload;
		},

		[createEmailTemplate.fulfilled.type]: (state, action: PayloadAction<IEmailTemplate>) => {
			state.emailTemplates.data.unshift(action.payload);
			state.emailTemplatesCards.unshift(action.payload);
			state.loadingCreatingEmailTemplate = false;
			state.errorLoadingCreatingEmailTemplate = null;
		},
		[createEmailTemplate.pending.type]: (state) => {
			state.loadingCreatingEmailTemplate = true;
			state.errorLoadingCreatingEmailTemplate = null;
		},
		[createEmailTemplate.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreatingEmailTemplate = false;
			state.errorLoadingCreatingEmailTemplate = action.payload;
		},

		[updateEmailTemplate.fulfilled.type]: (state, action: PayloadAction<IEmailTemplate>) => {
			state.emailTemplates.data = state.emailTemplates.data.map((emailTemplate) => {
				return emailTemplate.id === action.payload.id ? action.payload : emailTemplate;
			});
			state.emailTemplatesCards = state.emailTemplatesCards.map((emailTemplate) => {
				return emailTemplate.id === action.payload.id ? action.payload : emailTemplate;
			});
			state.loadingUpdatingEmailTemplate = false;
			state.errorLoadingUpdatingEmailTemplate = null;
		},
		[updateEmailTemplate.pending.type]: (state) => {
			state.loadingUpdatingEmailTemplate = true;
			state.errorLoadingUpdatingEmailTemplate = null;
		},
		[updateEmailTemplate.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingEmailTemplate = false;
			state.errorLoadingUpdatingEmailTemplate = action.payload;
		},

		[deleteEmailTemplate.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: { id: number } }>) => {
			const { id } = action.meta.arg;

			state.emailTemplates.data = state.emailTemplates.data.filter((emailTemplate) => emailTemplate.id !== id);
			state.emailTemplatesCards = state.emailTemplatesCards.filter((emailTemplate) => emailTemplate.id !== id);
			state.loadingDeletingEmailTemplate = false;
			state.errorLoadingDeletingEmailTemplate = null;
		},
		[deleteEmailTemplate.pending.type]: (state) => {
			state.loadingDeletingEmailTemplate = true;
			state.errorLoadingDeletingEmailTemplate = null;
		},
		[deleteEmailTemplate.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeletingEmailTemplate = false;
			state.errorLoadingDeletingEmailTemplate = action.payload;
		},

		[massEditingEmailTemplates.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: IMassActionsEmailTemplatesPayload }>) => {
			const { id, payload } = action.meta.arg;

			state.emailTemplates.data = state.emailTemplates.data.map((emailTemplate) => {
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

			state.loadingUpdatingEmailTemplate = false;
			state.errorLoadingUpdatingEmailTemplate = null;
		},
		[massEditingEmailTemplates.pending.type]: (state) => {
			state.loadingUpdatingEmailTemplate = true;
			state.errorLoadingUpdatingEmailTemplate = null;
		},
		[massEditingEmailTemplates.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingEmailTemplate = false;
			state.errorLoadingUpdatingEmailTemplate = action.payload;
		},

		[massDeletionEmailTemplates.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: IMassActionsEmailTemplatesPayload }>) => {
			const { id } = action.meta.arg;

			state.emailTemplates.data = state.emailTemplates.data.filter((emailTemplate) => !id?.includes(emailTemplate.id));
			state.loadingDeletingEmailTemplate = false;
			state.errorLoadingDeletingEmailTemplate = null;
		},
		[massDeletionEmailTemplates.pending.type]: (state) => {
			state.loadingDeletingEmailTemplate = true;
			state.errorLoadingDeletingEmailTemplate = null;
		},
		[massDeletionEmailTemplates.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeletingEmailTemplate = false;
			state.errorLoadingDeletingEmailTemplate = action.payload;
		},
	},
});

export const {
	clearEmailTemplates,
	clearEmailTemplatesFilter,
	setEmailTemplates,
	setEmailTemplatesCards,
	setEmailTemplate,
	setEmailTemplatesFilter,
} = marketingReducer.actions;
export default marketingReducer.reducer;
