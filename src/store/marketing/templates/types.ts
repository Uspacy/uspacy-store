import { IEmailTemplate } from '@uspacy/sdk/lib/models/email-template';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

export interface IState {
	items: IResponseWithMeta<IEmailTemplate>;
	cards: IEmailTemplate[];
	item: IEmailTemplate;
	loadingItems: boolean;
	loadingItem: boolean;
	loadingCreating: boolean;
	loadingUpdating: boolean;
	loadingDeleting: boolean;
	errorLoadingItems: IErrorsAxiosResponse;
	errorLoadingItem: IErrorsAxiosResponse;
	errorLoadingCreating: IErrorsAxiosResponse;
	errorLoadingUpdating: IErrorsAxiosResponse;
	errorLoadingDeleting: IErrorsAxiosResponse;
}
