import { IUser } from '@uspacy/sdk/lib/models/user';

export interface IState {
	data: IUser[];
	errorLoading?: string;
	loading: boolean;
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
