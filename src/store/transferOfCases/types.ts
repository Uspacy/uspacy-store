import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { ITransferOfCasesProgress } from '@uspacy/sdk/lib/models/transferOfCases';

export interface IState {
	openTransferOfCases: boolean;
	tasks: ITransferOfCasesProgress;
	groups: ITransferOfCasesProgress;
	activities: ITransferOfCasesProgress;
	crmEntities: ITransferOfCasesProgress;
	loadingTasksProgress: boolean;
	loadingGroupsProgress: boolean;
	loadingActivitiesProgress: boolean;
	loadingCrmEntitiesProgress: boolean;
	errorLoadingTasksProgress: IErrorsAxiosResponse;
	errorLoadingGroupsProgress: IErrorsAxiosResponse;
	errorLoadingActivitiesProgress: IErrorsAxiosResponse;
	errorLoadingCrmEntitiesProgress: IErrorsAxiosResponse;
}
