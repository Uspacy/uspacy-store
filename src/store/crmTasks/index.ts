import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITaskFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { ITask, ITasks } from '@uspacy/sdk/lib/models/crm-tasks';

import {
	createTask,
	deleteTaskById,
	editTask,
	fetchTaskById,
	fetchTasks,
	fetchTasksWithFilters,
	massTasksDeletion,
	massTasksEditing,
} from './actions';
import { IState } from './types';

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

const initialTaskFilter = {
	page: 0,
	perPage: 0,
	status: [],
	openDatePicker: false,
	search: '',
	responsible_id: [],
	period: [],
	time_label: [],
	certainDateOrPeriod: [],
	participants: [],
	task_type: [],
};

const initialState = {
	tasks: initialTasks,
	tasksFromCard: initialTasks,
	task: {},
	deleteTaskId: 0,
	deleteTaskIds: [],
	deleteAllFromKanban: false,
	changeTasks: [],
	taskCopy: {},
	taskFilter: initialTaskFilter,
	errorMessage: '',
	loading: false,
	loadingTaskList: true,
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
		changeFilterTasks: (state, action: PayloadAction<{ key: string; value: ITaskFilters[keyof ITaskFilters] }>) => {
			state.taskFilter[action.payload.key] = action.payload.value;
		},
		changeItemsFilterTasks: (state, action: PayloadAction<ITaskFilters>) => {
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
		choosenTaskId: (state, action: PayloadAction<number>) => {
			state.clickedTaskId = action.payload;
		},
		setDeletionModalOpen: (state, action: PayloadAction<{ action: boolean; id?: number }>) => {
			state.deletionModalOpen.action = action.payload.action;
			state.deletionModalOpen.id = action.payload.id;
		},
		editContactFromCard: (state, action) => {
			state.tasks.data = state.tasks.data.map((task) => {
				task.contacts = task?.contacts?.map((contact) => {
					if (action?.payload?.id === contact?.id) {
						Object.keys(action.payload).forEach((key) => {
							if (contact.hasOwnProperty(key)) contact[key] = action.payload[key];
						});
					}

					return contact;
				});

				return task;
			});
		},
		editCompanyFromCard: (state, action) => {
			state.tasks.data = state.tasks.data.map((task) => {
				if (task?.company?.id === action?.payload?.id) {
					Object.keys(action.payload).forEach((key) => {
						if (task?.company?.hasOwnProperty(key)) {
							task.company[key] = action.payload[key];
						}
					});
				}
				return task;
			});
		},
		setDeleteAllFromKanban: (state, action: PayloadAction<boolean>) => {
			state.deleteAllFromKanban = action.payload;
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
	choosenTaskId,
	setDeletionModalOpen,
	editContactFromCard,
	editCompanyFromCard,
	setDeleteAllFromKanban,
} = tasksReducer.actions;
export default tasksReducer.reducer;
