import { IEmailTemplate } from '@uspacy/sdk/lib/models/email-template';
import { ITemplateFilter } from '@uspacy/sdk/lib/models/email-template-filter';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

export interface IState {
	emailTemplates: IResponseWithMeta<IEmailTemplate>;
	emailTemplate: IEmailTemplate;
	emailTemplatesFilter: ITemplateFilter;
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
