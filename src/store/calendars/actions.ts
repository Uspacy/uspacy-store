import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ICalendarSettings, ISyncSettings } from '@uspacy/sdk/lib/services/CrmTasksService/calendars-settings.dto';

export const getOAuth2CalendarRedirectUrl = createAsyncThunk('calendars/getOAuth2CalendarRedirectUrl', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk?.crmTasksService?.getOAuth2CalendarRedirectUrl();
		return res?.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getCalendarsAccounts = createAsyncThunk('calendars/getCalendarsAccounts', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk?.crmTasksService?.getCalendarsAccounts();
		return res?.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const deleteCalendarsAccount = createAsyncThunk('calendars/deleteCalendarsAccount', async (_: number, { rejectWithValue }) => {
	try {
		return await uspacySdk?.crmTasksService?.deleteCalendarsAccount();
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getGoogleCalendars = createAsyncThunk('calendars/getGoogleCalendars', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk?.crmTasksService?.getGoogleCalendars();
		return res?.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const saveCalendarSettings = createAsyncThunk('calendars/saveCalendarSettings', async (body: ICalendarSettings, { rejectWithValue }) => {
	try {
		const res = await uspacySdk?.crmTasksService?.saveCalendarSettings(body);
		return res?.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const startInitialGoogleCalendarsSync = createAsyncThunk(
	'calendars/startInitialGoogleCalendarsSync',
	async ({ body }: { body: ISyncSettings; id: number }, { rejectWithValue }) => {
		try {
			return await uspacySdk?.crmTasksService?.startInitialGoogleCalendarsSync(body);
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const startCalendarsSync = createAsyncThunk('calendars/startCalendarsSync', async (_: number, { rejectWithValue }) => {
	try {
		return await uspacySdk?.crmTasksService?.startCalendarsSync();
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const stopGoogleCalendarsSync = createAsyncThunk('calendars/stopGoogleCalendarsSync', async (_: number, { rejectWithValue }) => {
	try {
		return await uspacySdk?.crmTasksService?.stopGoogleCalendarsSync();
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const activateGoogleCalendarsSync = createAsyncThunk('calendars/activateGoogleCalendarsSync', async (id: number, { rejectWithValue }) => {
	try {
		return await uspacySdk?.crmTasksService?.activateGoogleCalendarsSync(id);
	} catch (e) {
		return rejectWithValue(e);
	}
});
