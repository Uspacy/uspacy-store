import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IFields } from '@uspacy/sdk/lib/models/field';
import { IFilterRegularTasks, IFilterTasks, IMeta, ITask, ITasks } from '@uspacy/sdk/lib/models/tasks';

export interface ITaskCardActions {
	mode: 'view' | 'add' | 'edit';
}

export interface IState {
	tasks: ITasks;
	regularTasks: ITasks;
	subtasks: ITasks;
	allSubtasks: ITask[];
	task: ITask;
	parentTask: ITask;
	template: ITask;
	addedTask: ITask;
	changeTask: ITask;
	changeTasks: ITask[];
	deleteTaskId: number;
	deleteTaskIds: string[];
	deleteAllFromKanban: boolean;
	filters: IFilterTasks;
	regularFilter: IFilterRegularTasks;
	taskFields: IFields;
	tasksCardPermissions: ITaskCardActions;
	isEditMode: boolean;
	loadingTasks: boolean;
	loadingRegularTasks: boolean;
	loadingSubtasks: boolean;
	loadingTask: boolean;
	loadingParentTask: boolean;
	loadingTemplate: boolean;
	loadingAddingTask: boolean;
	loadingEditingTask: boolean;
	loadingDeletingTask: boolean;
	loadingStatusesTask: boolean;
	loadingTaskFields: boolean;
	errorLoadingTasks: IErrorsAxiosResponse;
	errorLoadingSchedulerTasks: IErrorsAxiosResponse;
	errorLoadingSubtasks: IErrorsAxiosResponse;
	errorLoadingTask: IErrorsAxiosResponse;
	errorLoadingParentTask: IErrorsAxiosResponse;
	errorLoadingTemplate: IErrorsAxiosResponse;
	errorLoadingAddingTask: IErrorsAxiosResponse;
	errorLoadingEditingTask: IErrorsAxiosResponse;
	errorLoadingDeletingTask: IErrorsAxiosResponse;
	errorLoadingStatusesTask: IErrorsAxiosResponse;
	errorLoadingTaskFields: IErrorsAxiosResponse;
	meta: IMeta;
	regularTasksMeta: IMeta;
	popupLinks: ITask[];
	isSubtasks: boolean;
	isCopyingTask: boolean;
	isKanban: boolean;
	isTable: boolean;
	taskStatus: string;
	isRegularSection: boolean;
}
