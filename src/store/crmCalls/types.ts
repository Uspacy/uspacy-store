import { ICall, ICalls } from '@uspacy/sdk/lib/models/crm-calls';
import { ICallFilters } from '@uspacy/sdk/lib/models/crm-filters';

export interface IState {
	calls: ICalls;
	call: ICall;
	callFilter: ICallFilters;
	loading: boolean;
	loadingCallList: boolean;
	errorMessage: string;
}
