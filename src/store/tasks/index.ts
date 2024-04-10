import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IFields } from '@uspacy/sdk/lib/models/field';
import { IFilterTasks, ITask, ITasks, taskType } from '@uspacy/sdk/lib/models/tasks';
import { IMassActions } from '@uspacy/sdk/lib/services/TasksService/dto/mass-actions.dto';

import { fillTheString } from '../../helpers/stringsHelper';
import {
	completeTask,
	createOneTimeTemplate,
	createRecurringTemplate,
	createTask,
	deleteTask,
	fetchTaskFields,
	getHierarchies,
	getOneTimeTemplates,
	getParentTask,
	getRecurringTemplate,
	getRecurringTemplates,
	getSubtasks,
	getTask,
	getTasks,
	massCompletion,
	massTasksDeletion,
	massTasksEditing,
	pauseTask,
	replicateTask,
	restartTask,
	startTask,
	updateOneTimeTemplate,
	updateRecurringTemplate,
	updateSubtask,
	updateTask,
} from './actions';
import { IDeleteTaskPayload, IState, ITaskCardActions } from './types';

const initialState = {
	tasks: {
		data: [],
		aborted: false,
	},
	subtasks: {
		data: [],
	},
	allSubtasks: [],
	allHierarchies: [],
	task: {},
	recurringTemplate: {},
	parentTask: {},
	taskFromTemplate: {},
	addedTask: {},
	addedToKanbanTask: {},
	changeTask: {},
	changeTasks: [],
	deleteTaskId: 0,
	deleteTaskIds: [],
	deleteAllFromKanban: false,
	filters: {
		page: 0,
		perPage: 0,
		status: [],
		time_label_deadline: [],
		time_label_closed_date: [],
		time_label_created_date: [],
		certainDateOrPeriod_deadline: [],
		certainDateOrPeriod_closed_date: [],
		certainDateOrPeriod_created_date: [],
		priority: [],
		createdBy: [],
		closed_by: [],
		closed_date: [],
		group_id: [],
		parent_id: [],
		created_date: [],
		responsible: [],
		deadline: [],
		accomplices_ids: [],
		auditors_ids: [],
		accept_result: [],
		time_tracking: [],
		openCalendar: false,
		search: '',
		boolean_operator: 'XOR',
		// ! its temporary, i'll be removed it
		time_label: [],
		accomplices: [],
		auditors: [],
	},
	regularFilter: {
		page: 0,
		perPage: 0,
		status: [],
		time_label_created_date: [],
		certainDateOrPeriod_created_date: [],
		priority: [],
		createdBy: [],
		closed_by: [],
		group_id: [],
		parent_id: [],
		created_date: [],
		responsible: [],
		accomplices_ids: [],
		auditors_ids: [],
		accept_result: [],
		time_tracking: [],
		openCalendar: false,
		search: '',
		boolean_operator: 'XOR',
		// ! its temporary, i'll be removed it
		accomplices: [],
		auditors: [],
	},
	taskFields: {},
	loadingTasks: true,
	loadingSubtasks: true,
	loadingTask: false,
	loadingRecurringTemplate: false,
	loadingParentTask: false,
	loadingCreatingTask: false,
	loadingUpdatingTask: false,
	loadingDeletingTask: false,
	loadingStatusesTask: false,
	loadingTaskFields: false,
	errorLoadingTasks: null,
	errorLoadingSubtasks: null,
	errorLoadingTask: null,
	errorLoadingRecurringTemplate: null,
	errorLoadingParentTask: null,
	errorLoadingCreatingTask: null,
	errorLoadingUpdatingTask: null,
	errorLoadingDeletingTask: null,
	errorLoadingStatusesTask: null,
	errorLoadingTaskFields: null,
	meta: {
		currentPage: 0,
		perPage: 20,
		total: 0,
	},
	popupLinks: [],
	isSubtasks: false,
	isCopyingTask: false,
	isTaskFromTemplate: false,
	isKanban: false,
	isTable: false,
	isHierarchy: false,
	isEditMode: false,
	taskStatus: '',
	isRegularSection: false,
	tasksCardPermissions: { type: 'task', mode: 'view' },
	tasksServiceType: 'task',
} as IState;

const tasksReducer = createSlice({
	name: 'tasksReducer',
	initialState,
	reducers: {
		setTasksReducer: (state, action: PayloadAction<ITasks>) => {
			state.tasks = action.payload;
		},
		editTaskReducer: (state, action: PayloadAction<ITask>) => {
			state.tasks.data = state.allSubtasks.map((task) => (task?.id === action?.payload?.id ? action.payload : task));
		},
		setTask: (state, action: PayloadAction<ITask>) => {
			state.task = action.payload;
		},
		setTemplate: (state, action: PayloadAction<ITask>) => {
			state.recurringTemplate = action.payload;
		},
		setParentTask: (state, action: PayloadAction<ITask>) => {
			state.parentTask = action.payload;
		},
		setTaskFromTemplate: (state, action: PayloadAction<ITask>) => {
			state.taskFromTemplate = action.payload;
		},
		editSubTaskReducer: (state, action: PayloadAction<ITask>) => {
			state.allSubtasks = state.allSubtasks.map((task) => (task?.id === action?.payload?.id ? action.payload : task));
			if (state.isTable) {
				state.tasks.data = state.tasks.data.map((task) => (task?.id === action?.payload?.id ? action.payload : task));
			}
			if (state.isKanban || state.isHierarchy) {
				state.changeTask = action?.payload;
			}
		},
		deleteTaskReducer: (state, action: PayloadAction<string | number>) => {
			state.tasks.data = state.tasks.data.filter((task) => task?.id !== String(action?.payload));
		},
		changeFilter: (state, action: PayloadAction<{ key: string; value }>) => {
			state.filters[action.payload.key] = action.payload.value;
		},
		changeRegularFilter: (state, action: PayloadAction<{ key: string; value }>) => {
			state.regularFilter[action.payload.key] = action.payload.value;
		},
		changeItemsFilterTasks: (state, action: PayloadAction<IFilterTasks>) => {
			state.filters = action.payload;
		},
		changeItemsFilterRegularTasks: (state, action: PayloadAction<IFilterTasks>) => {
			state.regularFilter = action.payload;
		},
		setAllSubtasks: (state, action: PayloadAction<ITask[]>) => {
			state.allSubtasks = action.payload;
		},
		setAllHierarchies: (state, action: PayloadAction<ITask[]>) => {
			state.allHierarchies = action.payload;
		},
		clearSubstasksReducer: (state) => {
			state.allSubtasks = [];
			state.subtasks = {} as ITasks;
		},
		clearAddedTaskReducer: (state) => {
			state.addedTask = {} as ITask;
		},
		clearAddedToKanbanTaskReducer: (state) => {
			state.addedToKanbanTask = {} as ITask;
		},
		clearChangeTask: (state) => {
			state.changeTask = {} as ITask;
		},
		clearFilter: (state) => {
			state.filters = { ...initialState.filters };
			state.filters.page = 1;
			state.filters.perPage = 20;
		},
		clearRegularFilter: (state) => {
			state.regularFilter = { ...initialState.regularFilter };
			state.regularFilter.page = 1;
			state.regularFilter.perPage = 20;
		},
		addTaskToEndTable: (state, action: PayloadAction<ITask>) => {
			state.tasks.data.push(action.payload);
		},
		addTasksToEndTable: (state, action: PayloadAction<ITasks>) => {
			state.tasks.data = state.tasks.data.concat(action.payload.data);
		},
		removeTaskFromEndTable: (state) => {
			if (state.isTable) {
				if (state.meta.total >= state.meta.perPage || state.meta.currentPage !== state.meta.lastPage) {
					state.tasks.data.splice(-1);
				}
			}
		},
		removeTaskFromNPositionTable: (state, action: PayloadAction<string>) => {
			if (state.isTable) {
				state.tasks.data = state.tasks.data.filter((task) => task?.id !== String(action?.payload));
				state.meta.total = state.meta.total - 1;
			}
		},
		addPopupLink: (state, action: PayloadAction<ITask>) => {
			state.popupLinks.push(action.payload);
		},
		clearPopupLink: (state) => {
			state.popupLinks = [];
		},
		clearTasks: (state) => {
			state.tasks.data = [];
			state.loadingTasks = true;
		},
		setIsSubtasks: (state, action: PayloadAction<boolean>) => {
			state.isSubtasks = action.payload;
		},
		setIsCopyingTask: (state, action: PayloadAction<boolean>) => {
			state.isCopyingTask = action.payload;
		},
		setIsTaskFromTemplate: (state, action: PayloadAction<boolean>) => {
			state.isTaskFromTemplate = action.payload;
		},
		setIsKanban: (state, action: PayloadAction<boolean>) => {
			state.isKanban = action.payload;
		},
		setIsTable: (state, action: PayloadAction<boolean>) => {
			state.isTable = action.payload;
		},
		setIsHierarchy: (state, action: PayloadAction<boolean>) => {
			state.isHierarchy = action.payload;
		},
		setStatus: (state, action: PayloadAction<string>) => {
			state.taskStatus = action.payload;
		},
		setIsRegularSection: (state, action: PayloadAction<boolean>) => {
			state.isRegularSection = action.payload;
		},
		setTotalTasks: (state, action: PayloadAction<number>) => {
			state.meta.total = action.payload;
		},
		setDeleteAllFromKanban: (state, action: PayloadAction<boolean>) => {
			state.deleteAllFromKanban = action.payload;
		},
		setAnEditMode: (state, action: PayloadAction<boolean>) => {
			state.isEditMode = action.payload;
		},
		changeTasksCardViewMode: (state, action: PayloadAction<ITaskCardActions>) => {
			state.tasksCardPermissions = action.payload;
		},
		setTasksServiceType: (state, action: PayloadAction<taskType>) => {
			state.tasksServiceType = action.payload;
		},
	},
	extraReducers: {
		[getTasks.fulfilled.type]: (state, action: PayloadAction<ITasks>) => {
			state.loadingTasks = action.payload.aborted;
			state.errorLoadingTasks = null;
			if (state.isTable) {
				state.tasks = action.payload.aborted ? state.tasks : action.payload;
				state.meta = action.payload.aborted ? state.meta : action.payload.meta;
			}
		},
		[getTasks.pending.type]: (state) => {
			state.loadingTasks = true;
			state.errorLoadingTasks = null;
		},
		[getTasks.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingTasks = false;
			state.errorLoadingTasks = action.payload;
		},
		[getRecurringTemplates.fulfilled.type]: (state, action: PayloadAction<ITasks>) => {
			state.loadingTasks = action.payload.aborted;
			state.errorLoadingTasks = null;
			state.tasks = action.payload.aborted ? state.tasks : action.payload;
			state.meta = action.payload.aborted ? state.meta : action.payload.meta;
		},
		[getRecurringTemplates.pending.type]: (state) => {
			state.loadingTasks = true;
			state.errorLoadingTasks = null;
		},
		[getRecurringTemplates.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingTasks = false;
			state.errorLoadingTasks = action.payload;
		},
		[getOneTimeTemplates.fulfilled.type]: (state, action: PayloadAction<ITasks>) => {
			state.loadingTasks = action.payload.aborted;
			state.errorLoadingTasks = null;
			state.tasks = action.payload.aborted ? state.tasks : action.payload;
			state.meta = action.payload.aborted ? state.meta : action.payload.meta;
		},
		[getOneTimeTemplates.pending.type]: (state) => {
			state.loadingTasks = true;
			state.errorLoadingTasks = null;
		},
		[getOneTimeTemplates.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingTasks = false;
			state.errorLoadingTasks = action.payload;
		},
		[getHierarchies.fulfilled.type]: (state, action: PayloadAction<ITasks>) => {
			state.loadingTasks = action.payload.aborted;
			state.errorLoadingTasks = null;
			if (state.isHierarchy) {
				state.tasks = action.payload.aborted ? state.tasks : action.payload;
				state.allHierarchies = [...state.allHierarchies, ...(action.payload.aborted ? state.tasks.data : action.payload.data)];
				state.meta = action.payload.aborted ? state.meta : action.payload.meta;
			}
		},
		[getHierarchies.pending.type]: (state) => {
			state.loadingTasks = true;
			state.errorLoadingTasks = null;
		},
		[getHierarchies.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingTasks = false;
			state.errorLoadingTasks = action.payload;
		},
		[getSubtasks.fulfilled.type]: (state, action: PayloadAction<ITasks>) => {
			state.loadingSubtasks = false;
			state.errorLoadingSubtasks = null;
			state.subtasks = action.payload;
			state.allSubtasks = [...state.allSubtasks, ...action.payload.data];
		},
		[getSubtasks.pending.type]: (state) => {
			state.loadingSubtasks = true;
			state.errorLoadingSubtasks = null;
		},
		[getSubtasks.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingSubtasks = false;
			state.errorLoadingSubtasks = action.payload;
		},
		[getTask.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
			state.loadingTask = false;
			state.errorLoadingTask = null;
			state.task = action.payload;
		},
		[getTask.pending.type]: (state) => {
			state.loadingTask = true;
			state.errorLoadingTask = null;
		},
		[getTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingTask = false;
			state.errorLoadingTask = action.payload;
		},
		[getRecurringTemplate.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
			state.loadingRecurringTemplate = false;
			state.errorLoadingRecurringTemplate = null;
			state.recurringTemplate = action.payload;
		},
		[getRecurringTemplate.pending.type]: (state) => {
			state.loadingRecurringTemplate = true;
			state.errorLoadingRecurringTemplate = null;
		},
		[getRecurringTemplate.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingRecurringTemplate = false;
			state.errorLoadingRecurringTemplate = action.payload;
		},
		[getParentTask.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
			state.loadingTask = false;
			state.loadingParentTask = null;
			state.parentTask = action.payload;
		},
		[getParentTask.pending.type]: (state) => {
			state.loadingParentTask = true;
			state.errorLoadingParentTask = null;
		},
		[getParentTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingParentTask = false;
			state.errorLoadingParentTask = action.payload;
		},
		[createTask.fulfilled.type]: (state, action: PayloadAction<{ task: ITask; abilityToAddTask: boolean }>) => {
			state.loadingCreatingTask = false;
			state.errorLoadingCreatingTask = null;
			if (action.payload.abilityToAddTask) {
				if (state.isTable && !state.isHierarchy) {
					state.tasks.data.unshift(action.payload.task);
					state.meta.total = state.meta.total + 1;
				}

				if (state.isKanban) {
					state.addedToKanbanTask = action.payload.task;
				}
			}
			if (state.isSubtasks && !state.isCopyingTask) {
				state.allSubtasks.unshift(action.payload.task);
				state.subtasks.meta.total = state.subtasks.meta.total + 1;
			}
			state.addedTask = action.payload.task;
		},
		[createTask.pending.type]: (state) => {
			state.loadingCreatingTask = true;
			state.errorLoadingCreatingTask = null;
		},
		[createTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreatingTask = false;
			state.errorLoadingCreatingTask = action.payload;
		},
		[createRecurringTemplate.fulfilled.type]: (state, action: PayloadAction<{ task: ITask; abilityToAddTask: boolean }>) => {
			state.loadingCreatingTask = false;
			state.errorLoadingCreatingTask = null;
			if (action.payload.abilityToAddTask) {
				if (state.isTable) {
					state.tasks.data.unshift(action.payload.task);
					state.meta.total = state.meta.total + 1;
				}

				if (state.isKanban) {
					state.addedToKanbanTask = action.payload.task;
				}
			}
			if (state.isSubtasks && !state.isCopyingTask) {
				state.allSubtasks.unshift(action.payload.task);
				state.subtasks.meta.total = state.subtasks.meta.total + 1;
			}
			state.addedTask = action.payload.task;
		},
		[createRecurringTemplate.pending.type]: (state) => {
			state.loadingCreatingTask = true;
			state.errorLoadingCreatingTask = null;
		},
		[createRecurringTemplate.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreatingTask = false;
			state.errorLoadingCreatingTask = action.payload;
		},
		[createOneTimeTemplate.fulfilled.type]: (state, action: PayloadAction<{ task: ITask; abilityToAddTask: boolean }>) => {
			state.loadingCreatingTask = false;
			state.errorLoadingCreatingTask = null;
			if (action.payload.abilityToAddTask) {
				if (state.isTable) {
					state.tasks.data.unshift(action.payload.task);
					state.meta.total = state.meta.total + 1;
				}

				if (state.isKanban) {
					state.addedToKanbanTask = action.payload.task;
				}
			}
			if (state.isSubtasks && !state.isCopyingTask) {
				state.allSubtasks.unshift(action.payload.task);
				state.subtasks.meta.total = state.subtasks.meta.total + 1;
			}
			state.addedTask = action.payload.task;
		},
		[createOneTimeTemplate.pending.type]: (state) => {
			state.loadingCreatingTask = true;
			state.errorLoadingCreatingTask = null;
		},
		[createOneTimeTemplate.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreatingTask = false;
			state.errorLoadingCreatingTask = action.payload;
		},
		[replicateTask.fulfilled.type]: (state, action: PayloadAction<{ task: ITask; abilityToAddTask: boolean }>) => {
			state.loadingCreatingTask = false;
			state.errorLoadingCreatingTask = null;
			if (action.payload.abilityToAddTask) {
				if (state.isTable) {
					state.tasks.data.unshift(action.payload.task);
					state.meta.total = state.meta.total + 1;
				}

				if (state.isKanban) {
					state.addedToKanbanTask = action.payload.task;
				}
			}
			if (state.isSubtasks && !state.isCopyingTask) {
				state.allSubtasks.unshift(action.payload.task);
				state.subtasks.meta.total = state.subtasks.meta.total + 1;
			}
			state.addedTask = action.payload.task;
		},
		[replicateTask.pending.type]: (state) => {
			state.loadingCreatingTask = true;
			state.errorLoadingCreatingTask = null;
		},
		[replicateTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreatingTask = false;
			state.errorLoadingCreatingTask = action.payload;
		},
		[updateTask.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
			state.loadingUpdatingTask = false;
			state.errorLoadingUpdatingTask = null;
			if (state.isTable) {
				state.tasks.data = state.tasks.data.map((task) => (task?.id === action?.payload?.id ? action.payload : task));
			}
			if (state.task.id) {
				state.task = action.payload;
			}
			if (state.isKanban || state.isHierarchy) {
				state.changeTask = action?.payload;
			}
		},
		[updateTask.pending.type]: (state) => {
			state.loadingUpdatingTask = true;
			state.errorLoadingUpdatingTask = null;
		},
		[updateTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingTask = false;
			state.errorLoadingUpdatingTask = action.payload;
		},

		[updateRecurringTemplate.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
			state.loadingUpdatingTask = false;
			state.errorLoadingUpdatingTask = null;
			if (state.isTable) {
				state.tasks.data = state.tasks.data.map((task) => (task?.id === action?.payload?.id ? action.payload : task));
			}
			if (state.task.id) {
				state.task = action.payload;
			}
		},
		[updateRecurringTemplate.pending.type]: (state) => {
			state.loadingUpdatingTask = true;
			state.errorLoadingUpdatingTask = null;
		},
		[updateRecurringTemplate.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingTask = false;
			state.errorLoadingUpdatingTask = action.payload;
		},

		[updateOneTimeTemplate.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
			state.loadingUpdatingTask = false;
			state.errorLoadingUpdatingTask = null;
			if (state.isTable) {
				state.tasks.data = state.tasks.data.map((task) => (task?.id === action?.payload?.id ? action.payload : task));
			}
			if (state.task.id) {
				state.task = action.payload;
			}
		},
		[updateOneTimeTemplate.pending.type]: (state) => {
			state.loadingUpdatingTask = true;
			state.errorLoadingUpdatingTask = null;
		},
		[updateOneTimeTemplate.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingTask = false;
			state.errorLoadingUpdatingTask = action.payload;
		},

		[updateSubtask.fulfilled.type]: (state) => {
			state.loadingUpdatingTask = false;
			state.errorLoadingUpdatingTask = null;
		},
		[updateSubtask.pending.type]: (state) => {
			state.loadingUpdatingTask = true;
			state.errorLoadingUpdatingTask = null;
		},
		[updateSubtask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingTask = false;
			state.errorLoadingUpdatingTask = action.payload;
		},
		[massTasksEditing.fulfilled.type]: (state, action: PayloadAction<IMassActions>) => {
			state.loadingUpdatingTask = false;
			state.errorLoadingUpdatingTask = null;

			const admin = action.payload.admin;

			state.tasks.data = state.tasks.data.map((task) => {
				const setterTaskUser = task?.setterId === String(action.payload.profile.id);

				const checkPermissionsForEdit = admin || setterTaskUser;

				if (action.payload.taskIds.includes(task?.id) && checkPermissionsForEdit) {
					const copiedTask = { ...task };

					for (const key in action.payload.payload) {
						if (action.payload.payload.hasOwnProperty(key) && action.payload.settings[key]) {
							if (Array.isArray(action.payload.payload[key])) {
								copiedTask[key] = Array.from(new Set([...copiedTask[key], ...action.payload.payload[key]]));
							} else {
								copiedTask[key] = fillTheString(copiedTask[key], action.payload.payload[key], action.payload.settings[key].position);
							}
						} else {
							if (key === 'deadline' && copiedTask['status'] === 'scheduled' && !action.payload.payload[key]) {
								copiedTask['status'] = 'notScheduled';
								copiedTask[key] = action.payload.payload[key];
							} else if (key === 'deadline' && copiedTask['status'] === 'notScheduled' && action.payload.payload[key] > 0) {
								copiedTask['status'] = 'scheduled';
								copiedTask[key] = action.payload.payload[key];
							} else {
								copiedTask[key] = action.payload.payload[key];
							}
						}
					}

					if (state.isKanban) {
						state.changeTasks.push(copiedTask);
					}

					return copiedTask;
				}

				return task;
			});
		},
		[massTasksEditing.pending.type]: (state) => {
			state.loadingUpdatingTask = true;
			state.errorLoadingUpdatingTask = null;
		},
		[massTasksEditing.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingTask = false;
			state.errorLoadingUpdatingTask = action.payload;
		},
		[deleteTask.fulfilled.type]: (state, action: PayloadAction<IDeleteTaskPayload>) => {
			state.loadingDeletingTask = false;
			state.errorLoadingDeletingTask = null;
			if (state.isKanban || state.isHierarchy) {
				state.deleteTaskId = +action?.payload?.id;
			}
			if (state.isTable) {
				if (state.tasksServiceType === action.payload.type) {
					state.tasks.data = state.tasks.data.filter((task) => task?.id !== String(action?.payload?.id));
					state.meta.total = state.meta.total - 1;
				}
			}
		},
		[deleteTask.pending.type]: (state) => {
			state.loadingDeletingTask = true;
			state.errorLoadingDeletingTask = null;
		},
		[deleteTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeletingTask = false;
			state.errorLoadingDeletingTask = action.payload;
		},
		[massTasksDeletion.fulfilled.type]: (state, action: PayloadAction<IMassActions>) => {
			state.loadingDeletingTask = false;
			state.errorLoadingDeletingTask = null;

			const admin = action.payload.admin;

			if (state.isTable) {
				state.tasks.data = state.tasks.data.filter((task) => {
					const setterTaskUser = task?.setterId === String(action.payload.profile.id);

					const checkPermissionsForEdit = admin || setterTaskUser;

					if (state.isKanban && checkPermissionsForEdit) {
						state.deleteTaskIds = action?.payload?.taskIds?.map((id) => id);

						if (action.payload.all) {
							state.deleteAllFromKanban = true;
						}
					}

					if (action.payload.all && checkPermissionsForEdit) {
						state.meta.total = 0;
					} else if (action.payload.all && checkPermissionsForEdit && action.payload.exceptIds.length) {
						state.meta.total = action.payload.exceptIds.length;
					} else {
						state.meta.total = state.meta.total - action.payload.taskIds.length;
					}

					return checkPermissionsForEdit && !action.payload.taskIds.includes(task?.id);
				});
			}
		},
		[massTasksDeletion.pending.type]: (state) => {
			state.loadingDeletingTask = true;
			state.errorLoadingDeletingTask = null;
		},
		[massTasksDeletion.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeletingTask = false;
			state.errorLoadingDeletingTask = action.payload;
		},

		// STATUS TASK EXTRA-REDUCERS
		[startTask.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
			state.loadingStatusesTask = false;
			state.errorLoadingStatusesTask = null;
			if (state.isTable) {
				state.tasks.data = state.tasks.data.map((task) => {
					if (task.id === action.payload.id) {
						task.status = action.payload.status;
						return task;
					}

					return task;
				});
			}
			if (state.isKanban || state.isHierarchy) {
				state.changeTask = action?.payload;
			}
		},
		[startTask.pending.type]: (state) => {
			state.loadingStatusesTask = true;
			state.errorLoadingStatusesTask = null;
		},
		[startTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingStatusesTask = false;
			state.errorLoadingStatusesTask = action.payload;
		},
		[pauseTask.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
			state.loadingStatusesTask = false;
			state.errorLoadingStatusesTask = null;
			state.taskStatus = action.payload.status;
			if (state.isTable) {
				state.tasks.data = state.tasks.data.map((task) => {
					if (task.id === action.payload.id) {
						task.status = action.payload.status;
						return task;
					}

					return task;
				});
			}
			if (state.isKanban || state.isHierarchy) {
				state.changeTask = action?.payload;
			}
		},
		[pauseTask.pending.type]: (state) => {
			state.loadingStatusesTask = true;
			state.errorLoadingStatusesTask = null;
		},
		[pauseTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingStatusesTask = false;
			state.errorLoadingStatusesTask = action.payload;
		},
		[completeTask.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
			state.loadingStatusesTask = false;
			state.errorLoadingStatusesTask = null;
			state.taskStatus = action.payload.status;
			if (state.isTable) {
				state.tasks.data = state.tasks.data.map((task) => {
					if (task.id === action.payload.id) {
						task.status = action.payload.status;
						return task;
					}

					return task;
				});
			}
			if (state.isKanban || state.isHierarchy) {
				state.changeTask = action?.payload;
			}
		},
		[completeTask.pending.type]: (state) => {
			state.loadingStatusesTask = true;
			state.errorLoadingStatusesTask = null;
		},
		[completeTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingStatusesTask = false;
			state.errorLoadingStatusesTask = action.payload;
		},
		[massCompletion.fulfilled.type]: (state, action: PayloadAction<IMassActions>) => {
			state.loadingUpdatingTask = false;
			state.errorLoadingUpdatingTask = null;
			state.tasks.data = state.tasks.data.map((task) => {
				const responsibleUser = task?.responsibleId === String(action.payload.profile?.id);
				const setterTaskUser = task?.setterId === String(action.payload.profile.id);
				const accompliceUser = task?.accomplicesIds?.includes(String(action.payload.profile?.id));

				const checkPermissionsForFinishTask = responsibleUser || setterTaskUser || accompliceUser;

				if (action.payload.taskIds.includes(task?.id) && checkPermissionsForFinishTask) {
					task.status = task?.acceptResult && !setterTaskUser ? 'inControl' : 'ready';

					if (state.isKanban) {
						state.changeTasks.push(task);
					}

					return task;
				}

				return task;
			});
		},
		[massCompletion.pending.type]: (state) => {
			state.loadingUpdatingTask = true;
			state.errorLoadingUpdatingTask = null;
		},
		[massCompletion.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingTask = false;
			state.errorLoadingUpdatingTask = action.payload;
		},
		[restartTask.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
			state.loadingStatusesTask = false;
			state.errorLoadingStatusesTask = null;
			state.taskStatus = action.payload.status;
			if (state.isTable) {
				state.tasks.data = state.tasks.data.map((task) => {
					if (task.id === action.payload.id) {
						task.status = action.payload.status;
						return task;
					}

					return task;
				});
			}
			if (state.isKanban || state.isHierarchy) {
				state.changeTask = action?.payload;
			}
		},
		[restartTask.pending.type]: (state) => {
			state.loadingStatusesTask = true;
			state.errorLoadingStatusesTask = null;
		},
		[restartTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingStatusesTask = false;
			state.errorLoadingStatusesTask = action.payload;
		},
		[fetchTaskFields.fulfilled.type]: (state, action: PayloadAction<IFields>) => {
			state.loadingTaskFields = false;
			state.errorLoadingTaskFields = null;
			state.taskFields = action.payload;
		},
		[fetchTaskFields.pending.type]: (state) => {
			state.loadingTaskFields = true;
			state.errorLoadingTaskFields = null;
		},
		[fetchTaskFields.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingTaskFields = false;
			state.errorLoadingTaskFields = action.payload;
		},
	},
});

export const {
	setTasksReducer,
	editTaskReducer,
	setTask,
	setTemplate,
	setParentTask,
	setTaskFromTemplate,
	editSubTaskReducer,
	setAllSubtasks,
	setAllHierarchies,
	clearSubstasksReducer,
	clearAddedTaskReducer,
	clearAddedToKanbanTaskReducer,
	clearChangeTask,
	deleteTaskReducer,
	changeFilter,
	changeRegularFilter,
	clearFilter,
	clearRegularFilter,
	changeItemsFilterTasks,
	changeItemsFilterRegularTasks,
	addTaskToEndTable,
	addTasksToEndTable,
	removeTaskFromEndTable,
	addPopupLink,
	clearPopupLink,
	clearTasks,
	setIsSubtasks,
	setIsCopyingTask,
	setIsTaskFromTemplate,
	removeTaskFromNPositionTable,
	setIsKanban,
	setIsTable,
	setIsHierarchy,
	setStatus,
	setIsRegularSection,
	setTotalTasks,
	setDeleteAllFromKanban,
	setAnEditMode,
	changeTasksCardViewMode,
	setTasksServiceType,
} = tasksReducer.actions;
export default tasksReducer.reducer;
