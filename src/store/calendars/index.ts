import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ECalendarAccountStatuses, ICalendar, ICalendarsAccount } from '@uspacy/sdk/lib/models/calendars';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

import {
	activateGoogleCalendarsSync,
	deleteCalendarsAccount,
	getCalendarsAccounts,
	getGoogleCalendars,
	getOAuth2CalendarRedirectUrl,
	saveCalendarSettings,
	startCalendarsSync,
	startInitialGoogleCalendarsSync,
	stopGoogleCalendarsSync,
} from './actions';
import { IState } from './types';

const initialState: IState = {
	redirectGoogleOauthUrl: '',
	calendarsAccounts: [],
	calendars: [],
	isSuccessCalendarSync: false,
	loadingGoogleOauthRedirectUrl: false,
	loadingCalendarsAccounts: false,
	loadingCalendars: false,
	loadingCalendarSync: false,
	loadingDeleteCalendarsAccounts: false,
	loadingSaveCalendarSettings: false,
	errorLoadingGoogleOauthRedirectUrl: null,
	errorLoadingCalendarsAccounts: null,
	errorLoadingCalendars: null,
	errorLoadingSaveCalendarSettings: null,
	errorLoadingCalendarSync: null,
	errorLoadingDeleteCalendarsAccounts: null,
};

const calendarsReducer = createSlice({
	name: 'calendars',
	initialState,
	reducers: {
		setRedirectGoogleOauthUrl: (state, action: PayloadAction<string>) => {
			state.redirectGoogleOauthUrl = action.payload;
		},
		setIsSuccessCalendarSync: (state, action: PayloadAction<boolean>) => {
			state.isSuccessCalendarSync = action.payload;
		},
	},
	extraReducers: {
		[getOAuth2CalendarRedirectUrl.fulfilled.type]: (state, action: PayloadAction<{ url: string }>) => {
			state.loadingGoogleOauthRedirectUrl = false;
			state.errorLoadingGoogleOauthRedirectUrl = null;
			state.redirectGoogleOauthUrl = action.payload.url;
		},
		[getOAuth2CalendarRedirectUrl.pending.type]: (state) => {
			state.loadingGoogleOauthRedirectUrl = true;
			state.errorLoadingGoogleOauthRedirectUrl = null;
		},
		[getOAuth2CalendarRedirectUrl.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingGoogleOauthRedirectUrl = false;
			state.errorLoadingGoogleOauthRedirectUrl = action.payload;
		},
		[getCalendarsAccounts.fulfilled.type]: (state, action: PayloadAction<IResponseWithMeta<ICalendarsAccount>>) => {
			state.loadingCalendarsAccounts = false;
			state.errorLoadingCalendarsAccounts = null;
			state.calendarsAccounts = action.payload.data;
		},
		[getCalendarsAccounts.pending.type]: (state) => {
			state.loadingCalendarsAccounts = true;
			state.errorLoadingCalendarsAccounts = null;
		},
		[getCalendarsAccounts.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCalendarsAccounts = false;
			state.errorLoadingCalendarsAccounts = action.payload;
		},
		[deleteCalendarsAccount.fulfilled.type]: (state, action: PayloadAction<number, string, { arg: number }>) => {
			state.loadingDeleteCalendarsAccounts = false;
			state.errorLoadingDeleteCalendarsAccounts = null;
			state.calendarsAccounts = state.calendarsAccounts.filter((item) => item.id !== action.meta.arg);
		},
		[deleteCalendarsAccount.pending.type]: (state) => {
			state.loadingDeleteCalendarsAccounts = true;
			state.errorLoadingDeleteCalendarsAccounts = null;
		},
		[deleteCalendarsAccount.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeleteCalendarsAccounts = false;
			state.errorLoadingDeleteCalendarsAccounts = action.payload;
		},
		[getGoogleCalendars.fulfilled.type]: (state, action: PayloadAction<ICalendar[]>) => {
			state.loadingCalendars = false;
			state.errorLoadingCalendars = null;
			state.calendars = action.payload;
		},
		[getGoogleCalendars.pending.type]: (state) => {
			state.loadingCalendars = true;
			state.errorLoadingCalendars = null;
		},
		[getGoogleCalendars.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCalendars = false;
			state.errorLoadingCalendars = action.payload;
		},
		[saveCalendarSettings.fulfilled.type]: (state, action: PayloadAction<ICalendarsAccount>) => {
			state.loadingSaveCalendarSettings = false;
			state.errorLoadingSaveCalendarSettings = null;
			state.calendarsAccounts = state.calendarsAccounts.map((calendarAccount) => {
				if (calendarAccount.id === action.payload.id) {
					return { ...calendarAccount, ...action.payload };
				}
				return calendarAccount;
			});
		},
		[saveCalendarSettings.pending.type]: (state) => {
			state.loadingSaveCalendarSettings = true;
			state.errorLoadingSaveCalendarSettings = null;
		},
		[saveCalendarSettings.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingSaveCalendarSettings = false;
			state.errorLoadingSaveCalendarSettings = action.payload;
		},
		[startInitialGoogleCalendarsSync.fulfilled.type]: (state, action: PayloadAction<number, string, { arg: { id: number } }>) => {
			state.loadingCalendarSync = false;
			state.errorLoadingCalendarSync = null;
			state.isSuccessCalendarSync = true;
			state.calendarsAccounts = state.calendarsAccounts.map((calendarAccount) => {
				if (calendarAccount.id === action.meta.arg.id) {
					return { ...calendarAccount, status: ECalendarAccountStatuses.RUN };
				}
				return calendarAccount;
			});
		},
		[startInitialGoogleCalendarsSync.pending.type]: (state) => {
			state.loadingCalendarSync = true;
			state.errorLoadingCalendarSync = null;
		},
		[startInitialGoogleCalendarsSync.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCalendarSync = false;
			state.errorLoadingCalendarSync = action.payload;
		},
		[startCalendarsSync.fulfilled.type]: (state, action: PayloadAction<number, string, { arg: number }>) => {
			state.loadingCalendarSync = false;
			state.errorLoadingCalendarSync = null;
			state.isSuccessCalendarSync = true;
			state.calendarsAccounts = state.calendarsAccounts.map((calendarAccount) => {
				if (calendarAccount.id === action.meta.arg) {
					return { ...calendarAccount, status: ECalendarAccountStatuses.RUN };
				}
				return calendarAccount;
			});
		},
		[startCalendarsSync.pending.type]: (state) => {
			state.loadingCalendarSync = true;
			state.errorLoadingCalendarSync = null;
		},
		[startCalendarsSync.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCalendarSync = false;
			state.errorLoadingCalendarSync = action.payload;
		},
		[stopGoogleCalendarsSync.fulfilled.type]: (state, action: PayloadAction<number, string, { arg: number }>) => {
			state.loadingCalendarSync = false;
			state.errorLoadingCalendarSync = null;
			state.calendarsAccounts = state.calendarsAccounts.map((calendarAccount) => {
				if (calendarAccount.id === action.meta.arg) {
					return { ...calendarAccount, active: false, status: ECalendarAccountStatuses.STOPPED };
				}
				return calendarAccount;
			});
		},
		[stopGoogleCalendarsSync.pending.type]: (state) => {
			state.loadingCalendarSync = true;
			state.errorLoadingCalendarSync = null;
		},
		[stopGoogleCalendarsSync.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCalendarSync = false;
			state.errorLoadingCalendarSync = action.payload;
		},
		[activateGoogleCalendarsSync.fulfilled.type]: (state, action: PayloadAction<number, string, { arg: number }>) => {
			state.loadingCalendarSync = false;
			state.errorLoadingCalendarSync = null;
			state.calendarsAccounts = state.calendarsAccounts.map((calendarAccount) => {
				if (calendarAccount.id === action.meta.arg) {
					return { ...calendarAccount, active: true, status: ECalendarAccountStatuses.STARTED };
				}
				return calendarAccount;
			});
		},
		[activateGoogleCalendarsSync.pending.type]: (state) => {
			state.loadingCalendarSync = true;
			state.errorLoadingCalendarSync = null;
		},
		[activateGoogleCalendarsSync.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCalendarSync = false;
			state.errorLoadingCalendarSync = action.payload;
		},
	},
});

export const { setRedirectGoogleOauthUrl, setIsSuccessCalendarSync } = calendarsReducer.actions;
export default calendarsReducer.reducer;
