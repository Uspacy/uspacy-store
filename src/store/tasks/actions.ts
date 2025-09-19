/* eslint-disable camelcase */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IField } from '@uspacy/sdk/lib/models/field';
import { IChecklist, IChecklistItem, ITask, ITasksParams } from '@uspacy/sdk/lib/models/tasks';
import { IMassActions } from '@uspacy/sdk/lib/services/TasksService/dto/mass-actions.dto';

import { transformKeysToCaseByType } from '../../helpers/objectsUtilities';
import { ICreateTaskPayload, IDeleteTaskPayload } from './types';

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

export const getSubtasks = createAsyncThunk(
	'tasks/getSubtasks',
	async ({ id, isTemplate = false, params }: { id: string; isTemplate?: boolean; params?: Partial<ITasksParams> }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.getSubtasks(id, isTemplate, params);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const getTask = createAsyncThunk(
	'tasks/getTask',
	async ({ id, crm_entity_list }: { id: string; crm_entity_list?: boolean }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.getTask(id, crm_entity_list);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const getRecurringTemplate = createAsyncThunk(
	'tasks/getRecurringTemplate',
	async ({ id, crm_entity_list }: { id: string; crm_entity_list?: boolean }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.getRecurringTemplate(id, crm_entity_list);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const getParentTask = createAsyncThunk('tasks/getParentTask', async (id: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.getParentTask(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const createTask = createAsyncThunk('tasks/createTask', async ({ data, abilityToAddTask }: ICreateTaskPayload, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.createTask(data);
		return { task: res.data, abilityToAddTask };
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const createRecurringTemplate = createAsyncThunk(
	'tasks/createRecurringTemplate',
	async ({ data, abilityToAddTask }: ICreateTaskPayload, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.createRecurringTemplate(data);
			return { task: res.data, abilityToAddTask };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const createOneTimeTemplate = createAsyncThunk(
	'tasks/createOneTimeTemplate',
	async ({ data, abilityToAddTask }: ICreateTaskPayload, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.createOneTimeTemplate(data);
			return { task: res.data, abilityToAddTask };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const replicateTask = createAsyncThunk(
	'tasks/replicateTask',
	async ({ data, abilityToAddTask, id }: ICreateTaskPayload, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.replicateTask(data, id);
			return { task: res.data, abilityToAddTask };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, data }: { id: string; data: Partial<ITask> }, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.updateTask(id, data);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const updateRecurringTemplate = createAsyncThunk(
	'tasks/updateRecurringTemplate',
	async ({ id, data }: { id: string; data: Partial<ITask> }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.updateRecurringTemplate(id, data);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const updateOneTimeTemplate = createAsyncThunk(
	'tasks/updateOneTimeTemplate',
	async ({ id, data }: { id: string; data: Partial<ITask> }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.updateOneTimeTemplate(id, data);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const updateSubtask = createAsyncThunk(
	'tasks/updateSubtask',
	async ({ id, data }: { id: string; data: Partial<ITask> }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.updateSubtask(id, data);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const delegationTask = createAsyncThunk(
	'tasks/delegationTask',
	async ({ id, user_id }: { id: string; user_id: number }, { rejectWithValue }) => {
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

export const deleteTask = createAsyncThunk('tasks/deleteTask', async ({ id, type }: IDeleteTaskPayload, { rejectWithValue }) => {
	try {
		await uspacySdk.tasksService.deleteTask(id);
		return { id, type };
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

export const startTask = createAsyncThunk('tasks/startTask', async (id: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.startTask(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const pauseTask = createAsyncThunk('tasks/pauseTask', async (id: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.pauseTask(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const watchTask = createAsyncThunk('tasks/watchTask', async (id: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.watchTask(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const unwatchTask = createAsyncThunk('tasks/unwatchTask', async (id: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.unwatchTask(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const completeTask = createAsyncThunk('tasks/completeTask', async (id: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.completeTask(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

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

export const restartTask = createAsyncThunk('tasks/restartTask', async (id: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.restartTask(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

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

export const getChecklist = createAsyncThunk('tasks/getChecklist', async (id: number, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.getChecklist(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const createChecklist = createAsyncThunk(
	'tasks/createChecklist',
	async ({ body, taskId }: { taskId: string; body: IChecklist }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.createChecklist(taskId, body);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const updateChecklist = createAsyncThunk(
	'tasks/updateChecklist',
	async ({ id, body }: { id: number; body: IChecklist }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.updateChecklist(id, body);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const deleteChecklist = createAsyncThunk('tasks/deleteChecklist', async (id: number, { rejectWithValue }) => {
	try {
		return await uspacySdk.tasksService.deleteChecklist(id);
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getChecklistItem = createAsyncThunk(
	'tasks/getChecklistItem',
	async ({ checklistId, checklistItemId }: { checklistId: number; checklistItemId: number }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.getChecklistItem(checklistId, checklistItemId);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const createChecklistItem = createAsyncThunk(
	'tasks/createChecklistItem',
	async ({ checklistId, body }: { checklistId: number; body: Partial<IChecklistItem> }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.createChecklistItem(checklistId, body);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const updateChecklistItem = createAsyncThunk(
	'tasks/updateChecklistItem',
	async (
		{ checklistId, checklistItemId, body }: { checklistId: number; checklistItemId: number; body: Partial<IChecklistItem> },
		{ rejectWithValue },
	) => {
		try {
			const res = await uspacySdk.tasksService.updateChecklistItem(checklistId, checklistItemId, body);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const deleteChecklistItem = createAsyncThunk(
	'tasks/deleteChecklistItem',
	async ({ checklistId, checklistItemId }: { checklistId: number; checklistItemId: number }, { rejectWithValue }) => {
		try {
			return await uspacySdk.tasksService.deleteChecklistItem(checklistId, checklistItemId);
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);
