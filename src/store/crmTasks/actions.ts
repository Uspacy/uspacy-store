import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ITaskFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { ITask } from '@uspacy/sdk/lib/models/crm-tasks';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmTasksService?.getTasks();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTask = createAsyncThunk('tasks/createTask', async (data: any, thunkAPI) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, ...rest } = data;
		const res = await uspacySdk.crmTasksService.createTask(rest);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const fetchTasksWithFilters = createAsyncThunk(
	'tasks/fetchTasksWithFilters',
	async (data: { params: Omit<ITaskFilters, 'openDatePicker'>; signal: AbortSignal }, thunkAPI) => {
		const params = {
			page: data.params.page,
			list: data.params.perPage,
			status: data.params.status,
			type: Array.isArray(data?.params?.task_type) ? data?.params?.task_type : [],
			participants: data.params.participants,
			responsible_id: data.params.responsible_id,
			start_time: data.params.period,
			...(data.params.search ? { q: data.params.search } : {}),
		};
		try {
			const res = await uspacySdk.crmTasksService.getTasksWithFilters(params, data?.signal);
			return res?.data;
		} catch (e) {
			if (data.signal.aborted) {
				return {
					aborted: true,
				};
			} else {
				return thunkAPI.rejectWithValue('Failure');
			}
		}
	},
);

export const editTask = createAsyncThunk('tasks/edit', async ({ id, data }: { id: number; data: Partial<ITask> }, thunkAPI) => {
	try {
		const res = await uspacySdk.crmTasksService.updateTask(id, data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const fetchTaskById = createAsyncThunk('tasks/fetchTaskById', async (id: string, thunkAPI) => {
	try {
		const res = await uspacySdk.crmTasksService.getTask(id);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure!');
	}
});

export const deleteTaskById = createAsyncThunk('tasks/deleteTaskById', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.crmTasksService.deleteTask(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const massTasksDeletion = createAsyncThunk(
	'crmTasks/massTasksDeletion',
	async ({ entityIds, exceptIds, all, params }: IMassActions, { rejectWithValue }) => {
		try {
			await uspacySdk.crmTasksService.massTasksDeletion({
				all,
				entityIds,
				exceptIds,
				params: all && params?.length ? `/?${params}` : '',
			});

			return { entityIds, exceptIds, all };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const massTasksEditing = createAsyncThunk(
	'crmTasks/massTasksEditing',
	async ({ entityIds, exceptIds, all, params, payload, settings, profile, admin }: IMassActions, { rejectWithValue }) => {
		try {
			await uspacySdk.crmTasksService.massTasksEditing({
				all,
				entityIds,
				exceptIds,
				params: all && params?.length ? `/?${params}` : '',
				payload,
				settings,
			});

			return { entityIds, exceptIds, all, params, payload, settings, profile, admin };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);
