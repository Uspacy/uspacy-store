import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IFilterField, IFilterPreset } from '@uspacy/sdk/lib/models/filter-preset';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';
import { IUser, IUserFilter } from '@uspacy/sdk/lib/models/user';

export interface IState {
	data: IUser[];
	usersFiltersData: IResponseWithMeta<IUser>;
	errorLoading?: string;
	errorLoadingUpdatingUser: IErrorsAxiosResponse;
	errorLoadingOnlineStatuses: IErrorsAxiosResponse;
	loading: boolean;
	loadingUsersByFilter: boolean;
	loadingUpdatingUser: boolean;
	loadingOnlineStatuses: boolean;
	userFilter: {
		presets: IFilterPreset<IUserFilter>[];
		filters?: IUserFilter;
		filterFields?: IFilterField[];
	};
}

export interface IInvite {
	id: number;
	firstName?: string;
	lastName?: string;
	email: string;
	external_user: boolean;
}

export interface IUploadAvatar {
	file: string | File;
	userId?: string;
	adminRole?: boolean;
	profileId?: string;
}
