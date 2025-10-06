import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { ISender } from '@uspacy/sdk/lib/models/newsletters-sender';

export interface IState {
	items: ISender[];
	item: ISender;
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
