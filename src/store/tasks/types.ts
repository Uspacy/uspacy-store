import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IField } from '@uspacy/sdk/lib/models/field';
import { IMeta, IResponseWithMeta } from '@uspacy/sdk/lib/models/response';
import { ITask, ITasksParams, taskType } from '@uspacy/sdk/lib/models/tasks';

export interface IMoveCardsData {
	taskId: number;
	stageId: number;
	prevTaskId?: number;
	entityCode: string;
	sourceStageId?: number;
	destinationIndex?: number;
	item?: ITask;
}

export interface ITaskCardActions {
	type: taskType;
	mode: 'view' | 'add' | 'edit';
}

export interface IDeleteTaskPayload {
	id: string;
	type: taskType;
	entityCode?: string;
	stageId?: number;
}

export interface ICreateTaskPayload {
	type: taskType;
	data: Partial<ITask>;
	abilityToAddTask: boolean;
	id?: string;
	entityCode?: string;
	stageId?: number;
}

export interface IState {
	tasks: IResponseWithMeta<ITask>;
	pendingNewItems: Record<string, ITask[]>;
	addedTask: ITask;
	addedToKanbanTask: ITask;
	changeTask: ITask;
	deleteTaskId: number;
	filters: ITasksParams;
	regularFilter: ITasksParams;
	fields: IField[];
	isEditMode: boolean;
	loadingTasks: boolean;
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
	isCopyingTask: boolean;
	isTaskFromTemplate: boolean;
	isKanban: boolean;
	isTable: boolean;
	isHierarchy: boolean;
	isRegularSection: boolean;
	tasksServiceType: taskType;
	aiTaskData: Partial<ITask>;
	kanban: {
		[key: string]: {
			stages?: {
				[key: string]: {
					loading: boolean;
					errorMessage?: IErrorsAxiosResponse;
				} & IResponseWithMeta<ITask>;
			};
		};
	};
}
