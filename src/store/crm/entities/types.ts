import { IEntityMainData } from '@uspacy/sdk/lib/models/crm-entities';
import { IErrors } from '@uspacy/sdk/lib/models/crm-errors';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

export interface IState {
	loading: boolean;
	items?: IResponseWithMeta<IEntityMainData>;
	itemsWithFunnels?: IResponseWithMeta<IEntityMainData>;
	errorMessage?: IErrors;
}
