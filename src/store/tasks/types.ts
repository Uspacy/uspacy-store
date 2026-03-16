import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IField } from '@uspacy/sdk/lib/models/field';
import { IMeta, IResponseWithMeta } from '@uspacy/sdk/lib/models/response';
import { ITask, ITasksParams, taskType } from '@uspacy/sdk/lib/models/tasks';

export interface ITaskCardActions {
	type: taskType;
	mode: 'view' | 'add' | 'edit';
}

export interface IDeleteTaskPayload {
	id: string;
	type: taskType;
}

export interface ICreateTaskPayload {
	data: Partial<ITask>;
	abilityToAddTask: boolean;
	id?: string;
}

export interface IState {
	tasks: IResponseWithMeta<ITask>;
	subtasks: IResponseWithMeta<ITask>;
	allSubtasks: ITask[];
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
	filters: ITasksParams;
	regularFilter: ITasksParams;
	fields: IField[];
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
	loadingMassActionsTasks: boolean;
	loadingTasksFields: boolean;
	loadingCreatingTasksField: boolean;
	loadingUpdatingTasksField: boolean;
	loadingDeletingTasksField: boolean;
	errorLoadingTasks: IErrorsAxiosResponse;
	errorLoadingSubtasks: IErrorsAxiosResponse;
	errorLoadingTask: IErrorsAxiosResponse;
	errorLoadingRecurringTemplate: IErrorsAxiosResponse;
	errorLoadingParentTask: IErrorsAxiosResponse;
	errorLoadingCreatingTask: IErrorsAxiosResponse;
	errorLoadingUpdatingTask: IErrorsAxiosResponse;
	errorLoadingDeletingTask: IErrorsAxiosResponse;
	errorLoadingStatusesTask: IErrorsAxiosResponse;
	errorLoadingMassActionsTasks: IErrorsAxiosResponse;
	errorLoadingTasksFields: IErrorsAxiosResponse;
	errorLoadingCreatingTasksField: IErrorsAxiosResponse;
	errorLoadingUpdatingTasksField: IErrorsAxiosResponse;
	errorLoadingDeletingTasksField: IErrorsAxiosResponse;
	meta: IMeta;
	popupLinks: ITask[];
	isSubtasks: boolean;
	isCopyingTask: boolean;
	isTaskFromTemplate: boolean;
	isKanban: boolean;
	isTable: boolean;
	isHierarchy: boolean;
	taskStatus: string;
	isRegularSection: boolean;
	tasksCardPermissions: ITaskCardActions;
	tasksServiceType: taskType;
	aiTaskData: Partial<ITask>;
}
