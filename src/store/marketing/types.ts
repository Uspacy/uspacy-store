import { IEmailTemplate } from '@uspacy/sdk/lib/models/email-template';
import { IEmailTemplateFilter } from '@uspacy/sdk/lib/models/email-template-filter';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IDomain } from '@uspacy/sdk/lib/models/newsletters-domain';
import { ISender } from '@uspacy/sdk/lib/models/newsletters-sender';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

export interface IMassActionsEmailTemplatesPayload {
	id: number[];
	payload?: Partial<IEmailTemplate>;
	all?: boolean;
	params?: Partial<IEmailTemplateFilter>;
}

export interface IState {
	emailTemplates: IResponseWithMeta<IEmailTemplate>;
	emailTemplatesCards: IEmailTemplate[];
	emailTemplate: IEmailTemplate;
	emailTemplatesFilter: IEmailTemplateFilter;
	domains: IDomain[];
	domain: IDomain;
	domainStatus: IDomain;
	senders: ISender[];
	sender: ISender;
	loadingEmailTemplates: boolean;
	loadingEmailTemplate: boolean;
	loadingCreatingEmailTemplate: boolean;
	loadingUpdatingEmailTemplate: boolean;
	loadingDeletingEmailTemplate: boolean;
	loadingDomains: boolean;
	loadingDomain: boolean;
	loadingCreatingDomain: boolean;
	loadingDeletingDomain: boolean;
	loadingSenders: boolean;
	loadingSender: boolean;
	loadingCreatingSender: boolean;
	loadingUpdatingSender: boolean;
	loadingDeletingSender: boolean;
	errorLoadingEmailTemplates: IErrorsAxiosResponse;
	errorLoadingEmailTemplate: IErrorsAxiosResponse;
	errorLoadingCreatingEmailTemplate: IErrorsAxiosResponse;
	errorLoadingUpdatingEmailTemplate: IErrorsAxiosResponse;
	errorLoadingDeletingEmailTemplate: IErrorsAxiosResponse;
	errorLoadingDomains: IErrorsAxiosResponse;
	errorLoadingDomain: IErrorsAxiosResponse;
	errorLoadingCreatingDomain: IErrorsAxiosResponse;
	errorLoadingDeletingDomain: IErrorsAxiosResponse;
	errorLoadingSenders: IErrorsAxiosResponse;
	errorLoadingSender: IErrorsAxiosResponse;
	errorLoadingCreatingSender: IErrorsAxiosResponse;
	errorLoadingUpdatingSender: IErrorsAxiosResponse;
	errorLoadingDeletingSender: IErrorsAxiosResponse;
}
