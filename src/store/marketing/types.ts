import { IEmailTemplate } from '@uspacy/sdk/lib/models/email-template';
import { IEmailTemplateFilter } from '@uspacy/sdk/lib/models/email-template-filter';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
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
	loadingEmailTemplates: boolean;
	loadingEmailTemplate: boolean;
	loadingCreatingEmailTemplate: boolean;
	loadingUpdatingEmailTemplate: boolean;
	loadingDeletingEmailTemplate: boolean;
	errorLoadingEmailTemplates: IErrorsAxiosResponse;
	errorLoadingEmailTemplate: IErrorsAxiosResponse;
	errorLoadingCreatingEmailTemplate: IErrorsAxiosResponse;
	errorLoadingUpdatingEmailTemplate: IErrorsAxiosResponse;
	errorLoadingDeletingEmailTemplate: IErrorsAxiosResponse;
}
