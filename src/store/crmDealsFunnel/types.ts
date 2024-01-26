import { IErrors } from '@uspacy/sdk/lib/models/crm-errors';
import { IFunnel } from '@uspacy/sdk/lib/models/crm-funnel';

export interface IState {
	dealsFunnel: IFunnel[];
	dealsFunnelLoading: boolean;
	errorMessage: IErrors;
	modalViewMode: boolean;
}
