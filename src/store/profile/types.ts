import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
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
	errorLoading: IErrorsAxiosResponse;
	currentRequestId?: string;
	requisites?: IRequisite[];
	templates?: ITemplate[];
	basicTemplates?: ICountryTemplates[];
}
