import { ITaskFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { ITask, ITasks } from '@uspacy/sdk/lib/models/crm-tasks';

export interface IErrors {
	status: number;
	error: string;
}

export interface IState {
	tasks: ITasks;
	tasksFromCard: ITasks;
	task: ITask;
	deleteTaskId: number;
	deleteTaskIds: number[];
	deleteAllFromKanban: boolean;
	changeTasks: ITask[];
	taskCopy: ITask;
	taskFilter: ITaskFilters;
	loading: boolean;
	loadingTaskList: boolean;
	errorMessage: string;
	isCreateTaskModalOpened: boolean;
	isTaskViewModalOpened: boolean;
	isCopy: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	setCopy: any;
	isCompleteTaskModalOpened: boolean;
	clickedTaskId: number;
	deletionModalOpen: { action: boolean; id?: number };
}

export interface IAddTask {
	title: string;
	createdBy: number;
	type: string;
	status: string;
	description: string;
	start_time: number;
	end_time: number;
	responsibleId: number;
	companyId: number;
	participants: number[];
	deals: number[];
	leads: number[];
	contacts: number[];
}
