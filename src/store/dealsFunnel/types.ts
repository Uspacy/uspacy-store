import { IFunnel } from '@uspacy/sdk/lib/models/crm-deals-funnel';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

export interface IState {
	dealsFunnel: IFunnel[];
	dealsFunnelLoading: boolean;
	errorMessage: IErrorsAxiosResponse;
	modalViewMode: boolean;
}
