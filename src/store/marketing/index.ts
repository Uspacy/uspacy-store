import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ENewsletterStatus, IEmailNewsletter } from '@uspacy/sdk/lib/models/email-newsletter';
import { IEmailTemplate } from '@uspacy/sdk/lib/models/email-template';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IMarketingFilter } from '@uspacy/sdk/lib/models/marketing-filter';
import { IDomain } from '@uspacy/sdk/lib/models/newsletters-domain';
import { ISender } from '@uspacy/sdk/lib/models/newsletters-sender';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

import {
	createDomain,
	createEmailNewsletter,
	createEmailTemplate,
	createSender,
	deleteDomain,
	deleteEmailNewsletter,
	deleteEmailTemplate,
	deleteSender,
	getDomain,
	getDomains,
	getDomainStatus,
	getEmailNewsletter,
	getEmailNewsletters,
	getEmailNewsletterStatistics,
	getEmailTemplate,
	getEmailTemplates,
	getSender,
	getSenders,
	massDeletionEmailTemplates,
	massEditingEmailTemplates,
	sendEmailNewsletter,
	startEmailNewsletterMailings,
	updateEmailNewsletter,
	updateEmailTemplate,
	updateSender,
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
	marketingFilter: {
		page: 1,
		list: 20,
		sections: [],
		status: [],
		presets: [],
		next_run: [],
		created_by: [],
		user_ids: [],
		created_at: [],
		updated_at: [],
		q: '',
		title: '',
		time_label_created_at: [],
		time_label_updated_at: [],
		time_label_next_run: [],
		certainDateOrPeriod: [],
		certainDateOrPeriod_created_at: [],
		certainDateOrPeriod_updated_at: [],
		certainDateOrPeriod_next_run: [],
		openCalendar: false,
	},
	domains: [],
	domain: null,
	senders: [],
	sender: null,
	loadingEmailTemplates: false,
	loadingEmailTemplate: false,
	loadingCreatingEmailTemplate: false,
	loadingUpdatingEmailTemplate: false,
	loadingDeletingEmailTemplate: false,
	loadingEmailNewsletters: false,
	loadingEmailNewsletter: false,
	loadingEmailNewsletterStatistics: false,
	loadingCreatingEmailNewsletter: false,
	loadingUpdatingEmailNewsletter: false,
	loadingDeletingEmailNewsletter: false,
	loadingSendingEmailNewsletter: false,
	loadingDomains: false,
	loadingDomain: false,
	loadingCreatingDomain: false,
	loadingDeletingDomain: false,
	loadingSenders: false,
	loadingSender: false,
	loadingCreatingSender: false,
	loadingUpdatingSender: false,
	loadingDeletingSender: false,
	errorLoadingEmailTemplates: null,
	errorLoadingEmailTemplate: null,
	errorLoadingCreatingEmailTemplate: null,
	errorLoadingUpdatingEmailTemplate: null,
	errorLoadingDeletingEmailTemplate: null,
	errorLoadingEmailNewsletters: null,
	errorLoadingEmailNewsletter: null,
	errorLoadingEmailNewsletterStatistics: null,
	errorLoadingCreatingEmailNewsletter: null,
	errorLoadingUpdatingEmailNewsletter: null,
	errorLoadingDeletingEmailNewsletter: null,
	errorLoadingSendingEmailNewsletter: null,
	errorLoadingDomains: null,
	errorLoadingDomain: null,
	errorLoadingCreatingDomain: null,
	errorLoadingDeletingDomain: null,
	errorLoadingSenders: null,
	errorLoadingSender: null,
	errorLoadingCreatingSender: null,
	errorLoadingUpdatingSender: null,
	errorLoadingDeletingSender: null,
} as IState;

const marketingReducer = createSlice({
	name: 'marketingReducer',
	initialState,
	reducers: {
		clearEmailTemplates: (state) => {
			state.emailTemplates = initialState.emailTemplates;
		},
		clearMarketingFilter: (state) => {
			state.marketingFilter = initialState.marketingFilter;
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
		setEmailNewsletters: (state, action: PayloadAction<IResponseWithMeta<IEmailNewsletter>>) => {
			state.emailNewsletters = action.payload;
		},
		setEmailNewsletter: (state, action: PayloadAction<IEmailNewsletter>) => {
			state.emailNewsletter = action.payload;
		},
		setMarketingFilter: (state, action: PayloadAction<IMarketingFilter>) => {
			state.marketingFilter = action.payload;
		},
		setDomains: (state, action: PayloadAction<IDomain[]>) => {
			state.domains = action.payload;
		},
		setDomain: (state, action: PayloadAction<IDomain>) => {
			state.domain = action.payload;
		},
		setSenders: (state, action: PayloadAction<ISender[]>) => {
			state.senders = action.payload;
		},
		setSender: (state, action: PayloadAction<ISender>) => {
			state.sender = action.payload;
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
			state.emailTemplates.meta = {
				...state.emailTemplates.meta,
				total: state.emailTemplates.meta?.total + 1,
			};
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
			state.emailTemplates.meta = {
				...state.emailTemplates.meta,
				total: state.emailTemplates.meta?.total - 1,
			};
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

		[getEmailNewsletters.fulfilled.type]: (state, action: PayloadAction<IResponseWithMeta<IEmailNewsletter>>) => {
			state.emailNewsletters = action.payload;
			state.loadingEmailNewsletters = false;
			state.errorLoadingEmailNewsletters = null;
		},
		[getEmailNewsletters.pending.type]: (state) => {
			state.loadingEmailNewsletters = true;
			state.errorLoadingEmailNewsletters = null;
		},
		[getEmailNewsletters.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingEmailNewsletters = false;
			state.errorLoadingEmailNewsletters = action.payload;
		},

		[getEmailNewsletter.fulfilled.type]: (state, action: PayloadAction<IEmailNewsletter>) => {
			state.emailNewsletter = action.payload;
			state.loadingEmailNewsletter = false;
			state.errorLoadingEmailNewsletter = null;
		},
		[getEmailNewsletter.pending.type]: (state) => {
			state.loadingEmailNewsletter = true;
			state.errorLoadingEmailNewsletter = null;
		},
		[getEmailNewsletter.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingEmailNewsletter = false;
			state.errorLoadingEmailNewsletter = action.payload;
		},

		[getEmailNewsletterStatistics.fulfilled.type]: (state, action: PayloadAction<IEmailNewsletter>) => {
			state.emailNewsletter = { ...state.emailNewsletter, statistics: action.payload.statistics };
			state.loadingEmailNewsletterStatistics = false;
			state.errorLoadingEmailNewsletterStatistics = null;
		},
		[getEmailNewsletterStatistics.pending.type]: (state) => {
			state.loadingEmailNewsletterStatistics = true;
			state.errorLoadingEmailNewsletterStatistics = null;
		},
		[getEmailNewsletterStatistics.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingEmailNewsletterStatistics = false;
			state.errorLoadingEmailNewsletterStatistics = action.payload;
		},

		[createEmailNewsletter.fulfilled.type]: (state, action: PayloadAction<IEmailNewsletter>) => {
			state.emailNewsletters.data.unshift(action.payload);
			state.emailNewsletters.meta = {
				...state.emailNewsletters.meta,
				total: state.emailNewsletters.meta?.total + 1,
			};
			state.loadingCreatingEmailNewsletter = false;
			state.errorLoadingCreatingEmailNewsletter = null;
		},
		[createEmailNewsletter.pending.type]: (state) => {
			state.loadingCreatingEmailNewsletter = true;
			state.errorLoadingCreatingEmailNewsletter = null;
		},
		[createEmailNewsletter.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreatingEmailNewsletter = false;
			state.errorLoadingCreatingEmailNewsletter = action.payload;
		},

		[updateEmailNewsletter.fulfilled.type]: (state, action: PayloadAction<IEmailNewsletter>) => {
			state.emailNewsletters.data = state.emailNewsletters.data.map((emailNewsletter) => {
				return emailNewsletter.id === action.payload.id ? action.payload : emailNewsletter;
			});
			if (state.emailNewsletter && state.emailNewsletter.id) {
				state.emailNewsletter = { ...state.emailNewsletter, ...action.payload };
			}
			state.loadingUpdatingEmailNewsletter = false;
			state.errorLoadingUpdatingEmailNewsletter = null;
		},
		[updateEmailNewsletter.pending.type]: (state) => {
			state.loadingUpdatingEmailNewsletter = true;
			state.errorLoadingUpdatingEmailNewsletter = null;
		},
		[updateEmailNewsletter.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingEmailNewsletter = false;
			state.errorLoadingUpdatingEmailNewsletter = action.payload;
		},

		[deleteEmailNewsletter.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: number }>) => {
			state.emailNewsletters.data = state.emailNewsletters.data.filter((emailNewsletter) => emailNewsletter.id !== action.meta.arg);
			state.loadingDeletingEmailNewsletter = false;
			state.errorLoadingDeletingEmailNewsletter = null;
		},
		[deleteEmailNewsletter.pending.type]: (state) => {
			state.loadingDeletingEmailNewsletter = true;
			state.errorLoadingDeletingEmailNewsletter = null;
		},
		[deleteEmailNewsletter.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeletingEmailNewsletter = false;
			state.errorLoadingDeletingEmailNewsletter = action.payload;
		},

		[sendEmailNewsletter.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: number }>) => {
			state.emailNewsletters.data = state.emailNewsletters.data.map((emailNewsletter) => {
				return emailNewsletter.id === action.meta.arg ? { ...emailNewsletter, status: ENewsletterStatus.SENDING } : emailNewsletter;
			});
			state.loadingSendingEmailNewsletter = false;
			state.errorLoadingSendingEmailNewsletter = null;
		},
		[sendEmailNewsletter.pending.type]: (state) => {
			state.loadingSendingEmailNewsletter = true;
			state.errorLoadingSendingEmailNewsletter = null;
		},
		[sendEmailNewsletter.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingSendingEmailNewsletter = false;
			state.errorLoadingSendingEmailNewsletter = action.payload;
		},

		[startEmailNewsletterMailings.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: number }>) => {
			state.emailNewsletters.data = state.emailNewsletters.data.map((emailNewsletter) => {
				return emailNewsletter.id === action.meta.arg ? { ...emailNewsletter, status: ENewsletterStatus.SENDING } : emailNewsletter;
			});
			state.loadingSendingEmailNewsletter = false;
			state.errorLoadingSendingEmailNewsletter = null;
		},
		[startEmailNewsletterMailings.pending.type]: (state) => {
			state.loadingSendingEmailNewsletter = true;
			state.errorLoadingSendingEmailNewsletter = null;
		},
		[startEmailNewsletterMailings.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingSendingEmailNewsletter = false;
			state.errorLoadingSendingEmailNewsletter = action.payload;
		},

		[getDomains.fulfilled.type]: (state, action: PayloadAction<IDomain[]>) => {
			state.domains = action.payload;
			state.loadingDomains = false;
			state.errorLoadingDomains = null;
		},
		[getDomains.pending.type]: (state) => {
			state.loadingDomains = true;
			state.errorLoadingDomains = null;
		},
		[getDomains.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDomains = false;
			state.errorLoadingDomains = action.payload;
		},

		[getDomain.fulfilled.type]: (state, action: PayloadAction<IDomain>) => {
			state.domain = action.payload;
			state.loadingDomain = false;
			state.errorLoadingDomain = null;
		},
		[getDomain.pending.type]: (state) => {
			state.loadingDomain = true;
			state.errorLoadingDomain = null;
		},
		[getDomain.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDomain = false;
			state.errorLoadingDomain = action.payload;
		},

		[getDomainStatus.fulfilled.type]: (state, action: PayloadAction<IDomain>) => {
			state.domain = action.payload;
			state.loadingDomain = false;
			state.errorLoadingDomain = null;
		},
		[getDomainStatus.pending.type]: (state) => {
			state.loadingDomain = true;
			state.errorLoadingDomain = null;
		},
		[getDomainStatus.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDomain = false;
			state.errorLoadingDomain = action.payload;
		},

		[createDomain.fulfilled.type]: (state, action: PayloadAction<IDomain>) => {
			state.domains = [...state.domains, action.payload];
			state.loadingCreatingDomain = false;
			state.errorLoadingCreatingDomain = null;
		},
		[createDomain.pending.type]: (state) => {
			state.loadingCreatingDomain = true;
			state.errorLoadingCreatingDomain = null;
		},
		[createDomain.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreatingDomain = false;
			state.errorLoadingCreatingDomain = action.payload;
		},

		[deleteDomain.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: number }>) => {
			state.domains = state.domains.filter((domain) => domain.id !== action.meta.arg);
			state.loadingDeletingDomain = false;
			state.errorLoadingDeletingDomain = null;
		},
		[deleteDomain.pending.type]: (state) => {
			state.loadingDeletingDomain = true;
			state.errorLoadingDeletingDomain = null;
		},
		[deleteDomain.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeletingDomain = false;
			state.errorLoadingDeletingDomain = action.payload;
		},

		[getSenders.fulfilled.type]: (state, action: PayloadAction<ISender[]>) => {
			state.senders = action.payload;
			state.loadingSenders = false;
			state.errorLoadingSenders = null;
		},
		[getSenders.pending.type]: (state) => {
			state.loadingSenders = true;
			state.errorLoadingSenders = null;
		},
		[getSenders.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingSenders = false;
			state.errorLoadingSenders = action.payload;
		},

		[getSender.fulfilled.type]: (state, action: PayloadAction<ISender>) => {
			state.sender = action.payload;
			state.loadingSender = false;
			state.errorLoadingSender = null;
		},
		[getSender.pending.type]: (state) => {
			state.loadingSender = true;
			state.errorLoadingSender = null;
		},
		[getSender.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingSender = false;
			state.errorLoadingSender = action.payload;
		},

		[createSender.fulfilled.type]: (state, action: PayloadAction<ISender>) => {
			state.senders = [...state.senders, action.payload];
			state.loadingCreatingSender = false;
			state.errorLoadingCreatingSender = null;
		},
		[createSender.pending.type]: (state) => {
			state.loadingCreatingSender = true;
			state.errorLoadingCreatingSender = null;
		},
		[createSender.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreatingSender = false;
			state.errorLoadingCreatingSender = action.payload;
		},

		[updateSender.fulfilled.type]: (state, action: PayloadAction<ISender>) => {
			state.senders = state.senders.map((sender) => {
				return sender.id === action.payload.id ? action.payload : sender;
			});
			if (state.sender && state.sender.id) {
				state.sender = action.payload;
			}
			state.loadingUpdatingSender = false;
			state.errorLoadingUpdatingSender = null;
		},
		[updateSender.pending.type]: (state) => {
			state.loadingUpdatingSender = true;
			state.errorLoadingUpdatingSender = null;
		},
		[updateSender.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingSender = false;
			state.errorLoadingUpdatingSender = action.payload;
		},

		[deleteSender.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: number }>) => {
			state.senders = state.senders.filter((sender) => sender.id !== action.meta.arg);
			state.loadingDeletingSender = false;
			state.errorLoadingDeletingSender = null;
		},
		[deleteSender.pending.type]: (state) => {
			state.loadingDeletingSender = true;
			state.errorLoadingDeletingSender = null;
		},
		[deleteSender.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeletingSender = false;
			state.errorLoadingDeletingSender = action.payload;
		},
	},
});

export const {
	clearEmailTemplates,
	clearMarketingFilter,
	setEmailTemplates,
	setEmailTemplatesCards,
	setEmailTemplate,
	setEmailNewsletters,
	setEmailNewsletter,
	setMarketingFilter,
	setDomains,
	setDomain,
	setSenders,
	setSender,
} = marketingReducer.actions;
export default marketingReducer.reducer;
