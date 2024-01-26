import { IEntityMain } from '@uspacy/sdk/lib/models/crm-entities';
import { IFunnel } from '@uspacy/sdk/lib/models/crm-funnel';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

export interface IState {
	loading: boolean;
	entities: IEntityMain;
	errorMessage: IErrorsAxiosResponse;
	funnels: IFunnel[];
}
