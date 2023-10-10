import { IUser } from '@uspacy/sdk/lib/models/user';

export interface INotification {
	id: string;
	title: string;
	subTitle: string;
	date: number;
	link?: string;
	read?: boolean;
	author?: IUser;
}

export interface IState {
	notifications: INotification[];
	loading: boolean;
}
