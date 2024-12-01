import { IAnnounceBanner, IAnnounceNotification, IAnnounceWidget } from '@uspacy/sdk/lib/models/announcers';

export interface IState {
	loadingAnnouncers: boolean;
	errorLoading: boolean;
	notifications: IAnnounceNotification[];
	widgets: IAnnounceWidget[];
	banner: IAnnounceBanner;
	meta: Meta;
	isBannerExists: boolean;
}

export interface Meta {
	pagination: {
		page: number;
		pageSize: number;
		pageCount: number;
		total: number;
	};
}
