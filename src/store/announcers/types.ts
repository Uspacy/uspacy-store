import { IAnnouncers } from '@uspacy/sdk/lib/services/AnnouncersService/dto/announcers-dto';

export interface IState {
	loadingAnnouncers: boolean;
	errorLoading: boolean;
	announcers: IAnnouncers;
	isBannerExists: boolean;
}
