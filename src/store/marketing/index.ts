import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEmailTemplate } from '@uspacy/sdk/lib/models/email-template';
import { ITemplateFilter } from '@uspacy/sdk/lib/models/email-template-filter';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

import { createEmailTemplate, deleteEmailTemplate, getEmailTemplate, getEmailTemplates, updateEmailTemplate } from './actions';
import { IState } from './types';

const initialState = {
	emailTemplates: {
		data: [],
		meta: null,
		aborted: false,
	},
	emailTemplate: null,
	emailTemplatesFilter: {
		sections: [],
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
		setEmailTemplatesData: (state, action: PayloadAction<IResponseWithMeta<IEmailTemplate>>) => {
			state.emailTemplates.data = action.payload.data;
		},
		setEmailTemplate: (state, action: PayloadAction<IEmailTemplate>) => {
			state.emailTemplate = action.payload;
		},
		setEmailTemplatesFilter: (state, action: PayloadAction<ITemplateFilter>) => {
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
			state.emailTemplates.data = state.emailTemplates.data.map((emailTemplate) =>
				emailTemplate.id === action.payload.id ? action.payload : emailTemplate,
			);
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
	},
});

export const { clearEmailTemplates, setEmailTemplatesData, setEmailTemplate, setEmailTemplatesFilter } = marketingReducer.actions;
export default marketingReducer.reducer;
