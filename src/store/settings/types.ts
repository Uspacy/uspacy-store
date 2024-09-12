import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IPortalSettings } from '@uspacy/sdk/lib/models/settings';

export interface IState {
	data?: IPortalSettings;
	loading?: boolean;
	error?: IErrorsAxiosResponse;
	dateLocale?: Locale;
}
