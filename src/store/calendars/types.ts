import { ICalendar, ICalendarsAccount } from '@uspacy/sdk/lib/models/calendars';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

export interface IErrors {
	status: number;
	error: string;
}

export interface IState {
	redirectGoogleOauthUrl: string;
	calendarsAccounts: ICalendarsAccount[];
	calendars: ICalendar[];
	isSuccessCalendarSync: boolean;
	loadingGoogleOauthRedirectUrl: boolean;
	loadingCalendarsAccounts: boolean;
	loadingDeleteCalendarsAccounts: boolean;
	loadingCalendars: boolean;
	loadingSaveCalendarSettings: boolean;
	loadingCalendarSync: boolean;
	errorLoadingGoogleOauthRedirectUrl: IErrorsAxiosResponse;
	errorLoadingCalendarsAccounts: IErrorsAxiosResponse;
	errorLoadingCalendars: IErrorsAxiosResponse;
	errorLoadingSaveCalendarSettings: IErrorsAxiosResponse;
	errorLoadingCalendarSync: IErrorsAxiosResponse;
	errorLoadingDeleteCalendarsAccounts: IErrorsAxiosResponse;
}
