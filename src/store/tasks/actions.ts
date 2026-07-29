/* eslint-disable camelcase */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IField } from '@uspacy/sdk/lib/models/field';
import { ITask, ITasksParams, taskType } from '@uspacy/sdk/lib/models/tasks';
import { updateTaskStatusActionType } from '@uspacy/sdk/lib/services/TasksService/dto/create-update-task.dto';
import { IMassActions } from '@uspacy/sdk/lib/services/TasksService/dto/mass-actions.dto';

import { transformKeysToCaseByType } from '../../helpers/objectsUtilities';
import { ICreateTaskPayload, IDeleteTaskPayload, IMoveCardsData } from './types';

export const getTasks = createAsyncThunk(
	'tasks/getTasks',
	async ({ params, withoutResponsible, signal }: { params: ITasksParams; withoutResponsible?: boolean; signal?: AbortSignal }, thunkAPI) => {
		try {
			const res = await uspacySdk.tasksService.getTasks(params, withoutResponsible, signal);
			return res.data;
		} catch (e) {
			if (signal.aborted) {
				return {
					aborted: true,
				};
			} else {
				return thunkAPI.rejectWithValue(e);
			}
		}
	},
);

export const getRecurringTemplates = createAsyncThunk(
	'tasks/getRecurringTemplates',
	async ({ params, withoutResponsible, signal }: { params: ITasksParams; withoutResponsible?: boolean; signal?: AbortSignal }, thunkAPI) => {
		try {
			const res = await uspacySdk.tasksService.getRecurringTemplates(params, withoutResponsible, signal);
			return res.data;
		} catch (e) {
			if (signal.aborted) {
				return {
					aborted: true,
				};
			} else {
				return thunkAPI.rejectWithValue(e);
			}
		}
	},
);

export const getOneTimeTemplates = createAsyncThunk(
	'tasks/getOneTimeTemplates',
	async ({ params, withoutResponsible, signal }: { params: ITasksParams; withoutResponsible?: boolean; signal?: AbortSignal }, thunkAPI) => {
		try {
			const res = await uspacySdk.tasksService.getOneTimeTemplates(params, withoutResponsible, signal);
			return res.data;
		} catch (e) {
			if (signal.aborted) {
				return {
					aborted: true,
				};
			} else {
				return thunkAPI.rejectWithValue(e);
			}
		}
	},
);

export const getHierarchies = createAsyncThunk(
	'tasks/getHierarchies',
	async ({ params, withoutResponsible, signal }: { params: ITasksParams; withoutResponsible?: boolean; signal?: AbortSignal }, thunkAPI) => {
		try {
			const res = await uspacySdk.tasksService.getHierarchies(params, withoutResponsible, signal);
			return res.data;
		} catch (e) {
			if (signal.aborted) {
				return {
					aborted: true,
				};
			} else {
				return thunkAPI.rejectWithValue(e);
			}
		}
	},
);

export const getTasksItemsByStage = createAsyncThunk(
	'tasks/getTasksItemsByStage',
	async (
		{
			filters,
			signal,
		}: {
			filters: Omit<ITasksParams, 'openDatePicker'>;
			entityCode?: string;
			stageId?: number;
			signal?: AbortSignal;
			stagesIds?: number[];
		},
		{ rejectWithValue },
	) => {
		try {
			const res = await uspacySdk.tasksService.getTasks(filters);
			return res.data;
		} catch (e) {
			if (signal.aborted) {
				return {
					aborted: true,
				};
			} else {
				return rejectWithValue(e);
			}
		}
	},
);

export const createTask = createAsyncThunk(
	'tasks/createTask',
	async ({ data, abilityToAddTask, entityCode, stageId, type }: ICreateTaskPayload, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.createTask(data, type);
			return { task: res.data, abilityToAddTask, entityCode, stageId };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const replicateTask = createAsyncThunk(
	'tasks/replicateTask',
	async ({ data, abilityToAddTask, id, entityCode, stageId }: ICreateTaskPayload, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.replicateTask(data, id);
			return { task: res.data, abilityToAddTask, entityCode, stageId };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const updateTask = createAsyncThunk(
	'tasks/updateTask',
	async ({ type, id, data }: { type: taskType; id: string; data: Partial<ITask>; entityCode?: string; stageId?: number }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.updateTask(id, data, type);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const updateTaskStatus = createAsyncThunk(
	'tasks/updateTaskStatus',
	async ({ id, action }: { id: string; action: updateTaskStatusActionType; entityCode?: string; stageId?: number }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.updateTaskStatus(id, action);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const delegationTask = createAsyncThunk(
	'tasks/delegationTask',
	async ({ id, user_id }: { id: string; user_id: number; entityCode?: string; stageId?: number }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.delegationTask(id, user_id);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const massTasksEditing = createAsyncThunk(
	'tasks/massTasksEditing',
	async ({ taskIds, exceptIds, all, params, withoutResponsible, payload, settings, profile, admin }: IMassActions, { rejectWithValue }) => {
		try {
			await uspacySdk.tasksService.massEditingTasks(taskIds, exceptIds, all, params, withoutResponsible, payload, settings);

			return { taskIds, exceptIds, all, payload, settings, profile, admin };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', async ({ id }: IDeleteTaskPayload, { rejectWithValue }) => {
	try {
		return await uspacySdk.tasksService.deleteTask(id);
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const massTasksDeletion = createAsyncThunk(
	'tasks/massTasksDeletion',
	async ({ taskIds, exceptIds, all, params, withoutResponsible, profile, admin }: IMassActions, { rejectWithValue }) => {
		try {
			await uspacySdk.tasksService.massDeletionTasks(taskIds, exceptIds, all, params, withoutResponsible);

			return { taskIds, exceptIds, all, profile, admin };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const massCompletion = createAsyncThunk(
	'tasks/massCompletion',
	async ({ taskIds, exceptIds, all, params, withoutResponsible, profile }: IMassActions, { rejectWithValue }) => {
		try {
			await uspacySdk.tasksService.massCompletionTasks(taskIds, exceptIds, all, params, withoutResponsible);

			return { taskIds, exceptIds, all, profile };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const getTasksFields = createAsyncThunk('tasks/getTasksFields', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.getTasksFields();
		const preparedFields = res.data.data.map((field) => transformKeysToCaseByType(field, 'snake')) as IField[];

		return preparedFields;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const updateTasksField = createAsyncThunk('tasks/updateTasksField', async (data: IField, { rejectWithValue }) => {
	try {
		const fieldsToCamelCase = transformKeysToCaseByType(data, 'camel') as IField;
		const res = await uspacySdk.tasksService.updateTasksField(data.code, fieldsToCamelCase);

		const fieldsToSnakeCase = transformKeysToCaseByType(res.data, 'snake') as IField;
		return fieldsToSnakeCase;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const updateTasksListValues = createAsyncThunk('tasks/updateTasksListValues', async (data: IField, { rejectWithValue }) => {
	try {
		const fieldsToCamelCase = transformKeysToCaseByType(data, 'camel') as IField;
		const res = await uspacySdk.tasksService.updateTasksListValues(fieldsToCamelCase);

		const fieldsToSnakeCase = transformKeysToCaseByType(res.data, 'snake') as IField;
		return fieldsToSnakeCase;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const createTasksField = createAsyncThunk('tasks/createTasksField', async (data: IField, { rejectWithValue }) => {
	try {
		const fieldsToCamelCase = transformKeysToCaseByType(data, 'camel') as IField;
		const res = await uspacySdk.tasksService.createTasksField(fieldsToCamelCase);

		const fieldsToSnakeCase = transformKeysToCaseByType(res.data, 'snake') as IField;
		return fieldsToSnakeCase;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const deleteTasksListValues = createAsyncThunk(
	'tasks/deleteTasksListValues',
	async ({ fieldCode, value }: { fieldCode: string; value: string }, thunkAPI) => {
		try {
			await uspacySdk.tasksService.deleteTasksListValues(fieldCode, value);
			return { value, fieldCode };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const deleteTasksField = createAsyncThunk('tasks/deleteTasksField', async (fieldCode: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.deleteTasksField(fieldCode);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const moveTaskFromStageToStage = createAsyncThunk(
	'tasks/moveTaskFromStageToStage',
	async ({ taskId, prevTaskId, stageId }: IMoveCardsData, { rejectWithValue }) => {
		try {
			return await uspacySdk.tasksStagesService.moveTaskFromStageToStage(taskId, prevTaskId, stageId);
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);
