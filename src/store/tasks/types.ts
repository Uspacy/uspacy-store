import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IFields } from '@uspacy/sdk/lib/models/field';
import { IFilterTasks, IMeta, ITask, ITasks } from '@uspacy/sdk/lib/models/tasks';

export interface ITaskCardActions {
	mode: 'view' | 'add' | 'edit';
}

export interface IState {
	tasks: ITasks;
	recurringTasks: ITasks;
	oneTimeTasks: ITasks;
	subtasks: ITasks;
	allSubtasks: ITask[];
	task: ITask;
	parentTask: ITask;
	recurringTemplate: ITask;
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
	loadingReсurringTasks: boolean;
	loadingSubtasks: boolean;
	loadingTask: boolean;
	loadingRecurringTemplate: boolean;
	loadingParentTask: boolean;
	loadingAddingTask: boolean;
	loadingEditingTask: boolean;
	loadingDeletingTask: boolean;
	loadingStatusesTask: boolean;
	loadingTaskFields: boolean;
	errorLoadingTasks: IErrorsAxiosResponse;
	errorLoadingRecurringTasks: IErrorsAxiosResponse;
	errorLoadingSubtasks: IErrorsAxiosResponse;
	errorLoadingTask: IErrorsAxiosResponse;
	errorLoadingRecurringTemplate: IErrorsAxiosResponse;
	errorLoadingParentTask: IErrorsAxiosResponse;
	errorLoadingAddingTask: IErrorsAxiosResponse;
	errorLoadingEditingTask: IErrorsAxiosResponse;
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
