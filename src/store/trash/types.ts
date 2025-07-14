import { IEntity } from '@uspacy/sdk/lib/models/crm-entities';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { ITrashFilter } from '@uspacy/sdk/lib/models/trash-filter';

export interface IState {
	items: IEntity;
	filter: ITrashFilter;
	loadingItems: boolean;
	errorLoadingItems: IErrorsAxiosResponse;
}
