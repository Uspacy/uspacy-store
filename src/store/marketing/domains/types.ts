import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IDomain } from '@uspacy/sdk/lib/models/newsletters-domain';

export interface IState {
	items: IDomain[];
	item: IDomain;
	loadingItems: boolean;
	loadingItem: boolean;
	loadingCreating: boolean;
	loadingDeleting: boolean;
	errorLoadingItems: IErrorsAxiosResponse;
	errorLoadingItem: IErrorsAxiosResponse;
	errorLoadingCreating: IErrorsAxiosResponse;
	errorLoadingDeleting: IErrorsAxiosResponse;
}
