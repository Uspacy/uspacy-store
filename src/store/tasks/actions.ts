/* eslint-disable camelcase */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ITasksParams } from '@uspacy/sdk/lib/models/tasks';
import { ITaskValues } from '@uspacy/sdk/lib/services/TasksService/dto/create-update-task.dto';
import { IMassActions } from '@uspacy/sdk/lib/services/TasksService/dto/mass-actions.dto';

import { ICreateTaskPayload, IDeleteTaskPayload } from './types';

export const getTasks = createAsyncThunk(
	'tasks/getTasks',
	async ({ params, withoutResponsible, signal }: { params: ITasksParams; withoutResponsible: boolean; signal: AbortSignal }, thunkAPI) => {
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
	async ({ params, withoutResponsible, signal }: { params: ITasksParams; withoutResponsible: boolean; signal: AbortSignal }, thunkAPI) => {
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
	async ({ params, withoutResponsible, signal }: { params: ITasksParams; withoutResponsible: boolean; signal: AbortSignal }, thunkAPI) => {
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

export const getSubtasks = createAsyncThunk(
	'tasks/getSubtasks',
	async ({ id, page, list, isTemplate = false }: { id: string; page: number; list: number; isTemplate?: boolean }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.getSubtasks(id, page, list, isTemplate);
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

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, data }: { id: string; data: ITaskValues }, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.updateTask(id, data);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const updateRecurringTemplate = createAsyncThunk(
	'tasks/updateRecurringTemplate',
	async ({ id, data }: { id: string; data: ITaskValues }, { rejectWithValue }) => {
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
	async ({ id, data }: { id: string; data: ITaskValues }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.updateOneTimeTemplate(id, data);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const updateSubtask = createAsyncThunk('tasks/updateSubtask', async ({ id, data }: { id: string; data: ITaskValues }, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.updateSubtask(id, data);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

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

export const fetchTaskFields = createAsyncThunk('tasks/fetchTaskFields', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.getTasksField();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});
