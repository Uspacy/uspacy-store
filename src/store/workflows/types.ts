import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IWorkflow, IWorkflowFilter, IWorkflowsResponse } from '@uspacy/sdk/lib/models/workflows';

export interface IState {
	workflows: IWorkflowsResponse;
	filter: IWorkflowFilter;
	workflow: IWorkflow;
	loadingWorkflows: boolean;
	errorLoadingWorkflows: IErrorsAxiosResponse;
}
