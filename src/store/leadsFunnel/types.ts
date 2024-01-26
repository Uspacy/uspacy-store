import { IFunnel } from '@uspacy/sdk/lib/models/crm-funnel';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

export interface IState {
	leadsFunnel: IFunnel[];
	leadsFunnelLoading: boolean;
	errorMessage: IErrorsAxiosResponse;
	modalViewMode: boolean;
}
