import { IUser } from '@uspacy/sdk/lib/models/user';

export interface INotification {
	id: string;
	title: string;
	subTitle: string;
	date: number;
	link?: string;
	read?: boolean;
	author?: IUser;
	mentioned?: boolean;
	createdAt: number;
	commentEntityTitle?: string;
	drawerInfo: {
		entityCode: string;
		service: string;
		entityId: number;
		commentId: number | null;
	};
}

export interface IState {
	notifications: INotification[];
	loading: boolean;
}

export interface ILinkData {
	entity_type?: string;
	type?: string;
	service: string;
	table_name: string;
}
