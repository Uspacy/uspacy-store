import { IElapsedTime, ITaskTimerList, ITimerRealTime } from '@uspacy/sdk/lib/models/timer';

export interface IErrors {
	status: number;
	error: string;
}

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
	errorLoadingTimerRealTimer: IErrors;
	errorLoadingStartTimer: IErrors;
	errorLoadingStopTimer: IErrors;
	errorLoadingCreateTimer: IErrors;
	errorLoadingEditTimer: IErrors;
	errorLoadingDeleteTimer: IErrors;
	errorLoadingTaskTimerList: IErrors;
}
