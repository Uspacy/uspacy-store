import { IUser } from '@uspacy/sdk/lib/models/user';

export interface IState {
	data?: IUser;
	loading: boolean;
	errorLoading: string;
	currentRequestId?: string;
}
