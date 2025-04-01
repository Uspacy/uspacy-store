import { IFiltersPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { IFilter } from '@uspacy/sdk/lib/models/crm-filters';
import { ITask, ITasks } from '@uspacy/sdk/lib/models/crm-tasks';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IFields } from '@uspacy/sdk/lib/models/field';
import { ICalendar, IOAuthServicesAccounts } from '@uspacy/sdk/lib/models/oauthIntegrations';

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
	tasksFields: IFields;
	taskFilter: IFilter;
	taskFiltersPreset: IFiltersPreset;
	redirectOauthUrl: string;
	servicesAccounts: IOAuthServicesAccounts;
	calendars: ICalendar[];
	isSuccessServicesAccountSync: boolean;
	loading: boolean;
	loadingTaskList: boolean;
	loadingOauthRedirectUrl: boolean;
	loadingSevicesAccounts: boolean;
	loadingDeleteServicesAccounts: boolean;
	loadingCalendars: boolean;
	loadingSaveServicesAccoutSettings: boolean;
	loadingServicesAccountSync: boolean;
	errorMessage: string;
	errorLoadingOauthRedirectUrl: IErrorsAxiosResponse;
	errorLoadingServicesAccounts: IErrorsAxiosResponse;
	errorLoadingCalendars: IErrorsAxiosResponse;
	errorLoadingDeleteServicesAccounts: IErrorsAxiosResponse;
	errorLoadingSaveServicesAccoutSettings: IErrorsAxiosResponse;
	errorLoadingServicesAccountSync: IErrorsAxiosResponse;
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
