import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IField } from '@uspacy/sdk/lib/models/field';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';
import { ITask, ITasksParams, taskType } from '@uspacy/sdk/lib/models/tasks';
import { IMassActions } from '@uspacy/sdk/lib/services/TasksService/dto/mass-actions.dto';
import cloneDeep from 'lodash/cloneDeep';

import { fillTheString } from '../../helpers/stringsHelper';
import {
	createTask,
	createTasksField,
	delegationTask,
	deleteTask,
	deleteTasksField,
	deleteTasksListValues,
	getHierarchies,
	getOneTimeTemplates,
	getRecurringTemplates,
	getTasks,
	getTasksFields,
	getTasksItemsByStage,
	massCompletion,
	massTasksDeletion,
	massTasksEditing,
	moveTaskFromStageToStage,
	replicateTask,
	updateTask,
	updateTasksField,
	updateTasksListValues,
	updateTaskStatus,
} from './actions';
import { IDeleteTaskPayload, IMoveCardsData, IState } from './types';

const initialState = {
	tasks: {
		data: [],
		meta: {},
		aborted: false,
	},
	pendingNewItems: [] as ITask[],
	kanban: {},
	addedTask: {},
	addedToKanbanTask: {},
	changeTask: {},
	deleteTaskId: null,
	filters: {
		page: 0,
		list: 0,
		q: '',
		boolean_operator: 'XOR',
		openCalendar: false,
	},
	regularFilter: {
		page: 0,
		list: 0,
		q: '',
		boolean_operator: 'XOR',
		openCalendar: false,
	},
	fields: [],
	loadingTasks: true,
	loadingCreatingTask: false,
	loadingUpdatingTask: false,
	loadingDeletingTask: false,
	loadingStatusesTask: false,
	loadingMassActionsTasks: false,
	loadingTasksFields: false,
	loadingCreatingTasksField: false,
	loadingUpdatingTasksField: false,
	loadingDeletingTasksField: false,
	errorLoadingTasks: null,
	errorLoadingCreatingTask: null,
	errorLoadingUpdatingTask: null,
	errorLoadingDeletingTask: null,
	errorLoadingStatusesTask: null,
	errorLoadingMassActionsTasks: null,
	errorLoadingTasksFields: null,
	errorLoadingCreatingTasksField: null,
	errorLoadingUpdatingTasksField: null,
	errorLoadingDeletingTasksField: null,
	meta: {
		currentPage: 0,
		perPage: 20,
		total: 0,
	},
	isCopyingTask: false,
	isTaskFromTemplate: false,
	isKanban: false,
	isTable: false,
	isHierarchy: false,
	isEditMode: false,
	isRegularSection: false,
	tasksServiceType: 'task',
	aiTaskData: null,
} as IState;

const tasksReducer = createSlice({
	name: 'tasksReducer',
	initialState,
	reducers: {
		setTasks: (state, action: PayloadAction<IResponseWithMeta<ITask>>) => {
			state.tasks = action.payload;
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
		changeItemsFilterTasks: (state, action: PayloadAction<ITasksParams>) => {
			state.filters = action.payload;
		},
		changeItemsFilterRegularTasks: (state, action: PayloadAction<ITasksParams>) => {
			state.regularFilter = action.payload;
		},
		clearAddedTaskReducer: (state) => {
			state.addedTask = initialState.addedTask;
		},
		clearAddedToKanbanTaskReducer: (state) => {
			state.addedToKanbanTask = initialState.addedToKanbanTask;
		},
		clearChangeTask: (state) => {
			state.changeTask = initialState.changeTask;
		},
		clearDeleteTaskId: (state) => {
			state.deleteTaskId = null;
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
		addTasksToEndTable: (state, action: PayloadAction<IResponseWithMeta<ITask>>) => {
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
		clearTasks: (state) => {
			state.tasks.data = [];
			state.loadingTasks = true;
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
		setIsRegularSection: (state, action: PayloadAction<boolean>) => {
			state.isRegularSection = action.payload;
		},
		setTotalTasks: (state, action: PayloadAction<number>) => {
			state.meta.total = action.payload;
		},
		setAnEditMode: (state, action: PayloadAction<boolean>) => {
			state.isEditMode = action.payload;
		},
		setTasksServiceType: (state, action: PayloadAction<taskType>) => {
			state.tasksServiceType = action.payload;
		},
		setAiTaskData: (state, action: PayloadAction<Partial<ITask>>) => {
			state.aiTaskData = action.payload;
		},
		updateItemLocal: (state, action: PayloadAction<ITask>) => {
			if (state.isTable) {
				state.tasks.data = state.tasks.data.map((task) => (task?.id === action?.payload?.id ? action.payload : task));
			}
		},
		addPendingTaskItem: (state, action: PayloadAction<ITask>) => {
			const alreadyPending = state.pendingNewItems.some((pendingTask) => pendingTask.id === action.payload.id);
			if (alreadyPending) return;
			state.pendingNewItems = [action.payload, ...state.pendingNewItems];
			if (state.meta?.total != null) state.meta.total++;
		},
		removePendingTaskItem: (state, action: PayloadAction<string>) => {
			const wasInPending = state.pendingNewItems.some((pendingTask) => pendingTask.id === action.payload);
			if (!wasInPending) return;
			state.pendingNewItems = state.pendingNewItems.filter((pendingTask) => pendingTask.id !== action.payload);
			if (state.meta?.total != null) state.meta.total = Math.max(0, state.meta.total - 1);
		},
		flushPendingTaskItems: (state) => {
			if (!state.pendingNewItems.length) return;
			const existingIds = new Set(state.tasks.data.map((task) => task.id));
			const toAdd = state.pendingNewItems.filter((pendingTask) => !existingIds.has(pendingTask.id));
			state.tasks.data = [...toAdd, ...state.tasks.data];
			state.pendingNewItems = [];
		},
		deleteItemLocal: (state, action: PayloadAction<IDeleteTaskPayload>) => {
			if (state.isHierarchy) {
				state.deleteTaskId = +action?.payload?.id;
			}
			if (state.isTable) {
				state.meta.total = state.meta.total - 1;
				if (state.tasksServiceType === action.payload.type) {
					state.tasks.data = state.tasks.data.filter((task) => task?.id !== String(action?.payload?.id));
				}
			}
		},
		removeKanbanItemLocal: (state, action: PayloadAction<{ taskId: string | number; entityCode: string }>) => {
			const { taskId, entityCode } = action.payload;
			const stages = state?.kanban?.[entityCode]?.stages;
			if (!stages) return;
			Object.values(stages).forEach((stage) => {
				if (!Array.isArray(stage.data)) return;
				const before = stage.data.length;
				stage.data = stage.data.filter((item) => String(item?.id) !== String(taskId));
				if (before > stage.data.length && stage.meta?.total != null) {
					stage.meta.total = Math.max(0, stage.meta.total - 1);
				}
			});
		},
		addKanbanItemLocal: (state, action: PayloadAction<{ task: ITask; entityCode: string; stageId: string | number }>) => {
			const { task, entityCode, stageId } = action.payload;
			const stage = state?.kanban?.[entityCode]?.stages?.[stageId];
			if (!stage || !Array.isArray(stage.data)) return;
			if (stage.data.some((item) => String(item?.id) === String(task.id))) return;
			stage.data = [task, ...stage.data];
			if (stage.meta?.total != null) stage.meta.total++;
		},
		updateKanbanItemLocal: (state, action: PayloadAction<{ task: ITask; entityCode: string }>) => {
			const { task, entityCode } = action.payload;
			const stages = state?.kanban?.[entityCode]?.stages;
			if (!stages) return;
			Object.values(stages).forEach((stage) => {
				if (!Array.isArray(stage.data)) return;
				stage.data = stage.data.map((item) => (String(item?.id) === String(task.id) ? task : item));
			});
		},
		moveTaskFromStageToStageLocal: (state, action: PayloadAction<IMoveCardsData>) => {
			const { taskId, prevTaskId, stageId, entityCode } = action.payload;

			const stages = state?.kanban?.[entityCode]?.stages;
			const destinationStage = stages?.[stageId];

			if (!stages) return;
			if (!destinationStage) return;

			let movedItem = null;
			let sourceStage = null;

			Object.values(stages || {}).forEach((stage) => {
				const found = stage?.data?.find((item) => String(item?.id) === String(taskId));
				if (found) {
					movedItem = found;
					sourceStage = stage;
				}
				stage.data = stage?.data?.filter((item) => String(item?.id) !== String(taskId));
			});

			if (!movedItem) return;

			movedItem = { ...movedItem, kanbanStageId: String(stageId) };

			const overIndex = destinationStage.data.findIndex((item) => +item?.id === +prevTaskId);

			if (overIndex >= 0) destinationStage.data.splice(overIndex + 1, 0, movedItem);
			else destinationStage.data.unshift(movedItem);

			if (sourceStage && sourceStage !== destinationStage) {
				sourceStage.meta.total = Math.max(0, (sourceStage.meta.total ?? 0) - 1);
				destinationStage.meta.total = (destinationStage.meta.total ?? 0) + 1;
			}
		},
	},
	extraReducers: {
		[getTasks.fulfilled.type]: (state, action: PayloadAction<IResponseWithMeta<ITask>>) => {
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
		[getRecurringTemplates.fulfilled.type]: (state, action: PayloadAction<IResponseWithMeta<ITask>>) => {
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
		[getOneTimeTemplates.fulfilled.type]: (state, action: PayloadAction<IResponseWithMeta<ITask>>) => {
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
		[getHierarchies.fulfilled.type]: (state, action: PayloadAction<IResponseWithMeta<ITask>>) => {
			state.loadingTasks = action.payload.aborted;
			state.errorLoadingTasks = null;
			if (state.isHierarchy) {
				state.tasks = action.payload.aborted ? state.tasks : action.payload;
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
		[getTasksItemsByStage.fulfilled.type]: (
			state,
			action: PayloadAction<IResponseWithMeta<ITask>, string, { arg: { entityCode: string; stageId: number; stagesIds?: number[] } }>,
		) => {
			const { entityCode, stageId, stagesIds } = action.meta.arg;
			state.kanban[entityCode].stages[stageId].data = [...state.kanban[entityCode].stages[stageId].data, ...action.payload.data];
			state.kanban[entityCode].stages[stageId].loading = false;
			state.kanban[entityCode].stages[stageId].meta = action.payload.meta;

			if (stagesIds) {
				// Remove extra stages that are not in the stagesIds array
				Object.keys(state?.kanban?.[entityCode]?.stages || {}).forEach((key) => {
					if (!stagesIds?.includes(Number(key))) delete state.kanban[entityCode].stages[key];
				});
			}
		},
		[getTasksItemsByStage.pending.type]: (
			state,
			action: PayloadAction<unknown, string, { arg: { entityCode: string; stageId?: number; filters: Omit<ITasksParams, 'openDatePicker'> } }>,
		) => {
			const { entityCode, stageId, filters } = action.meta.arg;
			if (!state.kanban[entityCode]) state.kanban[entityCode] = { stages: {} };
			state.kanban[entityCode].stages[stageId] = {
				...state.kanban[entityCode].stages[stageId],
				// page 1 means that we are fetching data for the first time and we need to clear the data
				...(filters.page === 1 && { data: [], meta: undefined }),
				loading: true,
				errorMessage: null,
			};
		},
		[getTasksItemsByStage.rejected.type]: (
			state,
			action: PayloadAction<IErrorsAxiosResponse, string, { arg: { entityCode: string; stageId: number } }>,
		) => {
			const { entityCode, stageId } = action.meta.arg;
			if (state?.kanban?.[entityCode]?.stages?.[stageId]) {
				state.kanban[entityCode].stages[stageId].loading = false;
				state.kanban[entityCode].stages[stageId].errorMessage = action.payload;
			}
		},
		[createTask.fulfilled.type]: (
			state,
			action: PayloadAction<{ task: ITask; abilityToAddTask: boolean; entityCode?: string; stageId?: number }>,
		) => {
			state.loadingCreatingTask = false;
			state.errorLoadingCreatingTask = null;
			if (action.payload.abilityToAddTask) {
				if (state.isTable) {
					state.meta.total = state.meta.total + 1;
				}
				if (state.isTable && !state.isHierarchy) {
					state.tasks.data.unshift(action.payload.task);
				}
				if (state.isKanban) {
					state.addedToKanbanTask = action.payload.task;
				}
			}
			state.addedTask = action.payload.task;
			if (Array.isArray(state.kanban[action.payload.entityCode]?.stages?.[action.payload.stageId]?.data)) {
				state.kanban[action.payload.entityCode].stages[action.payload.stageId].data = [
					action.payload.task,
					...state.kanban[action.payload.entityCode].stages[action.payload.stageId].data,
				];
				if (state.kanban[action.payload.entityCode].stages[action.payload.stageId].meta) {
					state.kanban[action.payload.entityCode].stages[action.payload.stageId].meta.total++;
				}
				state.kanban[action.payload.entityCode].stages[action.payload.stageId].loading = false;
				state.kanban[action.payload.entityCode].stages[action.payload.stageId].errorMessage = null;
			}
		},
		[createTask.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode?: string; stageId?: number } }>) => {
			const { entityCode, stageId } = action.meta.arg;
			state.loadingCreatingTask = true;
			state.errorLoadingCreatingTask = null;

			if (Array.isArray(state?.kanban?.[entityCode]?.stages?.[stageId]?.data)) {
				state.kanban[entityCode].stages[stageId].loading = true;
				state.kanban[entityCode].stages[stageId].errorMessage = null;
			}
		},
		[createTask.rejected.type]: (
			state,
			action: PayloadAction<IErrorsAxiosResponse, string, { arg: { entityCode?: string; stageId?: number } }>,
		) => {
			const { entityCode, stageId } = action.meta.arg;
			state.loadingCreatingTask = false;
			state.errorLoadingCreatingTask = action.payload;

			if (Array.isArray(state?.kanban?.[entityCode]?.stages?.[stageId]?.data)) {
				state.kanban[entityCode].stages[stageId].loading = false;
				state.kanban[entityCode].stages[stageId].errorMessage = action.payload;
			}
		},
		[replicateTask.fulfilled.type]: (
			state,
			action: PayloadAction<{ task: ITask; abilityToAddTask: boolean; entityCode?: string; stageId?: number }>,
		) => {
			state.loadingCreatingTask = false;
			state.errorLoadingCreatingTask = null;
			if (action.payload.abilityToAddTask) {
				if (state.isTable) {
					state.meta.total = state.meta.total + 1;
				}
				if (state.isTable) {
					state.tasks.data.unshift(action.payload.task);
				}

				if (state.isKanban) {
					state.addedToKanbanTask = action.payload.task;
				}
			}
			state.addedTask = action.payload.task;
			if (Array.isArray(state.kanban[action.payload.entityCode]?.stages?.[action.payload.stageId]?.data)) {
				state.kanban[action.payload.entityCode].stages[action.payload.stageId].data = [
					action.payload.task,
					...state.kanban[action.payload.entityCode].stages[action.payload.stageId].data,
				];
				if (state.kanban[action.payload.entityCode].stages[action.payload.stageId].meta) {
					state.kanban[action.payload.entityCode].stages[action.payload.stageId].meta.total++;
				}
				state.kanban[action.payload.entityCode].stages[action.payload.stageId].loading = false;
				state.kanban[action.payload.entityCode].stages[action.payload.stageId].errorMessage = null;
			}
		},
		[replicateTask.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode?: string; stageId?: number } }>) => {
			const { entityCode, stageId } = action.meta.arg;
			state.loadingCreatingTask = true;
			state.errorLoadingCreatingTask = null;

			if (Array.isArray(state?.kanban?.[entityCode]?.stages?.[stageId]?.data)) {
				state.kanban[entityCode].stages[stageId].loading = true;
				state.kanban[entityCode].stages[stageId].errorMessage = null;
			}
		},
		[replicateTask.rejected.type]: (
			state,
			action: PayloadAction<IErrorsAxiosResponse, string, { arg: { entityCode?: string; stageId?: number } }>,
		) => {
			const { entityCode, stageId } = action.meta.arg;
			state.loadingCreatingTask = false;
			state.errorLoadingCreatingTask = action.payload;
			if (Array.isArray(state?.kanban?.[entityCode]?.stages?.[stageId]?.data)) {
				state.kanban[entityCode].stages[stageId].loading = false;
				state.kanban[entityCode].stages[stageId].errorMessage = action.payload;
			}
		},
		[updateTask.fulfilled.type]: (state, action: PayloadAction<ITask, string, { arg: { entityCode?: string; stageId?: number } }>) => {
			const { entityCode, stageId } = action.meta.arg;

			state.loadingUpdatingTask = false;
			state.errorLoadingUpdatingTask = null;
			if (state.isTable) {
				state.tasks.data = state.tasks.data.map((task) => (task?.id === action?.payload?.id ? action.payload : task));
			}
			if (state.isKanban || state.isHierarchy) {
				state.changeTask = action?.payload;
			}

			if (Array.isArray(state?.kanban?.[entityCode]?.stages?.[stageId]?.data)) {
				state.kanban[entityCode].stages[stageId].loading = false;
				state.kanban[entityCode].stages[stageId].errorMessage = null;
				state.kanban[entityCode].stages[stageId].data = state.kanban[entityCode].stages[stageId].data.map((item) => {
					if (item?.id === action?.payload?.id) return { ...item, ...action.payload };
					return item;
				});
			}
		},
		[updateTask.pending.type]: (state) => {
			state.loadingUpdatingTask = true;
			state.errorLoadingUpdatingTask = null;
		},
		[updateTask.rejected.type]: (
			state,
			action: PayloadAction<IErrorsAxiosResponse, string, { arg: { entityCode?: string; stageId?: number } }>,
		) => {
			const { entityCode, stageId } = action.meta.arg;
			state.loadingUpdatingTask = false;
			state.errorLoadingUpdatingTask = action.payload;

			if (Array.isArray(state?.kanban?.[entityCode]?.stages?.[stageId]?.data)) {
				state.kanban[entityCode].stages[stageId].loading = false;
				state.kanban[entityCode].stages[stageId].errorMessage = action.payload;
			}
		},
		[delegationTask.fulfilled.type]: (state, action: PayloadAction<ITask, string, { arg: { entityCode?: string; stageId?: number } }>) => {
			const { entityCode, stageId } = action.meta.arg;
			state.loadingUpdatingTask = false;
			state.errorLoadingUpdatingTask = null;
			if (state.isTable) {
				state.tasks.data = state.tasks.data.map((task) => (task?.id === action?.payload?.id ? action.payload : task));
			}
			if (state.isKanban) {
				state.changeTask = action?.payload;
			}

			if (Array.isArray(state?.kanban?.[entityCode]?.stages?.[stageId]?.data)) {
				state.kanban[entityCode].stages[stageId].loading = false;
				state.kanban[entityCode].stages[stageId].errorMessage = null;
				state.kanban[entityCode].stages[stageId].data = state.kanban[entityCode].stages[stageId].data.map((item) => {
					if (item?.id === action?.payload?.id) return { ...item, ...action.payload };
					return item;
				});
			}
		},
		[delegationTask.pending.type]: (state) => {
			state.loadingUpdatingTask = true;
			state.errorLoadingUpdatingTask = null;
		},
		[delegationTask.rejected.type]: (
			state,
			action: PayloadAction<IErrorsAxiosResponse, string, { arg: { entityCode?: string; stageId?: number } }>,
		) => {
			const { entityCode, stageId } = action.meta.arg;
			state.loadingUpdatingTask = false;
			state.errorLoadingUpdatingTask = action.payload;

			if (Array.isArray(state?.kanban?.[entityCode]?.stages?.[stageId]?.data)) {
				state.kanban[entityCode].stages[stageId].loading = false;
				state.kanban[entityCode].stages[stageId].errorMessage = action.payload;
			}
		},
		[massTasksEditing.fulfilled.type]: (state, action: PayloadAction<IMassActions>) => {
			state.loadingMassActionsTasks = false;
			state.errorLoadingMassActionsTasks = null;

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

					return copiedTask;
				}

				return task;
			});
		},
		[massTasksEditing.pending.type]: (state) => {
			state.loadingMassActionsTasks = true;
			state.errorLoadingMassActionsTasks = null;
		},
		[massTasksEditing.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingMassActionsTasks = false;
			state.errorLoadingMassActionsTasks = action.payload;
		},
		[deleteTask.fulfilled.type]: (
			state,
			action: PayloadAction<IDeleteTaskPayload, string, { arg: { id: string; entityCode: string; stageId: number } }>,
		) => {
			const { id, entityCode, stageId } = action.meta.arg;
			state.loadingMassActionsTasks = false;
			state.errorLoadingMassActionsTasks = null;
			if (state.isKanban || state.isHierarchy) {
				state.deleteTaskId = +action?.payload?.id;
			}
			if (state.isTable) {
				state.meta.total = state.meta.total - 1;
			}
			if (state.isTable) {
				if (state.tasksServiceType === action.payload.type) {
					state.tasks.data = state.tasks.data.filter((task) => task?.id !== String(action?.payload?.id));
				}
			}
			if (Array.isArray(state?.kanban?.[entityCode]?.stages?.[stageId]?.data)) {
				state.kanban[entityCode].stages[stageId].data = state.kanban[entityCode].stages[stageId].data.filter((item) => item?.id !== id);
				if (state.kanban[entityCode].stages[stageId].meta) state.kanban[entityCode].stages[stageId].meta.total--;
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
		[updateTaskStatus.fulfilled.type]: (state, action: PayloadAction<ITask, string, { arg: { entityCode: string; stageId: string } }>) => {
			const { entityCode, stageId } = action.meta.arg;

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
			if (Array.isArray(state?.kanban?.[entityCode]?.stages?.[stageId]?.data)) {
				state.kanban[entityCode].stages[stageId].loading = false;
				state.kanban[entityCode].stages[stageId].errorMessage = null;
				state.kanban[entityCode].stages[stageId].data = state.kanban[entityCode].stages[stageId].data.map((item) => {
					if (item?.id === action?.payload?.id) return { ...item, ...action.payload };
					return item;
				});
			}
		},
		[updateTaskStatus.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string; stageId: number } }>) => {
			const { entityCode, stageId } = action.meta.arg;
			state.loadingStatusesTask = true;
			state.errorLoadingStatusesTask = null;
			if (Array.isArray(state?.kanban?.[entityCode]?.stages?.[stageId]?.data)) {
				state.kanban[entityCode].stages[stageId].errorMessage = null;
			}
		},
		[updateTaskStatus.rejected.type]: (
			state,
			action: PayloadAction<IErrorsAxiosResponse, string, { arg: { entityCode: string; stageId: number } }>,
		) => {
			const { entityCode, stageId } = action.meta.arg;
			state.loadingStatusesTask = false;
			state.errorLoadingStatusesTask = action.payload;

			if (Array.isArray(state?.kanban?.[entityCode]?.stages?.[stageId]?.data)) {
				state.kanban[entityCode].stages[stageId].loading = false;
				state.kanban[entityCode].stages[stageId].errorMessage = action.payload;
			}
		},
		[massCompletion.fulfilled.type]: (state, action: PayloadAction<IMassActions>) => {
			state.loadingMassActionsTasks = false;
			state.errorLoadingMassActionsTasks = null;
			state.tasks.data = state.tasks.data.map((task) => {
				const responsibleUser = task?.responsibleId === String(action.payload.profile?.id);
				const setterTaskUser = task?.setterId === String(action.payload.profile.id);
				const accompliceUser = task?.accomplicesIds?.includes(String(action.payload.profile?.id));

				const checkPermissionsForFinishTask = responsibleUser || setterTaskUser || accompliceUser;

				if (action.payload.taskIds.includes(task?.id) && checkPermissionsForFinishTask) {
					task.status = task?.acceptResult && !setterTaskUser ? 'inControl' : 'ready';

					return task;
				}

				return task;
			});
		},
		[massCompletion.pending.type]: (state) => {
			state.loadingMassActionsTasks = true;
			state.errorLoadingMassActionsTasks = null;
		},
		[massCompletion.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingMassActionsTasks = false;
			state.errorLoadingMassActionsTasks = action.payload;
		},
		[getTasksFields.fulfilled.type]: (state, action: PayloadAction<IField[]>) => {
			state.loadingTasksFields = false;
			state.errorLoadingTasksFields = null;
			state.fields = cloneDeep(action?.payload || []).map((field) => {
				return {
					...field,
					values: Array.isArray(field.values) ? field.values?.sort((a, b) => a.sort - b.sort) : field.values,
				};
			});
		},
		[getTasksFields.pending.type]: (state) => {
			state.loadingTasksFields = true;
			state.errorLoadingTasksFields = null;
		},
		[getTasksFields.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingTasksFields = false;
			state.errorLoadingTasksFields = action.payload;
		},
		[createTasksField.fulfilled.type]: (state, action: PayloadAction<IField, string, { arg: IField }>) => {
			state.loadingCreatingTasksField = false;
			state.errorLoadingCreatingTasksField = null;

			const newField = action.meta.arg;
			state.fields.push(newField);
		},
		[createTasksField.pending.type]: (state) => {
			state.loadingCreatingTasksField = true;
			state.errorLoadingCreatingTasksField = null;
		},
		[createTasksField.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreatingTasksField = false;
			state.errorLoadingCreatingTasksField = action.payload;
		},
		[updateTasksField.fulfilled.type]: (state, action: PayloadAction<IField, string, { arg: IField }>) => {
			state.loadingUpdatingTasksField = false;
			state.errorLoadingUpdatingTasksField = null;

			const updateField = action.meta.arg;
			state.fields = state.fields.map((field) => {
				if (field.code === updateField.code) {
					return { ...updateField, values: updateField?.values || field?.values };
				}
				return field;
			});
		},
		[updateTasksField.pending.type]: (state) => {
			state.loadingUpdatingTasksField = true;
			state.errorLoadingUpdatingTasksField = null;
		},
		[updateTasksField.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingTasksField = false;
			state.errorLoadingUpdatingTasksField = action.payload;
		},
		[updateTasksListValues.fulfilled.type]: (state, action: PayloadAction<IField, string, { arg: IField }>) => {
			state.loadingUpdatingTasksField = false;
			state.errorLoadingUpdatingTasksField = null;

			const updateField = action.meta.arg;
			state.fields = state.fields.map((field) => {
				if (field.code === updateField.code) {
					return { ...field, values: updateField?.values || field?.values };
				}
				return field;
			});
		},
		[updateTasksListValues.pending.type]: (state) => {
			state.loadingUpdatingTasksField = true;
			state.errorLoadingUpdatingTasksField = null;
		},
		[updateTasksListValues.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingTasksField = false;
			state.errorLoadingUpdatingTasksField = action.payload;
		},
		[deleteTasksListValues.fulfilled.type]: (state, action: PayloadAction<string, string, { arg: { fieldCode: string; value: string } }>) => {
			state.loadingDeletingTasksField = false;
			state.errorLoadingDeletingTasksField = null;

			state.fields = state.fields.map((field) => {
				if (field.code === action.meta.arg.fieldCode) {
					field.values = field.values.filter((value) => value.value !== action.meta.arg.value);
				}
				return field;
			});
		},
		[deleteTasksListValues.pending.type]: (state) => {
			state.loadingDeletingTasksField = true;
			state.errorLoadingDeletingTasksField = null;
		},
		[deleteTasksListValues.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeletingTasksField = false;
			state.errorLoadingDeletingTasksField = action.payload;
		},
		[deleteTasksField.fulfilled.type]: (state, action: PayloadAction<string, string, { arg: string }>) => {
			state.loadingDeletingTasksField = false;
			state.errorLoadingDeletingTasksField = null;

			state.fields = state.fields.filter((field) => field.code !== action.meta.arg);
		},
		[deleteTasksField.pending.type]: (state) => {
			state.loadingDeletingTasksField = true;
			state.errorLoadingDeletingTasksField = null;
		},
		[deleteTasksField.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeletingTasksField = false;
			state.errorLoadingDeletingTasksField = action.payload;
		},
		[moveTaskFromStageToStage.pending.type]: (state, action: PayloadAction<unknown, string, { arg: IMoveCardsData }>) => {
			const { taskId, prevTaskId, stageId, entityCode } = action.meta.arg;

			const stages = state?.kanban?.[entityCode]?.stages;
			const destinationStage = stages?.[stageId];

			if (!stages) return;
			if (!destinationStage) return;

			let movedItem = null;
			let sourceStage = null;

			Object.values(stages || {}).forEach((stage) => {
				const found = stage?.data?.find((item) => String(item?.id) === String(taskId));
				if (found) {
					movedItem = found;
					sourceStage = stage;
				}
				stage.data = stage?.data?.filter((item) => String(item?.id) !== String(taskId));
			});

			if (!movedItem) return;

			movedItem = { ...movedItem, kanbanStageId: String(stageId) };

			const overIndex = destinationStage?.data?.findIndex((item) => +item?.id === +prevTaskId);

			if (overIndex >= 0) destinationStage.data.splice(overIndex + 1, 0, movedItem);
			else destinationStage?.data?.unshift(movedItem);

			if (sourceStage && sourceStage !== destinationStage) {
				sourceStage.meta.total = Math.max(0, (sourceStage.meta.total ?? 0) - 1);
				destinationStage.meta.total = (destinationStage.meta.total ?? 0) + 1;
			}
		},
	},
});

export const {
	setTasks,
	clearAddedTaskReducer,
	clearAddedToKanbanTaskReducer,
	clearChangeTask,
	clearDeleteTaskId,
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
	clearTasks,
	setIsCopyingTask,
	setIsTaskFromTemplate,
	removeTaskFromNPositionTable,
	setIsKanban,
	setIsTable,
	setIsHierarchy,
	setIsRegularSection,
	setTotalTasks,
	setAnEditMode,
	setTasksServiceType,
	setAiTaskData,
	updateItemLocal,
	addPendingTaskItem,
	removePendingTaskItem,
	flushPendingTaskItems,
	deleteItemLocal,
	moveTaskFromStageToStageLocal,
	removeKanbanItemLocal,
	updateKanbanItemLocal,
	addKanbanItemLocal,
} = tasksReducer.actions;
export default tasksReducer.reducer;
