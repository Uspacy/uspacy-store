import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IElapsedTime, ITaskTimerList, ITimerRealTime } from '@uspacy/sdk/lib/models/timer';

export interface IState {
	isTaskTimerActive: boolean;
	activeTaskTimerId: string;
	timerObj: IElapsedTime;
	timerRealTime: ITimerRealTime;
	taskTimerList: ITaskTimerList;
	taskTimerItem: IElapsedTime;
	loadingTimerRealTimer: boolean;
	loadingStartTimer: boolean;
	loadingStopTimer: boolean;
	loadingCreateTimer: boolean;
	loadingEditTimer: boolean;
	loadingDeleteTimer: boolean;
	loadingTaskTimerList: boolean;
	errorLoadingTimerRealTimer: IErrorsAxiosResponse;
	errorLoadingStartTimer: IErrorsAxiosResponse;
	errorLoadingStopTimer: IErrorsAxiosResponse;
	errorLoadingCreateTimer: IErrorsAxiosResponse;
	errorLoadingEditTimer: IErrorsAxiosResponse;
	errorLoadingDeleteTimer: IErrorsAxiosResponse;
	errorLoadingTaskTimerList: IErrorsAxiosResponse;
}
