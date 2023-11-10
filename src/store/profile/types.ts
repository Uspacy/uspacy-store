import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { ICountryTemplates, IRequisite, ITemplate } from '@uspacy/sdk/lib/models/requisites';
import { IUser } from '@uspacy/sdk/lib/models/user';

export interface IState {
	data?: IUser;
	loading: boolean;
	loadingRequisites: boolean;
	errorLoading: IErrorsAxiosResponse;
	currentRequestId?: string;
	requisites?: IRequisite[];
	templates?: ITemplate[];
	basicTemplates?: ICountryTemplates[];
}
