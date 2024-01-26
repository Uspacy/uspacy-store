import { IErrors } from '@uspacy/sdk/lib/models/crm-errors';
import { IFunnel } from '@uspacy/sdk/lib/models/crm-funnel';

export interface IState {
	leadsFunnel: IFunnel[];
	leadsFunnelLoading: boolean;
	errorMessage: IErrors;
}
