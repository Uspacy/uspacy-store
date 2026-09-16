import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IPortalSettings } from '@uspacy/sdk/lib/models/settings';

export interface IState {
	data?: IPortalSettings;
	portalSettings?: IPortalSettings;
	loading?: boolean;
	error?: IErrorsAxiosResponse;
	dateLocale?: Locale;
}

export interface IFetchSettingsResponse {
	portalSettings: IPortalSettings;
	totalSettings: IPortalSettings;
}
