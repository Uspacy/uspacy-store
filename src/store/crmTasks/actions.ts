import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ITaskFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { ITask } from '@uspacy/sdk/lib/models/crm-tasks';
import { IField } from '@uspacy/sdk/lib/models/field';
import { ICalendarSettings, ISyncSettings } from '@uspacy/sdk/lib/services/CrmTasksService/calendars-settings.dto';

import { getFilterParams } from './../../helpers/filterFieldsArrs';
import { makeURIParams } from './../../helpers/makeURIParams';

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
	async (data: { params: Omit<ITaskFilters, 'openDatePicker'>; signal: AbortSignal; fields?: IField[] }, thunkAPI) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const filterParam = getFilterParams(data.params as any, data?.fields || []);
		const params = makeURIParams(filterParam);
		try {
			// @ts-ignore, temporary!
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

export const getOAuth2CalendarRedirectUrl = createAsyncThunk('crmTasks/getOAuth2CalendarRedirectUrl', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk?.crmTasksService?.getOAuth2CalendarRedirectUrl();
		return res?.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getCalendarsAccounts = createAsyncThunk('crmTasks/getCalendarsAccounts', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk?.crmTasksService?.getCalendarsAccounts();
		return res?.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const deleteCalendarsAccount = createAsyncThunk('crmTasks/deleteCalendarsAccount', async (id: number, { rejectWithValue }) => {
	try {
		await uspacySdk?.crmTasksService?.deleteCalendarsAccount();
		return id;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getGoogleCalendars = createAsyncThunk('crmTasks/getGoogleCalendars', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk?.crmTasksService?.getGoogleCalendars();
		return res?.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const saveCalendarSettings = createAsyncThunk('crmTasks/saveCalendarSettings', async (body: ICalendarSettings, { rejectWithValue }) => {
	try {
		const res = await uspacySdk?.crmTasksService?.saveCalendarSettings(body);
		return res?.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const startInitialGoogleCalendarsSync = createAsyncThunk(
	'crmTasks/startInitialGoogleCalendarsSync',
	async ({ body, id }: { body: ISyncSettings; id: number }, { rejectWithValue }) => {
		try {
			await uspacySdk?.crmTasksService?.startInitialGoogleCalendarsSync(body);
			return id;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const startCalendarsSync = createAsyncThunk('crmTasks/startCalendarsSync', async (id: number, { rejectWithValue }) => {
	try {
		await uspacySdk?.crmTasksService?.startCalendarsSync();
		return id;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const stopGoogleCalendarsSync = createAsyncThunk('crmTasks/stopGoogleCalendarsSync', async (id: number, { rejectWithValue }) => {
	try {
		await uspacySdk?.crmTasksService?.stopGoogleCalendarsSync();
		return id;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const activateGoogleCalendarsSync = createAsyncThunk('crmTasks/activateGoogleCalendarsSync', async (id: number, { rejectWithValue }) => {
	try {
		await uspacySdk?.crmTasksService?.activateGoogleCalendarsSync(id);
		return id;
	} catch (e) {
		return rejectWithValue(e);
	}
});
