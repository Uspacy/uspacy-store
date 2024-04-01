import { IAutomation, IAutomationsResponse } from '@uspacy/sdk/lib/models/automations';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

export interface IState {
	automations: IAutomationsResponse;
	automation: IAutomation;
	loadingAutomations: boolean;
	errorLoadingAutomations: IErrorsAxiosResponse;
}
