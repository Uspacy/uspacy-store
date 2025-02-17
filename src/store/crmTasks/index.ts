import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilterPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { IFilter, ITaskFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { ITask, ITasks } from '@uspacy/sdk/lib/models/crm-tasks';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IField } from '@uspacy/sdk/lib/models/field';
import {
	EServicesAccountStatuses,
	ICalendar,
	IIntegrationCalendar,
	IOAuthServicesAccounts,
	ISaveAccountResponse,
} from '@uspacy/sdk/lib/models/oauthIntegrations';

import { getField } from '../../helpers/filterFieldsArrs';
import { idColumn, OTHER_DEFAULT_FIELDS } from './../../const';
import {
	activateServicesAccountSync,
	createTask,
	deleteServicesAccount,
	deleteTaskById,
	editTask,
	fetchTaskById,
	fetchTasks,
	fetchTasksWithFilters,
	getCalendars,
	getOAuthRedirectUrl,
	getOauthServicesAccounts,
	massTasksDeletion,
	massTasksEditing,
	saveCalendarsSettings,
	startInitialServicesAccountSync,
	startServicesAccountSync,
	stopServicesAccountSync,
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
		name: 'caseType',
		code: 'type',
		required: false,
		editable: false,
		show: false,
		hidden: true,
		multiple: false,
		type: 'list',
		field_section_id: '',
		system_field: true,
		sort: '',
		default_value: '',
		values: [
			{
				color: '',
				selected: false,
				sort: 0,
				title: 'task',
				value: 'task',
			},
			{
				color: '',
				selected: false,
				sort: 0,
				title: 'call',
				value: 'call',
			},
			{
				color: '',
				selected: false,
				sort: 0,
				title: 'meeting',
				value: 'meeting',
			},
			{
				color: '',
				selected: false,
				sort: 0,
				title: 'chat',
				value: 'chat',
			},
			{
				color: '',
				selected: false,
				sort: 0,
				title: 'message',
				value: 'email',
			},
		],
	},
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
		name: 'eventStartDate',
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
		name: 'eventEndDate',
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
	{
		name: 'participants',
		code: 'participants',
		required: false,
		editable: false,
		show: true,
		hidden: false,
		multiple: true,
		type: 'user_id',
		field_section_id: '',
		system_field: false,
		sort: '',
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
	taskFilter: {},
	taskFiltersPreset: initialTasksFilterPreset,
	redirectOauthUrl: '',
	servicesAccounts: {},
	calendars: [],
	isSuccessServicesAccountSync: false,
	errorMessage: '',
	errorLoadingOauthRedirectUrl: null,
	errorLoadingServicesAccounts: null,
	errorLoadingDeleteServicesAccounts: null,
	errorLoadingCalendars: null,
	loading: false,
	loadingTaskList: true,
	loadingOauthRedirectUrl: false,
	loadingSevicesAccounts: false,
	loadingDeleteServicesAccounts: false,
	loadingCalendars: false,
	isCreateTaskModalOpened: false,
	isTaskViewModalOpened: false,
	isCopy: false,
	isCompleteTaskModalOpened: false,
	clickedTaskId: null,
	deletionModalOpen: { action: false, id: null },
} as IState;

const crmTasksReducer = createSlice({
	name: 'crmTasks',
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
		clearTasksFilter: (state, action: PayloadAction<IField[]>) => {
			state.taskFilter = {
				...fieldForTasks.reduce((acc, it) => ({ ...acc, ...getField(it) }), {}),
				...action.payload.reduce((acc, it) => ({ ...acc, ...getField(it) }), {}),
				...OTHER_DEFAULT_FIELDS,
				sortModel: state?.taskFilter?.sortModel || [],
				page: 1,
				perPage: 20,
			};
		},
		addItemToTasksFilter: (state, action: PayloadAction<IField[]>) => {
			state.taskFilter = {
				...fieldForTasks.reduce((acc, it) => ({ ...acc, ...getField(it) }), {}),
				...action.payload.reduce((acc, it) => ({ ...acc, ...getField(it) }), {}),
				...OTHER_DEFAULT_FIELDS,
			};
		},
		setRedirectOauthUrl: (state, action: PayloadAction<string>) => {
			state.redirectOauthUrl = action.payload;
		},
		setIsSuccessServicesAccountSync: (state, action: PayloadAction<boolean>) => {
			state.isSuccessServicesAccountSync = action.payload;
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
		[getOAuthRedirectUrl.fulfilled.type]: (state, action: PayloadAction<{ url: string }>) => {
			state.loadingOauthRedirectUrl = false;
			state.errorLoadingOauthRedirectUrl = null;
			state.redirectOauthUrl = action.payload.url;
		},
		[getOAuthRedirectUrl.pending.type]: (state) => {
			state.loadingOauthRedirectUrl = true;
			state.errorLoadingOauthRedirectUrl = null;
		},
		[getOAuthRedirectUrl.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingOauthRedirectUrl = false;
			state.errorLoadingOauthRedirectUrl = action.payload;
		},
		[getOauthServicesAccounts.fulfilled.type]: (state, action: PayloadAction<IOAuthServicesAccounts>) => {
			state.loadingSevicesAccounts = false;
			state.servicesAccounts = action.payload;
			state.errorLoadingServicesAccounts = null;
		},
		[getOauthServicesAccounts.pending.type]: (state) => {
			state.loadingSevicesAccounts = true;
			state.errorLoadingServicesAccounts = null;
		},
		[getOauthServicesAccounts.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingSevicesAccounts = false;
			state.errorLoadingServicesAccounts = action.payload;
		},
		[deleteServicesAccount.fulfilled.type]: (
			state,
			action: PayloadAction<number, string, { arg: { providerId: number; integrationId: number } }>,
		) => {
			state.loadingDeleteServicesAccounts = false;
			state.errorLoadingDeleteServicesAccounts = null;
			state.servicesAccounts.data = state.servicesAccounts.data.filter((serviceAccount) => {
				if (serviceAccount.id === action.meta.arg.providerId) {
					const updatedIntegrations = serviceAccount.integrations.filter((integration) => integration.id !== action.meta.arg.integrationId);

					if (updatedIntegrations.length > 1) return { ...serviceAccount, integrations: updatedIntegrations };
					return false;
				}
				return true;
			});
		},
		[deleteServicesAccount.pending.type]: (state) => {
			state.loadingDeleteServicesAccounts = true;
			state.errorLoadingDeleteServicesAccounts = null;
		},
		[deleteServicesAccount.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeleteServicesAccounts = false;
			state.errorLoadingDeleteServicesAccounts = action.payload;
		},
		[getCalendars.fulfilled.type]: (state, action: PayloadAction<ICalendar[]>) => {
			state.loadingCalendars = false;
			state.errorLoadingCalendars = null;
			state.calendars = action.payload;
		},
		[getCalendars.pending.type]: (state) => {
			state.loadingCalendars = true;
			state.errorLoadingCalendars = null;
		},
		[getCalendars.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCalendars = false;
			state.errorLoadingCalendars = action.payload;
		},
		[saveCalendarsSettings.fulfilled.type]: (state, action: PayloadAction<ISaveAccountResponse>) => {
			state.loadingSaveServicesAccoutSettings = false;
			state.errorLoadingSaveServicesAccoutSettings = null;
			state.servicesAccounts.data = state.servicesAccounts.data.map((serviceAccount) => {
				if (serviceAccount.id === action.payload.data.integration.account_id) {
					return {
						...serviceAccount,
						integrations: serviceAccount.integrations.map((integration) => {
							if (integration.id === action.payload.data.integration.id) {
								const calendars = [
									Object.keys(action.payload.data || {})
										.filter((key) => key !== 'integration')
										.reduce((acc, key) => {
											acc[key] = action.payload.data[key];
											return acc;
										}, {}),
								] as IIntegrationCalendar[];
								return {
									...integration,
									calendars,
								};
							}
							return integration;
						}),
					};
				}
				return serviceAccount;
			});
		},
		[saveCalendarsSettings.pending.type]: (state) => {
			state.loadingSaveServicesAccoutSettings = true;
			state.errorLoadingSaveServicesAccoutSettings = null;
		},
		[saveCalendarsSettings.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingSaveServicesAccoutSettings = false;
			state.errorLoadingSaveServicesAccoutSettings = action.payload;
		},
		[startInitialServicesAccountSync.fulfilled.type]: (
			state,
			action: PayloadAction<number, string, { arg: { providerId: number; integrationId: number } }>,
		) => {
			state.loadingServicesAccountSync = false;
			state.errorLoadingServicesAccountSync = null;
			state.isSuccessServicesAccountSync = true;
			state.servicesAccounts.data = state.servicesAccounts.data.map((serviceAccount) => {
				if (serviceAccount.id === action.meta.arg.providerId) {
					return {
						...serviceAccount,
						integrations: serviceAccount.integrations.map((integration) => {
							if (integration.id === action.meta.arg.integrationId) {
								return { ...integration, status: EServicesAccountStatuses.RUN };
							}
							return integration;
						}),
					};
				}
				return serviceAccount;
			});
		},
		[startInitialServicesAccountSync.pending.type]: (state) => {
			state.loadingServicesAccountSync = true;
			state.errorLoadingServicesAccountSync = null;
		},
		[startInitialServicesAccountSync.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingServicesAccountSync = false;
			state.errorLoadingServicesAccountSync = action.payload;
		},
		[startServicesAccountSync.fulfilled.type]: (
			state,
			action: PayloadAction<number, string, { arg: { providerId: number; integrationId: number } }>,
		) => {
			state.loadingServicesAccountSync = false;
			state.errorLoadingServicesAccountSync = null;
			state.isSuccessServicesAccountSync = true;
			state.servicesAccounts.data = state.servicesAccounts.data.map((serviceAccount) => {
				if (serviceAccount.id === action.meta.arg.providerId) {
					return {
						...serviceAccount,
						integrations: serviceAccount.integrations.map((integration) => {
							if (integration.id === action.meta.arg.integrationId) {
								return { ...integration, status: EServicesAccountStatuses.RUN };
							}
							return integration;
						}),
					};
				}
				return serviceAccount;
			});
		},
		[startServicesAccountSync.pending.type]: (state) => {
			state.loadingServicesAccountSync = true;
			state.errorLoadingServicesAccountSync = null;
		},
		[startServicesAccountSync.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingServicesAccountSync = false;
			state.errorLoadingServicesAccountSync = action.payload;
		},
		[stopServicesAccountSync.fulfilled.type]: (
			state,
			action: PayloadAction<number, string, { arg: { providerId: number; integrationId: number } }>,
		) => {
			state.loadingServicesAccountSync = false;
			state.errorLoadingServicesAccountSync = null;
			state.isSuccessServicesAccountSync = true;
			state.servicesAccounts.data = state.servicesAccounts.data.map((serviceAccount) => {
				if (serviceAccount.id === action.meta.arg.providerId) {
					return {
						...serviceAccount,
						integrations: serviceAccount.integrations.map((integration) => {
							if (integration.id === action.meta.arg.integrationId) {
								return { ...integration, status: EServicesAccountStatuses.STOPPED };
							}
							return integration;
						}),
					};
				}
				return serviceAccount;
			});
		},
		[stopServicesAccountSync.pending.type]: (state) => {
			state.loadingServicesAccountSync = true;
			state.errorLoadingServicesAccountSync = null;
		},
		[stopServicesAccountSync.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingServicesAccountSync = false;
			state.errorLoadingServicesAccountSync = action.payload;
		},
		[activateServicesAccountSync.fulfilled.type]: (
			state,
			action: PayloadAction<number, string, { arg: { providerId: number; integrationId: number } }>,
		) => {
			state.loadingServicesAccountSync = false;
			state.errorLoadingServicesAccountSync = null;
			state.isSuccessServicesAccountSync = true;
			state.servicesAccounts.data = state.servicesAccounts.data.map((serviceAccount) => {
				if (serviceAccount.id === action.meta.arg.providerId) {
					return {
						...serviceAccount,
						integrations: serviceAccount.integrations.map((integration) => {
							if (integration.id === action.meta.arg.integrationId) {
								return { ...integration, status: EServicesAccountStatuses.STARTED };
							}
							return integration;
						}),
					};
				}
				return serviceAccount;
			});
		},
		[activateServicesAccountSync.pending.type]: (state) => {
			state.loadingServicesAccountSync = true;
			state.errorLoadingServicesAccountSync = null;
		},
		[activateServicesAccountSync.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingServicesAccountSync = false;
			state.errorLoadingServicesAccountSync = action.payload;
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
	addItemToTasksFilter,
	chooseTaskId,
	setDeletionModalOpen,
	editContactFromCard,
	editCompanyFromCard,
	setDeleteAllFromKanban,
	setIsNewPreset,
	setCurrentPreset,
	setStandardPreset,
	setFilterPresets,
	setRedirectOauthUrl,
	setIsSuccessServicesAccountSync,
} = crmTasksReducer.actions;
export default crmTasksReducer.reducer;
