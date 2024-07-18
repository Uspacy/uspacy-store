import { ICouchItemData } from '@uspacy/sdk/lib/models/couchdb';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { ITableSettings } from '@uspacy/sdk/lib/models/task-settings';

export interface IState {
	tasksSettings: ICouchItemData<ITableSettings>;
	loadingTasksSettings: boolean;
	loadingCreateTasksSettings: boolean;
	loadingUpdateTasksSettings: boolean;
	errorLoadingTasksSettings: IErrorsAxiosResponse;
	errorLoadingCreateTasksSettings: IErrorsAxiosResponse;
	errorLoadingUpdateTasksSettings: IErrorsAxiosResponse;
}
