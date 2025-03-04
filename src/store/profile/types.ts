import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IFields } from '@uspacy/sdk/lib/models/field';
import { ICountryTemplates, IRequisite, ITemplate } from '@uspacy/sdk/lib/models/requisites';
import { IUser } from '@uspacy/sdk/lib/models/user';

export interface IState {
	data?: IUser;
	loading: boolean;
	loadingTemplates: {
		loadingCreateTemplates: boolean;
		loadingReadTemplates: boolean;
		loadingUpdateTemplates: boolean;
		loadingDeleteTemplates: boolean;
	};
	loadingRequisites: {
		loadingCreateRequisites: boolean;
		loadingReadRequisites: boolean;
		loadingUpdateRequisites: boolean;
		loadingDeleteRequisites: boolean;
	};
	loadingFields: {
		create: boolean;
		get: boolean;
		update: boolean;
		delete: boolean;
	};
	fields: IFields;
	errorLoading: IErrorsAxiosResponse;
	currentRequestId?: string;
	requisites?: IRequisite[];
	templates?: ITemplate[];
	basicTemplates?: ICountryTemplates[];
}
