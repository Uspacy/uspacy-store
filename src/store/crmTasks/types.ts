import { ICalendar, ICalendarsAccounts } from '@uspacy/sdk/lib/models/calendars';
import { IFiltersPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { ITaskFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { ITask, ITasks } from '@uspacy/sdk/lib/models/crm-tasks';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IFields } from '@uspacy/sdk/lib/models/field';

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
	taskFilter: ITaskFilters;
	taskFiltersPreset: IFiltersPreset;
	redirectGoogleOauthUrl: string;
	calendarsAccounts: ICalendarsAccounts;
	calendars: ICalendar[];
	isSuccessCalendarSync: boolean;
	loading: boolean;
	loadingTaskList: boolean;
	loadingGoogleOauthRedirectUrl: boolean;
	loadingCalendarsAccounts: boolean;
	loadingDeleteCalendarsAccounts: boolean;
	loadingCalendars: boolean;
	loadingSaveCalendarSettings: boolean;
	loadingCalendarSync: boolean;
	errorMessage: string;
	errorLoadingGoogleOauthRedirectUrl: IErrorsAxiosResponse;
	errorLoadingCalendarsAccounts: IErrorsAxiosResponse;
	errorLoadingCalendars: IErrorsAxiosResponse;
	errorLoadingSaveCalendarSettings: IErrorsAxiosResponse;
	errorLoadingCalendarSync: IErrorsAxiosResponse;
	errorLoadingDeleteCalendarsAccounts: IErrorsAxiosResponse;
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
