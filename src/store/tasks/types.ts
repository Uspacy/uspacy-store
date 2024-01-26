import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IFields } from '@uspacy/sdk/lib/models/field';
import { IFilterTasks, IMeta, ITask, ITasks } from '@uspacy/sdk/lib/models/tasks';

export interface ITaskCardActions {
	type: 'task' | 'recurring' | 'one_time';
	mode: 'view' | 'add' | 'edit';
}

export interface IState {
	tasks: ITasks;
	recurringTasks: ITasks;
	oneTimeTasks: ITasks;
	subtasks: ITasks;
	allSubtasks: ITask[];
	task: ITask;
	template: ITask;
	parentTask: ITask;
	taskFromTemplate: ITask;
	addedTask: ITask;
	addedToKanbanTask: ITask;
	changeTask: ITask;
	changeTasks: ITask[];
	deleteTaskId: number;
	deleteTaskIds: string[];
	deleteAllFromKanban: boolean;
	filters: IFilterTasks;
	regularFilter: IFilterTasks;
	taskFields: IFields;
	tasksCardPermissions: ITaskCardActions;
	isEditMode: boolean;
	loadingTasks: boolean;
	loadingReсurringTemplates: boolean;
	loadingSubtasks: boolean;
	loadingTask: boolean;
	loadingTemplate: boolean;
	loadingParentTask: boolean;
	loadingCreatingTask: boolean;
	loadingUpdatingTask: boolean;
	loadingDeletingTask: boolean;
	loadingStatusesTask: boolean;
	loadingTaskFields: boolean;
	errorLoadingTasks: IErrorsAxiosResponse;
	errorLoadingRecurringTemplates: IErrorsAxiosResponse;
	errorLoadingSubtasks: IErrorsAxiosResponse;
	errorLoadingTask: IErrorsAxiosResponse;
	errorLoadingTemplate: IErrorsAxiosResponse;
	errorLoadingParentTask: IErrorsAxiosResponse;
	errorLoadingCreatingTask: IErrorsAxiosResponse;
	errorLoadingUpdatingTask: IErrorsAxiosResponse;
	errorLoadingDeletingTask: IErrorsAxiosResponse;
	errorLoadingStatusesTask: IErrorsAxiosResponse;
	errorLoadingTaskFields: IErrorsAxiosResponse;
	meta: IMeta;
	recurringTemplatesMeta: IMeta;
	popupLinks: ITask[];
	isSubtasks: boolean;
	isCopyingTask: boolean;
	isKanban: boolean;
	isTable: boolean;
	taskStatus: string;
	isRegularSection: boolean;
}
