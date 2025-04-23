import { IFilterField, IFilterPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { IFilter } from '@uspacy/sdk/lib/models/crm-filters';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';
import { IUser } from '@uspacy/sdk/lib/models/user';

export interface IState {
	data: IUser[];
	usersFiltersData: IResponseWithMeta<IUser>;
	errorLoading?: string;
	errorLoadingUpdatingUser: IErrorsAxiosResponse;
	loading: boolean;
	loadingUsersByFilter: boolean;
	loadingUpdatingUser: boolean;
	userFilter: {
		presets: IFilterPreset[];
		filters?: IFilter;
		filterFields?: IFilterField[];
	};
}

export interface IInvite {
	id: number;
	firstName?: string;
	lastName?: string;
	email: string;
}

export interface IUploadAvatar {
	file: string | File;
	userId?: string;
	adminRole?: boolean;
	profileId?: string;
}
