import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICalendar, ICalendarsAccount, ICalendarsSuccessResponse } from '@uspacy/sdk/lib/models/calendars';
import { IFilterPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { IFilter, ITaskFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { ITask, ITasks } from '@uspacy/sdk/lib/models/crm-tasks';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IField } from '@uspacy/sdk/lib/models/field';

import { idColumn } from './../../const';
import {
	createTask,
	deleteCalendarsAccount,
	deleteTaskById,
	editTask,
	fetchTaskById,
	fetchTasks,
	fetchTasksWithFilters,
	getCalendarsAccounts,
	getGoogleCalendars,
	getOAuth2CalendarRedirectUrl,
	massTasksDeletion,
	massTasksEditing,
	saveCalendarSettings,
	startGoogleCalendarsSync,
	startInitialGoogleCalendarsSync,
} from './actions';
import { IState } from './types';

const initialTasksFilterPreset = {
	isNewPreset: false,
	currentPreset: {},
	standardPreset: {},
	filterPresets: [],
};

const initialTasks = {
	data: [],
	meta: {
		total: 0,
		from: 0,
		per_page: 0,
		list: 0,
	},
	aborted: false,
};

export const initialTaskFilter: ITaskFilters = {
	page: 1,
	perPage: 20,
	status: [],
	openDatePicker: false,
	search: '',
	responsible_id: [],
	period: [],
	time_label: [],
	certainDateOrPeriod: [],
	participants: [],
	boolean_operator: '',
	task_type: [],
	sortModel: [],
};

export const fieldForTasks: IField[] = [
	idColumn,
	{
		name: 'taskTitle',
		code: 'title',
		required: false,
		editable: false,
		show: true,
		hidden: false,
		multiple: false,
		type: 'string',
		sort: '',
		system_field: false,
		default_value: '',
	},
	{
		name: 'startTime',
		code: 'start_time',
		required: false,
		editable: false,
		show: true,
		hidden: false,
		multiple: false,
		type: 'dateCheap',
		sort: '',
		system_field: false,
		default_value: '',
	},
	{
		name: 'dateOfEnding',
		code: 'end_time',
		required: false,
		editable: false,
		show: true,
		hidden: false,
		multiple: false,
		type: 'dateCheap',
		sort: '',
		system_field: false,
		default_value: '',
	},
	{
		name: 'status',
		code: 'status',
		required: false,
		editable: false,
		show: true,
		hidden: false,
		multiple: false,
		type: 'status',
		sort: '',
		system_field: false,
		default_value: '',
	},
	{
		name: 'priority',
		code: 'priority',
		required: false,
		editable: false,
		show: true,
		hidden: false,
		multiple: false,
		type: 'priority',
		sort: '',
		system_field: false,
		default_value: '',
	},
	{
		name: 'responsibleId',
		code: 'responsible_id',
		required: false,
		editable: false,
		show: true,
		hidden: false,
		multiple: false,
		type: 'user_id',
		sort: '',
		system_field: false,
		default_value: '',
	},
	{
		name: 'leadOrAgreement',
		code: 'leadOrDeal',
		required: false,
		editable: false,
		show: true,
		hidden: false,
		multiple: false,
		type: 'customLink',
		sort: '',
		system_field: false,
		default_value: '',
	},
	{
		name: 'contacts',
		code: 'contacts',
		required: false,
		editable: false,
		show: true,
		hidden: false,
		multiple: false,
		type: 'customLink',
		sort: '',
		system_field: false,
		default_value: '',
	},
	{
		name: 'company',
		code: 'company',
		required: false,
		editable: false,
		show: true,
		hidden: false,
		multiple: false,
		type: 'customLink',
		sort: '',
		system_field: false,
		default_value: '',
	},
	{
		name: 'dateOfCompletion',
		code: 'closed_at',
		required: false,
		editable: false,
		show: true,
		hidden: false,
		multiple: false,
		type: 'dateCheap',
		sort: '',
		system_field: false,
		default_value: '',
	},
	{
		name: 'created_at',
		code: 'created_at',
		required: false,
		editable: false,
		show: true,
		hidden: false,
		multiple: false,
		type: 'dateCheap',
		sort: '',
		system_field: false,
		default_value: '',
	},
	{
		name: 'dateOfUpdate',
		code: 'updated_at',
		required: false,
		editable: false,
		show: true,
		hidden: false,
		multiple: false,
		type: 'dateCheap',
		sort: '',
		system_field: false,
		default_value: '',
	},
];

const initialState = {
	tasks: initialTasks,
	tasksFromCard: initialTasks,
	task: {},
	deleteTaskId: 0,
	deleteTaskIds: [],
	deleteAllFromKanban: false,
	changeTasks: [],
	taskCopy: {},
	tasksFields: {
		data: fieldForTasks,
	},
	taskFilter: initialTaskFilter,
	taskFiltersPreset: initialTasksFilterPreset,
	redirectGoogleOauthUrl: '',
	calendarsAccounts: [],
	calendars: [],
	isSuccessCalendarSync: false,
	errorMessage: '',
	errorLoadingGoogleOauthRedirectUrl: null,
	errorLoadingCalendarsAccounts: null,
	errorLoadingCalendars: null,
	errorLoadingSaveCalendarSettings: null,
	loading: false,
	loadingTaskList: true,
	loadingGoogleOauthRedirectUrl: false,
	loadingCalendarsAccounts: false,
	loadingCalendars: false,
	loadingCalendarSync: false,
	isCreateTaskModalOpened: false,
	isTaskViewModalOpened: false,
	isCopy: false,
	isCompleteTaskModalOpened: false,
	clickedTaskId: null,
	deletionModalOpen: { action: false, id: null },
} as IState;

const tasksReducer = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		openCreateTaskModal: (state, action) => {
			state.isCreateTaskModalOpened = action.payload;
		},
		openTaskViewModal: (state, action) => {
			state.isTaskViewModalOpened = action.payload;
		},
		copyTask: (state, action) => {
			state.taskCopy = action.payload;
		},
		setCopy: (state, action) => {
			state.isCopy = action.payload;
		},
		changeFilterTasks: (state, action: PayloadAction<{ key: string; value: IFilter[keyof IFilter] }>) => {
			state.taskFilter[action.payload.key] = action.payload.value;
		},
		changeItemsFilterTasks: (state, action: PayloadAction<IFilter>) => {
			state.taskFilter = action.payload;
		},
		addTaskToState: (state, action: PayloadAction<ITask>) => {
			state.tasks.data = [action.payload, ...state.tasks.data];
		},
		removeTaskFromState: (state, action: PayloadAction<number>) => {
			state.tasks.data = state.tasks.data.filter((task) => task.id !== action.payload);
		},
		editTaskInState: (state, action: PayloadAction<ITask>) => {
			state.tasks.data = state.tasks.data.map((task) => (task.id === action.payload.id ? action.payload : task));
		},
		openCompleteTaskModal: (state, action) => {
			state.isCompleteTaskModalOpened = action.payload;
		},
		clearTasks: (state) => {
			state.tasks = initialTasks;
			state.loadingTaskList = true;
		},
		clearTasksFilter: (state) => {
			state.taskFilter = initialTaskFilter;
		},
		chooseTaskId: (state, action: PayloadAction<number>) => {
			state.clickedTaskId = action.payload;
		},
		setDeletionModalOpen: (state, action: PayloadAction<{ action: boolean; id?: number }>) => {
			state.deletionModalOpen.action = action.payload.action;
			state.deletionModalOpen.id = action.payload.id;
		},
		editContactFromCard: (state, action) => {
			state.tasks.data = state.tasks.data.map((task) => {
				return {
					...task,
					crm_entities: {
						...task?.crm_entities,
						contacts: task?.crm_entities?.contacts?.map((contact) => {
							if (action?.payload?.id === contact?.id) {
								Object.keys(action.payload).forEach((key) => {
									if (contact.hasOwnProperty(key)) contact[key] = action.payload[key];
								});
							}

							return contact;
						}),
					},
				};
			});
		},
		editCompanyFromCard: (state, action) => {
			state.tasks.data = state.tasks.data.map((task) => {
				return {
					...task,
					crm_entities: {
						...task?.crm_entities,
						companies: task?.crm_entities?.companies?.map((company) => {
							if (action?.payload?.id === company?.id) {
								Object.keys(action.payload).forEach((key) => {
									if (company.hasOwnProperty(key)) company[key] = action.payload[key];
								});
							}

							return company;
						}),
					},
				};
			});
		},
		setDeleteAllFromKanban: (state, action: PayloadAction<boolean>) => {
			state.deleteAllFromKanban = action.payload;
		},
		setIsNewPreset: (state, action: PayloadAction<boolean>) => {
			state.taskFiltersPreset.isNewPreset = action.payload;
		},
		setCurrentPreset: (state, action: PayloadAction<IFilterPreset>) => {
			state.taskFiltersPreset.currentPreset = action.payload;
		},
		setStandardPreset: (state, action: PayloadAction<IFilterPreset>) => {
			state.taskFiltersPreset.standardPreset = action.payload;
		},
		setFilterPresets: (state, action: PayloadAction<IFilterPreset[]>) => {
			state.taskFiltersPreset.filterPresets = action.payload;
		},
		setRedirectGoogleOauthUrl: (state, action: PayloadAction<string>) => {
			state.redirectGoogleOauthUrl = action.payload;
		},
		setIsSuccessCalendarSync: (state, action: PayloadAction<boolean>) => {
			state.isSuccessCalendarSync = action.payload;
		},
	},
	extraReducers: {
		[fetchTasks.fulfilled.type]: (state, action: PayloadAction<ITasks>) => {
			state.loadingTaskList = false;
			state.errorMessage = '';
			state.tasks = action.payload;
		},
		[fetchTasks.pending.type]: (state) => {
			state.loadingTaskList = true;
			state.errorMessage = '';
		},
		[fetchTasks.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingTaskList = false;
			state.errorMessage = action.payload;
		},
		[fetchTasksWithFilters.fulfilled.type]: (state, action: PayloadAction<ITasks>) => {
			state.loadingTaskList = action.payload.aborted;
			state.errorMessage = '';
			state.tasks = action.payload.aborted ? state.tasks : action.payload;
		},
		[fetchTasksWithFilters.pending.type]: (state) => {
			state.loadingTaskList = true;
			state.errorMessage = '';
		},
		[fetchTasksWithFilters.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingTaskList = false;
			state.errorMessage = action.payload;
		},
		[createTask.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
			state.loading = false;
			state.errorMessage = '';
			state.tasks.data.unshift(action.payload);
			state.tasks.meta.total = ++state.tasks.meta.total;
		},
		[createTask.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createTask.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[editTask.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
			state.loading = false;
			state.loadingTaskList = false;
			state.errorMessage = '';
			state.tasks.data = state.tasks.data.map((task) => {
				if (task?.id === action?.payload?.id) {
					return {
						...task,
						...action.payload,
					};
				}
				return task;
			});
		},
		[editTask.pending.type]: (state) => {
			state.loading = true;
			state.loadingTaskList = true;
			state.errorMessage = '';
		},
		[editTask.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingTaskList = false;
			state.errorMessage = action.payload;
		},
		[fetchTaskById.fulfilled.type]: (state, action) => {
			state.loading = false;
			state.errorMessage = '';
			state.task = action.payload;
		},
		[fetchTaskById.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[fetchTaskById.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteTaskById.fulfilled.type]: (state, action) => {
			state.loading = false;
			state.loadingTaskList = false;
			state.errorMessage = '';
			state.deleteTaskId = action.payload;
			state.tasks.data = state.tasks.data.filter((el) => el.id !== action.payload);
		},
		[deleteTaskById.pending.type]: (state) => {
			state.loading = true;
			state.loadingTaskList = true;
			state.errorMessage = '';
		},
		[deleteTaskById.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingTaskList = false;
			state.errorMessage = action.payload;
		},
		[massTasksDeletion.fulfilled.type]: (state, action: PayloadAction<IMassActions>) => {
			state.loading = false;
			state.loadingTaskList = false;
			state.errorMessage = '';
			state.tasks.data = state.tasks.data.filter((item) => !action.payload.entityIds.includes(item?.id));

			state.deleteTaskIds = action?.payload.entityIds.map((id) => id);

			if (action.payload.all) {
				state.deleteAllFromKanban = true;
			}

			if (action.payload.all) {
				state.tasks.meta.total = 0;
			} else if (action.payload.all && action.payload.exceptIds.length) {
				state.tasks.meta.total = action.payload.exceptIds.length;
			} else {
				state.tasks.meta.total = state.tasks.meta.total - action.payload.entityIds.length;
			}
		},
		[massTasksDeletion.pending.type]: (state) => {
			state.loading = true;
			state.loadingTaskList = true;
			state.errorMessage = '';
		},
		[massTasksDeletion.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingTaskList = false;
			state.errorMessage = action.payload;
		},
		[massTasksEditing.fulfilled.type]: (state, action: PayloadAction<IMassActions>) => {
			state.loading = false;
			state.loadingTaskList = false;
			state.errorMessage = '';

			state.tasks.data = state.tasks.data.map((item) => {
				if (action.payload.entityIds?.includes(item?.id)) {
					const copiedItem = { ...item };

					for (const key in action.payload.payload) {
						if (action.payload.payload.hasOwnProperty(key) && action.payload.settings[key]) {
							if (Array.isArray(action.payload.payload[key])) {
								copiedItem[key] = [...copiedItem[key], ...action.payload.payload[key]];
							} else {
								copiedItem[key] = copiedItem[key];
							}
						} else {
							copiedItem[key] = action.payload.payload[key];
						}
					}

					state.changeTasks.push(copiedItem);

					return copiedItem;
				}

				return item;
			});
		},
		[massTasksEditing.pending.type]: (state) => {
			state.loading = true;
			state.loadingTaskList = true;
			state.errorMessage = '';
		},
		[massTasksEditing.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingTaskList = false;
			state.errorMessage = action.payload;
		},
		[getOAuth2CalendarRedirectUrl.fulfilled.type]: (state, action: PayloadAction<{ url: string }>) => {
			state.loadingGoogleOauthRedirectUrl = false;
			state.errorLoadingGoogleOauthRedirectUrl = null;
			state.redirectGoogleOauthUrl = action.payload.url;
		},
		[getOAuth2CalendarRedirectUrl.pending.type]: (state) => {
			state.loadingGoogleOauthRedirectUrl = true;
			state.errorLoadingGoogleOauthRedirectUrl = null;
		},
		[getOAuth2CalendarRedirectUrl.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingGoogleOauthRedirectUrl = false;
			state.errorLoadingGoogleOauthRedirectUrl = action.payload;
		},
		[getCalendarsAccounts.fulfilled.type]: (state, action: PayloadAction<ICalendarsAccount[]>) => {
			state.loadingCalendarsAccounts = false;
			state.errorLoadingCalendarsAccounts = null;
			state.calendarsAccounts = action.payload;
		},
		[getCalendarsAccounts.pending.type]: (state) => {
			state.loadingCalendarsAccounts = true;
			state.errorLoadingCalendarsAccounts = null;
		},
		[getCalendarsAccounts.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCalendarsAccounts = false;
			state.errorLoadingCalendarsAccounts = action.payload;
		},
		[deleteCalendarsAccount.fulfilled.type]: (state, action: PayloadAction<string>) => {
			state.loadingDeleteCalendarsAccounts = false;
			state.errorLoadingDeleteCalendarsAccounts = null;
			state.calendarsAccounts = state.calendarsAccounts.filter((item) => item.email !== action.payload);
		},
		[deleteCalendarsAccount.pending.type]: (state) => {
			state.loadingDeleteCalendarsAccounts = true;
			state.errorLoadingDeleteCalendarsAccounts = null;
		},
		[deleteCalendarsAccount.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeleteCalendarsAccounts = false;
			state.errorLoadingDeleteCalendarsAccounts = action.payload;
		},
		[getGoogleCalendars.fulfilled.type]: (state, action: PayloadAction<ICalendar[]>) => {
			state.loadingCalendars = false;
			state.errorLoadingCalendars = null;
			state.calendars = action.payload;
		},
		[getGoogleCalendars.pending.type]: (state) => {
			state.loadingCalendars = true;
			state.errorLoadingCalendars = null;
		},
		[getGoogleCalendars.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCalendars = false;
			state.errorLoadingCalendars = action.payload;
		},
		[saveCalendarSettings.fulfilled.type]: (state, action: PayloadAction<ICalendarsAccount>) => {
			state.loadingSaveCalendarSettings = false;
			state.errorLoadingSaveCalendarSettings = null;
			state.calendarsAccounts = state.calendarsAccounts.map((calendarAccount) => {
				if (calendarAccount.remote_calendar_id === action.payload.remote_calendar_id) {
					return { ...calendarAccount, ...action.payload };
				}
				return calendarAccount;
			});
		},
		[saveCalendarSettings.pending.type]: (state) => {
			state.loadingSaveCalendarSettings = true;
			state.errorLoadingSaveCalendarSettings = null;
		},
		[saveCalendarSettings.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingSaveCalendarSettings = false;
			state.errorLoadingSaveCalendarSettings = action.payload;
		},
		[startInitialGoogleCalendarsSync.fulfilled.type]: (state, action: PayloadAction<ICalendarsSuccessResponse>) => {
			state.loadingCalendarSync = false;
			state.errorLoadingCalendarSync = null;
			state.isSuccessCalendarSync = action.payload.status;
		},
		[startInitialGoogleCalendarsSync.pending.type]: (state) => {
			state.loadingCalendarSync = true;
			state.errorLoadingCalendarSync = null;
		},
		[startInitialGoogleCalendarsSync.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCalendarSync = false;
			state.errorLoadingCalendarSync = action.payload;
		},
		[startGoogleCalendarsSync.fulfilled.type]: (state, action: PayloadAction<ICalendarsSuccessResponse>) => {
			state.loadingCalendarSync = false;
			state.errorLoadingCalendarSync = null;
			state.isSuccessCalendarSync = action.payload.status;
		},
		[startGoogleCalendarsSync.pending.type]: (state) => {
			state.loadingCalendarSync = true;
			state.errorLoadingCalendarSync = null;
		},
		[startGoogleCalendarsSync.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCalendarSync = false;
			state.errorLoadingCalendarSync = action.payload;
		},
	},
});

export const {
	openCreateTaskModal,
	openTaskViewModal,
	copyTask,
	setCopy,
	changeFilterTasks,
	changeItemsFilterTasks,
	addTaskToState,
	removeTaskFromState,
	editTaskInState,
	openCompleteTaskModal,
	clearTasks,
	clearTasksFilter,
	chooseTaskId,
	setDeletionModalOpen,
	editContactFromCard,
	editCompanyFromCard,
	setDeleteAllFromKanban,
	setIsNewPreset,
	setCurrentPreset,
	setStandardPreset,
	setFilterPresets,
	setRedirectGoogleOauthUrl,
	setIsSuccessCalendarSync,
} = tasksReducer.actions;
export default tasksReducer.reducer;
