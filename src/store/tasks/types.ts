import { IFilterRegularTasks, IFilterTasks, IMeta, ITask, ITasks } from '@uspacy/sdk/lib/models/tasks';

export interface IErrors {
	status: number;
	error: string;
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
	deleteTaskId: number;
	deleteTaskIds: string[];
	deleteAllFromKanban: boolean;
	filters: IFilterTasks;
	regularFilter: IFilterRegularTasks;
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
	loadingComments: boolean;
	loadingFiles: boolean;
	errorLoadingTasks: IErrors;
	errorLoadingSchedulerTasks: IErrors;
	errorLoadingSubtasks: IErrors;
	errorLoadingTask: IErrors;
	errorLoadingParentTask: IErrors;
	errorLoadingTemplate: IErrors;
	errorLoadingAddingTask: IErrors;
	errorLoadingEditingTask: IErrors;
	errorLoadingDeletingTask: IErrors;
	errorLoadingStatusesTask: IErrors;
	errorLoadingComments: IErrors;
	errorLoadingFiles: IErrors;
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
