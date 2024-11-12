import { ResponseApi } from '@uspacy/sdk/lib/services/AnnouncersService/dto/announcers-dto';

export interface IState {
	loadingAnnouncers: boolean;
	errorLoading: boolean;
	announcers: ResponseApi;
	isBannerExists: boolean;
}
