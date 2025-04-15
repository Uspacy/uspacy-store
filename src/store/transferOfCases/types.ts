import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { ITransferOfCasesProgress } from '@uspacy/sdk/lib/models/transferOfCases';

export interface IDataForTransferOfCases {
	open: boolean;
	expand: boolean;
	userId: number;
	isCasesTransfered: boolean;
}

export interface IState {
	dataForTransferOfCases: IDataForTransferOfCases;
	transferProgress: {
		tasks: ITransferOfCasesProgress;
		groups: ITransferOfCasesProgress;
		activities: ITransferOfCasesProgress;
		crmEntities: ITransferOfCasesProgress;
	};
	loadingTasksProgress: boolean;
	loadingGroupsProgress: boolean;
	loadingActivitiesProgress: boolean;
	loadingCrmEntitiesProgress: boolean;
	errorLoadingTasksProgress: IErrorsAxiosResponse;
	errorLoadingGroupsProgress: IErrorsAxiosResponse;
	errorLoadingActivitiesProgress: IErrorsAxiosResponse;
	errorLoadingCrmEntitiesProgress: IErrorsAxiosResponse;
}
