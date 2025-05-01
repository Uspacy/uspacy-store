import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ITaskFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { ITask } from '@uspacy/sdk/lib/models/crm-tasks';
import { IField } from '@uspacy/sdk/lib/models/field';
import { oauthProvider, oauthType } from '@uspacy/sdk/lib/models/oauthIntegrations';
import { ICalendarSettings, ISyncSettings } from '@uspacy/sdk/lib/services/CrmTasksService/calendars-settings.dto';

import { getFilterParams } from './../../helpers/filterFieldsArrs';
import { makeURIParams } from './../../helpers/makeURIParams';

export const fetchTasks = createAsyncThunk('crmTasks/fetchTasks', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmTasksService?.getTasks();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTask = createAsyncThunk('crmTasks/createTask', async (data: any, thunkAPI) => {
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
	'crmTasks/fetchTasksWithFilters',
	async (data: { params: Omit<ITaskFilters, 'openDatePicker'>; signal: AbortSignal; fields?: IField[] }, thunkAPI) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const filterParam = getFilterParams(data.params as any, data?.fields || []);
		const params = makeURIParams(filterParam);
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

export const editTask = createAsyncThunk('crmTasks/edit', async ({ id, data }: { id: number; data: Partial<ITask> }, thunkAPI) => {
	try {
		const res = await uspacySdk.crmTasksService.updateTask(id, data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const fetchTaskById = createAsyncThunk('crmTasks/fetchTaskById', async (id: string, thunkAPI) => {
	try {
		const res = await uspacySdk.crmTasksService.getTask(id);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure!');
	}
});

export const deleteTaskById = createAsyncThunk('crmTasks/deleteTaskById', async (id: number, thunkAPI) => {
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

export const getOAuthRedirectUrl = createAsyncThunk(
	'crmTasks/getOAuthRedirectUrl',
	async ({ provider, type }: { provider: oauthProvider; type: oauthType }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.crmTasksService.getOAuthRedirectUrl(provider, type);
			return res?.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const getOauthServicesAccounts = createAsyncThunk(
	'crmTasks/getOauthServicesAccounts',
	async (params: { with: string[] }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.crmTasksService.getOauthServicesAccounts(params);
			return res?.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const getCalendars = createAsyncThunk('crmTasks/getCalendars', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.crmTasksService.getCalendars();
		return res?.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const saveCalendarsSettings = createAsyncThunk('crmTasks/saveCalendarsSettings', async (body: ICalendarSettings, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.crmTasksService.saveCalendarsSettings(body);
		return res?.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const startInitialServicesAccountSync = createAsyncThunk(
	'crmTasks/startInitialServicesAccountSync',
	async ({ body, providerId, integrationId }: { body: ISyncSettings; providerId: number; integrationId: number }, { rejectWithValue }) => {
		try {
			await uspacySdk.crmTasksService.startInitialServicesAccountSync(body);
			return { providerId, integrationId };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const startServicesAccountSync = createAsyncThunk(
	'crmTasks/startServicesAccountSync',
	async ({ providerId, integrationId }: { providerId: number; integrationId: number }, { rejectWithValue }) => {
		try {
			await uspacySdk.crmTasksService.startServicesAccountSync();
			return { providerId, integrationId };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const stopServicesAccountSync = createAsyncThunk(
	'crmTasks/stopServicesAccountSync',
	async ({ providerId, integrationId }: { providerId: number; integrationId: number }, { rejectWithValue }) => {
		try {
			await uspacySdk.crmTasksService.stopServicesAccountSync();
			return { providerId, integrationId };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const activateServicesAccountSync = createAsyncThunk(
	'crmTasks/activateServicesAccountSync',
	async ({ providerId, integrationId }: { providerId: number; integrationId: number }, { rejectWithValue }) => {
		try {
			await uspacySdk.crmTasksService.activateServicesAccountSync(integrationId);
			return { providerId, integrationId };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const deleteServicesAccount = createAsyncThunk(
	'crmTasks/deleteServicesAccount',
	async ({ providerId, integrationId }: { providerId: number; integrationId: number }, { rejectWithValue }) => {
		try {
			await uspacySdk.crmTasksService.deleteServicesAccount(providerId, integrationId);
			return { providerId, integrationId };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);
