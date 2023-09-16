import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilterRegularTasks, IFilterTasks, ITask, ITasks } from '@uspacy/sdk/lib/models/tasks';
import { IMassDeletion } from '@uspacy/sdk/lib/services/TasksService/dto/mass-deletion.dto';

import {
	addTask,
	completeTask,
	deleteTask,
	editSubTask,
	editTask,
	fetchParentTask,
	fetchRegularTasksWithFilters,
	fetchSubtasks,
	fetchTask,
	fetchTasksWithFilters,
	fetchTemplate,
	massDeletion,
	pauseTask,
	restartTask,
	startTask,
} from './actions';
import { IErrors, IState } from './types';

const initialState = {
	tasks: {
		data: [],
		aborted: false,
	},
	regularTasks: {
		data: [],
		aborted: false,
	},
	subtasks: {
		data: [],
	},
	allSubtasks: [],
	task: {},
	parentTask: {},
	addedTask: {},
	changeTask: {},
	deleteTaskId: 0,
	deleteTaskIds: [],
	deleteAllFromKanban: false,
	filters: {
		page: 0,
		perPage: 0,
		status: [],
		time_label: [],
		certainDateOrPeriod: [],
		priority: [],
		createdBy: [],
		responsible: [],
		deadline: [],
		accomplices: [],
		auditors: [],
		openCalendar: false,
		search: '',
	},
	regularFilter: {
		page: 0,
		perPage: 0,
		status: [],
		priority: [],
		createdBy: [],
		responsible: [],
		accomplices: [],
		auditors: [],
		openCalendar: false,
		search: '',
	},
	loadingTasks: true,
	loadingRegularTasks: true,
	loadingSubtasks: true,
	loadingTask: false,
	loadingParentTask: false,
	loadingAddingTask: false,
	loadingEditingTask: false,
	loadingDeletingTask: false,
	loadingStatusesTask: false,
	loadingComments: false,
	loadingFiles: false,
	errorLoadingTasks: null,
	errorLoadingSchedulerTasks: null,
	errorLoadingSubtasks: null,
	errorLoadingTask: null,
	errorLoadingParentTask: null,
	errorLoadingAddingTask: null,
	errorLoadingEditingTask: null,
	errorLoadingDeletingTask: null,
	errorLoadingStatusesTask: null,
	errorLoadingComments: null,
	errorLoadingFiles: null,
	meta: {
		currentPage: 0,
		perPage: 20,
		total: 0,
	},
	regularTasksMeta: {
		currentPage: 0,
		perPage: 20,
		total: 0,
	},
	popupLinks: [],
	isSubtasks: false,
	isCopyingTask: false,
	isKanban: false,
	isTable: false,
	taskStatus: '',
	isRegularSection: false,
} as IState;

const tasksReducer = createSlice({
	name: 'tasksReducer',
	initialState,
	reducers: {
		addRegularTaskReducer: (state, action: PayloadAction<ITask>) => {
			if (state.isRegularSection) {
				state.regularTasks.data.unshift(action.payload);
				state.regularTasksMeta.total = state.regularTasksMeta.total + 1;
			}
		},
		editTaskReducer: (state, action: PayloadAction<ITask>) => {
			state.tasks.data = state.allSubtasks.map((task) => (task?.id === action?.payload?.id ? action.payload : task));
		},
		setTask: (state, action: PayloadAction<ITask>) => {
			state.task = action.payload;
		},
		setParentTask: (state, action: PayloadAction<ITask>) => {
			state.parentTask = action.payload;
		},
		editSubTaskReducer: (state, action: PayloadAction<ITask>) => {
			state.allSubtasks = state.allSubtasks.map((task) => (task?.id === action?.payload?.id ? action.payload : task));
			if (state.isTable) {
				state.tasks.data = state.tasks.data.map((task) => (task?.id === action?.payload?.id ? action.payload : task));
			}
			if (state.isKanban) {
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
		changeItemsFilterRegularTasks: (state, action: PayloadAction<IFilterRegularTasks>) => {
			state.regularFilter = action.payload;
		},
		fillSubtasksReducer: (state, action: PayloadAction<ITask[]>) => {
			state.allSubtasks = action.payload;
		},
		clearSubstasksReducer: (state) => {
			state.allSubtasks = [];
			state.subtasks = {} as ITasks;
		},
		clearTaskReducer: (state) => {
			state.task = {} as ITask;
		},
		clearAddedTaskReducer: (state) => {
			state.addedTask = {} as ITask;
		},
		clearParentTaskReducer: (state) => {
			state.parentTask = {} as ITask;
		},
		clearTemplateReducer: (state) => {
			state.template = {} as ITask;
		},
		clearChangeTask: (state) => {
			state.changeTask = {} as ITask;
		},
		clearFilter: (state) => {
			state.filters.time_label = [];
			state.filters.certainDateOrPeriod = [];
			state.filters.status = [];
			state.filters.priority = [];
			state.filters.createdBy = [];
			state.filters.responsible = [];
			state.filters.accomplices = [];
			state.filters.auditors = [];
			state.filters.deadline = [];
			state.filters.openCalendar = false;
			state.filters.search = '';
			state.filters.page = 1;
			state.filters.perPage = 20;
		},
		clearRegularFilter: (state) => {
			state.regularFilter = { ...initialState.regularFilter };
			state.regularFilter.page = 1;
			state.regularFilter.perPage = 20;
		},
		addTaskToEndTable: (state, action: PayloadAction<ITask>) => {
			if (state.isRegularSection) {
				state.regularTasks.data.push(action.payload);
			} else {
				state.tasks.data.push(action.payload);
			}
		},
		addTasksToEndTable: (state, action: PayloadAction<ITasks>) => {
			state.tasks.data = state.tasks.data.concat(action.payload.data);
		},
		removeTaskFromEndTable: (state) => {
			if (state.isTable && !state.isRegularSection) {
				if (state.meta.total >= state.meta.perPage || state.meta.currentPage !== state.meta.lastPage) {
					state.tasks.data.splice(-1);
				}
			} else {
				if (
					state.regularTasksMeta.total >= state.regularTasksMeta.perPage ||
					state.regularTasksMeta.currentPage !== state.regularTasksMeta.lastPage
				) {
					state.regularTasks.data.splice(-1);
				}
			}
		},
		removeTaskFromNPositionTable: (state, action: PayloadAction<string>) => {
			if (state.isTable && !state.isRegularSection) {
				state.tasks.data = state.tasks.data.filter((task) => task?.id !== String(action?.payload));
			}
			if (state.isRegularSection) {
				state.regularTasks.data = state.regularTasks.data.filter((task) => task?.id !== String(action?.payload));
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
			state.regularTasks.data = [];
			state.loadingTasks = true;
			state.loadingRegularTasks = true;
		},
		setIsSubtasks: (state, action: PayloadAction<boolean>) => {
			state.isSubtasks = action.payload;
		},
		setIsCopyingTask: (state, action: PayloadAction<boolean>) => {
			state.isCopyingTask = action.payload;
		},
		setIsKanban: (state, action: PayloadAction<boolean>) => {
			state.isKanban = action.payload;
		},
		setIsTable: (state, action: PayloadAction<boolean>) => {
			state.isTable = action.payload;
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
	},
	extraReducers: {
		[fetchTasksWithFilters.fulfilled.type]: (state, action: PayloadAction<ITasks>) => {
			state.loadingTasks = action.payload.aborted;
			state.errorLoadingTasks = null;
			state.tasks = action.payload.aborted ? state.tasks : action.payload;
			state.meta = action.payload.aborted ? state.meta : action.payload.meta;
		},
		[fetchTasksWithFilters.pending.type]: (state) => {
			state.loadingTasks = true;
			state.errorLoadingTasks = null;
		},
		[fetchTasksWithFilters.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingTasks = false;
			state.errorLoadingTasks = action.payload;
		},
		[fetchRegularTasksWithFilters.fulfilled.type]: (state, action: PayloadAction<ITasks>) => {
			state.loadingRegularTasks = action.payload.aborted;
			state.errorLoadingSchedulerTasks = null;
			state.regularTasks = action.payload.aborted ? state.regularTasks : action.payload;
			state.regularTasksMeta = action.payload.aborted ? state.regularTasksMeta : action.payload.meta;
		},
		[fetchRegularTasksWithFilters.pending.type]: (state) => {
			state.loadingRegularTasks = true;
			state.errorLoadingSchedulerTasks = null;
		},
		[fetchRegularTasksWithFilters.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingRegularTasks = false;
			state.errorLoadingSchedulerTasks = action.payload;
		},
		[fetchSubtasks.fulfilled.type]: (state, action: PayloadAction<ITasks>) => {
			state.loadingSubtasks = false;
			state.errorLoadingSubtasks = null;
			state.subtasks = action.payload;
			state.allSubtasks = [...state.allSubtasks, ...action.payload.data];
		},
		[fetchSubtasks.pending.type]: (state) => {
			state.loadingSubtasks = true;
			state.errorLoadingSubtasks = null;
		},
		[fetchSubtasks.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingSubtasks = false;
			state.errorLoadingSubtasks = action.payload;
		},

		[fetchTask.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
			state.loadingTask = false;
			state.errorLoadingTask = null;
			state.task = action.payload;
		},
		[fetchTask.pending.type]: (state) => {
			state.loadingTask = true;
			state.errorLoadingTask = null;
		},
		[fetchTask.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingTask = false;
			state.errorLoadingTask = action.payload;
		},

		[fetchParentTask.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
			state.loadingTask = false;
			state.loadingParentTask = null;
			state.parentTask = action.payload;
		},
		[fetchParentTask.pending.type]: (state) => {
			state.loadingParentTask = true;
			state.errorLoadingParentTask = null;
		},
		[fetchParentTask.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingParentTask = false;
			state.errorLoadingParentTask = action.payload;
		},

		[fetchTemplate.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
			state.loadingTemplate = false;
			state.errorLoadingTemplate = null;
			state.template = action.payload;
		},
		[fetchTemplate.pending.type]: (state) => {
			state.loadingTemplate = true;
			state.errorLoadingTemplate = null;
		},
		[fetchTemplate.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingTemplate = false;
			state.errorLoadingTemplate = action.payload;
		},

		[addTask.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
			state.loadingAddingTask = false;
			state.errorLoadingAddingTask = null;
			if (state.isTable && !state.isRegularSection) {
				state.tasks.data.unshift(action.payload);
				state.meta.total = state.meta.total + 1;
			}
			if (state.isSubtasks && !state.isCopyingTask) {
				state.allSubtasks.unshift(action.payload);
				state.subtasks.meta.total = state.subtasks.meta.total + 1;
			}
			state.addedTask = action.payload;
		},
		[addTask.pending.type]: (state) => {
			state.loadingAddingTask = true;
			state.errorLoadingAddingTask = null;
		},
		[addTask.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingAddingTask = false;
			state.errorLoadingAddingTask = action.payload;
		},

		[editTask.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
			state.loadingEditingTask = false;
			state.errorLoadingEditingTask = null;
			if (state.isTable && !state.isRegularSection) {
				state.tasks.data = state.tasks.data.map((task) => (task?.id === action?.payload?.id ? action.payload : task));
			}
			if (state.isRegularSection) {
				state.regularTasks.data = state.regularTasks.data.map((task) => (task?.id === action?.payload?.id ? action.payload : task));
			}
			if (state.task.id) {
				state.task = action.payload;
			}
			if (state.isKanban) {
				state.changeTask = action?.payload;
			}
		},
		[editTask.pending.type]: (state) => {
			state.loadingEditingTask = true;
			state.errorLoadingEditingTask = null;
		},
		[editTask.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingEditingTask = false;
			state.errorLoadingEditingTask = action.payload;
		},
		[editSubTask.fulfilled.type]: (state) => {
			state.loadingEditingTask = false;
			state.errorLoadingEditingTask = null;
		},
		[editSubTask.pending.type]: (state) => {
			state.loadingEditingTask = true;
			state.errorLoadingEditingTask = null;
		},
		[editSubTask.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingEditingTask = false;
			state.errorLoadingEditingTask = action.payload;
		},
		[deleteTask.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loadingDeletingTask = false;
			state.errorLoadingDeletingTask = null;
			if (state.isKanban) {
				state.deleteTaskId = action?.payload;
			}
			if (state.isTable && !state.isRegularSection) {
				state.tasks.data = state.tasks.data.filter((task) => task?.id !== String(action?.payload));
				state.meta.total = state.meta.total - 1;
			}
			if (state.isRegularSection) {
				state.regularTasks.data = state.regularTasks.data.filter((task) => task?.id !== String(action?.payload));
				state.regularTasksMeta.total = state.regularTasksMeta.total - 1;
			}
		},
		[deleteTask.pending.type]: (state) => {
			state.loadingDeletingTask = true;
			state.errorLoadingDeletingTask = null;
		},
		[deleteTask.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingDeletingTask = false;
			state.errorLoadingDeletingTask = action.payload;
		},
		[massDeletion.fulfilled.type]: (state, action: PayloadAction<IMassDeletion>) => {
			state.loadingDeletingTask = false;
			state.errorLoadingDeletingTask = null;
			if (state.isKanban && !state.isRegularSection) {
				state.deleteTaskIds = action?.payload.taskIds.map((id) => id);

				if (action.payload.all) {
					state.deleteAllFromKanban = true;
				}
			}

			if (state.isTable && !state.isRegularSection) {
				state.tasks.data = state.tasks.data.filter((task) => {
					return !action.payload.taskIds.includes(task?.id);
				});

				if (action.payload.all) {
					state.meta.total = 0;
				} else if (action.payload.all && action.payload.exceptIds.length) {
					state.meta.total = action.payload.exceptIds.length;
				} else {
					state.meta.total = state.meta.total - action.payload.taskIds.length;
				}
			}

			if (state.isRegularSection) {
				state.regularTasks.data = state.regularTasks.data.filter((task) => {
					return !action.payload.taskIds.includes(task?.id);
				});

				if (action.payload.all) {
					state.regularTasksMeta.total = 0;
				} else if (action.payload.all && action.payload.exceptIds.length) {
					state.regularTasksMeta.total = action.payload.exceptIds.length;
				} else {
					state.regularTasksMeta.total = state.regularTasksMeta.total - action.payload.taskIds.length;
				}
			}
		},
		[massDeletion.pending.type]: (state) => {
			state.loadingDeletingTask = true;
			state.errorLoadingDeletingTask = null;
		},
		[massDeletion.rejected.type]: (state, action: PayloadAction<IErrors>) => {
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
			if (state.isKanban) {
				state.changeTask = action?.payload;
			}
		},
		[startTask.pending.type]: (state) => {
			state.loadingStatusesTask = true;
			state.errorLoadingStatusesTask = null;
		},
		[startTask.rejected.type]: (state, action: PayloadAction<IErrors>) => {
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
			if (state.isKanban) {
				state.changeTask = action?.payload;
			}
		},
		[pauseTask.pending.type]: (state) => {
			state.loadingStatusesTask = true;
			state.errorLoadingStatusesTask = null;
		},
		[pauseTask.rejected.type]: (state, action: PayloadAction<IErrors>) => {
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
			if (state.isKanban) {
				state.changeTask = action?.payload;
			}
		},
		[completeTask.pending.type]: (state) => {
			state.loadingStatusesTask = true;
			state.errorLoadingStatusesTask = null;
		},
		[completeTask.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingStatusesTask = false;
			state.errorLoadingStatusesTask = action.payload;
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
			if (state.isKanban) {
				state.changeTask = action?.payload;
			}
		},
		[restartTask.pending.type]: (state) => {
			state.loadingStatusesTask = true;
			state.errorLoadingStatusesTask = null;
		},
		[restartTask.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingStatusesTask = false;
			state.errorLoadingStatusesTask = action.payload;
		},
	},
});

export const {
	addRegularTaskReducer,
	editTaskReducer,
	setTask,
	setParentTask,
	editSubTaskReducer,
	fillSubtasksReducer,
	clearSubstasksReducer,
	clearTaskReducer,
	clearAddedTaskReducer,
	clearParentTaskReducer,
	clearTemplateReducer,
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
	removeTaskFromNPositionTable,
	setIsKanban,
	setIsTable,
	setStatus,
	setIsRegularSection,
	setTotalTasks,
	setDeleteAllFromKanban,
} = tasksReducer.actions;
export default tasksReducer.reducer;
