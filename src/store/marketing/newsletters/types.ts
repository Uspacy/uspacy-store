import { IEmailNewsletter } from '@uspacy/sdk/lib/models/email-newsletter';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

export interface IState {
	items: IResponseWithMeta<IEmailNewsletter>;
	item: IEmailNewsletter;
	loadingItems: boolean;
	loadingItem: boolean;
	loadingStatistics: boolean;
	loadingCreating: boolean;
	loadingUpdating: boolean;
	loadingDeleting: boolean;
	loadingSending: boolean;
	errorLoadingItems: IErrorsAxiosResponse;
	errorLoadingItem: IErrorsAxiosResponse;
	errorLoadingStatistics: IErrorsAxiosResponse;
	errorLoadingCreating: IErrorsAxiosResponse;
	errorLoadingUpdating: IErrorsAxiosResponse;
	errorLoadingDeleting: IErrorsAxiosResponse;
	errorLoadingSending: IErrorsAxiosResponse;
}
