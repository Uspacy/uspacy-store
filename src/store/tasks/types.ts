import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IFields } from '@uspacy/sdk/lib/models/field';
import { IFilterTasks, IMeta, ITask, ITasks, taskType } from '@uspacy/sdk/lib/models/tasks';
import { ITaskValues } from '@uspacy/sdk/lib/services/TasksService/dto/create-update-task.dto';

export interface ITaskCardActions {
	type: taskType;
	mode: 'view' | 'add' | 'edit';
}

export interface IDeleteTaskPayload {
	id: string;
	type: taskType;
}

export interface ICreateTaskPayload {
	data: ITaskValues;
	abilityToAddTask: boolean;
	id?: string;
}

export interface IState {
	tasks: ITasks;
	subtasks: ITasks;
	allSubtasks: ITask[];
	allHierarchies: ITask[];
	task: ITask;
	recurringTemplate: ITask;
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
	isEditMode: boolean;
	loadingTasks: boolean;
	loadingSubtasks: boolean;
	loadingTask: boolean;
	loadingRecurringTemplate: boolean;
	loadingParentTask: boolean;
	loadingCreatingTask: boolean;
	loadingUpdatingTask: boolean;
	loadingDeletingTask: boolean;
	loadingStatusesTask: boolean;
	loadingTaskFields: boolean;
	errorLoadingTasks: IErrorsAxiosResponse;
	errorLoadingSubtasks: IErrorsAxiosResponse;
	errorLoadingTask: IErrorsAxiosResponse;
	errorLoadingRecurringTemplate: IErrorsAxiosResponse;
	errorLoadingParentTask: IErrorsAxiosResponse;
	errorLoadingCreatingTask: IErrorsAxiosResponse;
	errorLoadingUpdatingTask: IErrorsAxiosResponse;
	errorLoadingDeletingTask: IErrorsAxiosResponse;
	errorLoadingStatusesTask: IErrorsAxiosResponse;
	errorLoadingTaskFields: IErrorsAxiosResponse;
	meta: IMeta;
	popupLinks: ITask[];
	isSubtasks: boolean;
	isCopyingTask: boolean;
	isTaskFromTemplate: boolean;
	isKanban: boolean;
	isTable: boolean;
	taskStatus: string;
	isRegularSection: boolean;
	tasksCardPermissions: ITaskCardActions;
	tasksServiceType: taskType;
}
