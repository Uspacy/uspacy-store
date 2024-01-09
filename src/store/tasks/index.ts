import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IFields } from '@uspacy/sdk/lib/models/field';
import { IFilterTasks, ITask, ITasks } from '@uspacy/sdk/lib/models/tasks';
import { IMassActions } from '@uspacy/sdk/lib/services/TasksService/dto/mass-actions.dto';

import { fillTheString } from '../../helpers/stringsHelper';
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
	fetchTaskFields,
	fetchTasksWithFilters,
	fetchTemplate,
	massCompletion,
	massDeletion,
	massEditing,
	pauseTask,
	restartTask,
	startTask,
} from './actions';
import { IState, ITaskCardActions } from './types';

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
		boolean_operator: 'OR',
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
		boolean_operator: 'OR',
		// ! its temporary, i'll be removed it
		accomplices: [],
		auditors: [],
	},
	taskFields: {},
	loadingTasks: true,
	loadingRegularTasks: true,
	loadingSubtasks: true,
	loadingTask: false,
	loadingParentTask: false,
	loadingAddingTask: false,
	loadingEditingTask: false,
	loadingDeletingTask: false,
	loadingStatusesTask: false,
	loadingTaskFields: false,
	errorLoadingTasks: null,
	errorLoadingSchedulerTasks: null,
	errorLoadingSubtasks: null,
	errorLoadingTask: null,
	errorLoadingParentTask: null,
	errorLoadingAddingTask: null,
	errorLoadingEditingTask: null,
	errorLoadingDeletingTask: null,
	errorLoadingStatusesTask: null,
	errorLoadingTaskFields: null,
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
	isEditMode: false,
	taskStatus: '',
	isRegularSection: false,
	tasksCardPermissions: {
		mode: 'view',
	},
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
		setTaskFromTemplate: (state, action: PayloadAction<ITask>) => {
			state.taskFromTemplate = action.payload;
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
		changeItemsFilterRegularTasks: (state, action: PayloadAction<IFilterTasks>) => {
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
				state.meta.total = state.meta.total - 1;
			}
			if (state.isRegularSection) {
				state.regularTasks.data = state.regularTasks.data.filter((task) => task?.id !== String(action?.payload));
				state.regularTasksMeta.total = state.regularTasksMeta.total - 1;
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
		changeTasksCardViewMode: (state, action: PayloadAction<ITaskCardActions>) => {
			state.tasksCardPermissions = action.payload;
		},
		setAnEditMode: (state, action: PayloadAction<boolean>) => {
			state.isEditMode = action.payload;
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
		[fetchTasksWithFilters.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
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
		[fetchRegularTasksWithFilters.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
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
		[fetchSubtasks.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
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
		[fetchTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
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
		[fetchParentTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
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
		[fetchTemplate.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingTemplate = false;
			state.errorLoadingTemplate = action.payload;
		},

		[addTask.fulfilled.type]: (state, action: PayloadAction<{ task: ITask; abilityToAddTask: boolean }>) => {
			state.loadingAddingTask = false;
			state.errorLoadingAddingTask = null;
			if (action.payload.abilityToAddTask) {
				if (state.isTable && !state.isRegularSection) {
					state.tasks.data.unshift(action.payload.task);
					state.meta.total = state.meta.total + 1;
				}

				if (state.isKanban && !state.isRegularSection) {
					state.addedToKanbanTask = action.payload.task;
				}
			}
			if (state.isSubtasks && !state.isCopyingTask) {
				state.allSubtasks.unshift(action.payload.task);
				state.subtasks.meta.total = state.subtasks.meta.total + 1;
			}
			state.addedTask = action.payload.task;
		},
		[addTask.pending.type]: (state) => {
			state.loadingAddingTask = true;
			state.errorLoadingAddingTask = null;
		},
		[addTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
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
		[editTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
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
		[editSubTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingEditingTask = false;
			state.errorLoadingEditingTask = action.payload;
		},
		[massEditing.fulfilled.type]: (state, action: PayloadAction<IMassActions>) => {
			state.loadingEditingTask = false;
			state.errorLoadingEditingTask = null;

			const admin = action.payload.admin;

			if (!state.isRegularSection) {
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
									copiedTask[key] = fillTheString(
										copiedTask[key],
										action.payload.payload[key],
										action.payload.settings[key].position,
									);
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
			}
			if (state.isRegularSection) {
				state.regularTasks.data = state.regularTasks.data.map((task) => {
					const setterTaskUser = task?.setterId === String(action.payload.profile.id);

					const checkPermissionsForEdit = admin || setterTaskUser;

					if (action.payload.taskIds.includes(task?.id) && checkPermissionsForEdit) {
						const copiedTask = { ...task };

						for (const key in action.payload.payload) {
							if (action.payload.payload.hasOwnProperty(key) && action.payload.settings[key]) {
								if (Array.isArray(action.payload.payload[key])) {
									copiedTask[key] = Array.from(new Set([...copiedTask[key], ...action.payload.payload[key]]));
								} else {
									copiedTask[key] = fillTheString(
										copiedTask[key],
										action.payload.payload[key],
										action.payload.settings[key].position,
									);
								}
							} else {
								copiedTask[key] = action.payload.payload[key];
							}
						}

						return copiedTask;
					}

					return task;
				});
			}
		},
		[massEditing.pending.type]: (state) => {
			state.loadingEditingTask = true;
			state.errorLoadingEditingTask = null;
		},
		[massEditing.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
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
		[deleteTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeletingTask = false;
			state.errorLoadingDeletingTask = action.payload;
		},
		[massDeletion.fulfilled.type]: (state, action: PayloadAction<IMassActions>) => {
			state.loadingDeletingTask = false;
			state.errorLoadingDeletingTask = null;

			const admin = action.payload.admin;

			if (state.isTable && !state.isRegularSection) {
				state.tasks.data = state.tasks.data.filter((task) => {
					const setterTaskUser = task?.setterId === String(action.payload.profile.id);

					const checkPermissionsForEdit = admin || setterTaskUser;

					if (state.isKanban && checkPermissionsForEdit) {
						state.deleteTaskIds = action?.payload.taskIds.map((id) => id);

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

			if (state.isRegularSection) {
				state.regularTasks.data = state.regularTasks.data.filter((task) => {
					const setterTaskUser = task?.setterId === String(action.payload.profile.id);

					const checkPermissionsForEdit = admin || setterTaskUser;

					if (action.payload.all && checkPermissionsForEdit) {
						state.regularTasksMeta.total = 0;
					} else if (action.payload.all && checkPermissionsForEdit && action.payload.exceptIds.length) {
						state.regularTasksMeta.total = action.payload.exceptIds.length;
					} else {
						state.regularTasksMeta.total = state.regularTasksMeta.total - action.payload.taskIds.length;
					}

					return checkPermissionsForEdit && !action.payload.taskIds.includes(task?.id);
				});
			}
		},
		[massDeletion.pending.type]: (state) => {
			state.loadingDeletingTask = true;
			state.errorLoadingDeletingTask = null;
		},
		[massDeletion.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
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
			if (state.isKanban) {
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
			if (state.isKanban) {
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
			state.loadingEditingTask = false;
			state.errorLoadingEditingTask = null;
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
			state.loadingEditingTask = true;
			state.errorLoadingEditingTask = null;
		},
		[massCompletion.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingEditingTask = false;
			state.errorLoadingEditingTask = action.payload;
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
	addRegularTaskReducer,
	editTaskReducer,
	setTask,
	setTaskFromTemplate,
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
	changeTasksCardViewMode,
	setAnEditMode,
} = tasksReducer.actions;
export default tasksReducer.reducer;
