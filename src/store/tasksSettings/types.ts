import { ICouchQueryResponse } from '@uspacy/sdk/lib/models/couchdb';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { ITasksColumnSettings } from '@uspacy/sdk/lib/models/tasks-settings';

export interface IState {
	tasksSettings: ICouchQueryResponse<ITasksColumnSettings>;
	loadingTasksSettings: boolean;
	loadingCreateTasksSettings: boolean;
	loadingUpdateTasksSettings: boolean;
	errorLoadingTasksSettings: IErrorsAxiosResponse;
	errorLoadingCreateTasksSettings: IErrorsAxiosResponse;
	errorLoadingUpdateTasksSettings: IErrorsAxiosResponse;
}
