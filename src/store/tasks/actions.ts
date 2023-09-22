import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ITaskValues } from '@uspacy/sdk/lib/services/TasksService/dto/create-update-task.dto';
import { IMassDeletion } from '@uspacy/sdk/lib/services/TasksService/dto/mass-deletion.dto';

export const fetchTasksWithFilters = createAsyncThunk(
	'tasks/fetchTasksTest',
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async ({ params, withoutResponsible, signal }: { params: any; withoutResponsible: boolean; signal: AbortSignal }, thunkAPI) => {
		try {
			const res = await uspacySdk.tasksService.getTasksWithFilters(params, withoutResponsible, signal);
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

export const fetchRegularTasksWithFilters = createAsyncThunk(
	'tasks/fetchRegularTasksWithFilters',
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async ({ params, withoutResponsible, signal }: { params: any; withoutResponsible: boolean; signal: AbortSignal }, thunkAPI) => {
		try {
			const res = await uspacySdk.tasksService.getRegularTasksWithFilters(params, withoutResponsible, signal);
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

export const fetchSubtasks = createAsyncThunk(
	'tasks/fetchSubtasks',
	async ({ id, page, list, isTemplate = false }: { id: string; page: number; list: number; isTemplate?: boolean }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.getSubtasks(id, page, list, isTemplate);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const fetchTask = createAsyncThunk('tasks/fetchTask', async (id: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.getTask(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const fetchTemplate = createAsyncThunk('tasks/fetchTemplate', async (id: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.getTemplate(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const fetchParentTask = createAsyncThunk('tasks/fetchParentTask', async (id: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.getParentTask(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const addTask = createAsyncThunk('tasks/addTask', async (data: ITaskValues, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.createTask(data);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const editTask = createAsyncThunk('tasks/editTask', async ({ id, data }: { id: string; data: ITaskValues }, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.updateTask(id, data);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const editSubTask = createAsyncThunk('tasks/editSubTask', async ({ id, data }: { id: string; data: ITaskValues }, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.updateSubtask(id, data);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: string, { rejectWithValue }) => {
	try {
		await uspacySdk.tasksService.deleteTask(id);
		return id;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const massDeletion = createAsyncThunk(
	'tasks/massDeletion',
	async ({ taskIds, exceptIds, all, params, withoutResponsible }: IMassDeletion, { rejectWithValue }) => {
		try {
			await uspacySdk.tasksService.massDeletionTasks(taskIds, exceptIds, all, params, withoutResponsible);

			return { taskIds, exceptIds, all };
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

export const restartTask = createAsyncThunk('tasks/restartTask', async (id: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.restartTask(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});