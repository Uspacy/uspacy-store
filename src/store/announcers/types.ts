import { IAnnounceBanner, IAnnounceNotification, IAnnouncePopup, IAnnounceWidget } from '@uspacy/sdk/lib/models/announcers';

export interface IState {
	loadingAnnouncers: boolean;
	errorLoading: boolean;
	notifications: IAnnounceNotification[];
	widgets: IAnnounceWidget[];
	banner: IAnnounceBanner;
	popup: IAnnouncePopup[];
	meta: Meta;
	isBannerExists: boolean;
	isShowBanner: boolean;
	isShowtariffBanner: boolean;
}

export interface Meta {
	pagination: {
		page: number;
		pageSize: number;
		pageCount: number;
		total: number;
	};
}
