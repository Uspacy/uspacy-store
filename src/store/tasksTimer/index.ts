import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IElapsedTime, ITaskTimerList, ITimerRealTime } from '@uspacy/sdk/lib/models/timer';

import { createTimer, deleteTimer, editTimer, fetchTaskTimerList, fetchTimerRealTime, startTimer, stopTimer } from './actions';
import { IErrors, IState } from './types';

const initialState = {
	isTaskTimerActive: false,
	activeTaskTimerId: null,
	timerRealTime: {},
	timerObj: {},
	taskTimerList: {},
	taskTimerItem: {},
	loadingTimerRealTimer: false,
	loadingStartTimer: false,
	loadingStopTimer: false,
	loadingTaskTimerList: false,
	loadingCreateTimer: false,
	loadingEditTimer: false,
	loadingDeleteTimer: false,
	errorLoadingTimerRealTimer: null,
	errorLoadingStartTimer: null,
	errorLoadingStopTimer: null,
	errorLoadingTaskTimerList: null,
	errorLoadingCreateTimer: null,
	errorLoadingEditTimer: null,
	errorLoadingDeleteTimer: null,
} as IState;

const timerReducer = createSlice({
	name: 'timerReducer',
	initialState,
	reducers: {
		setIsTaskTimerActive: (state, action: PayloadAction<boolean>) => {
			state.isTaskTimerActive = action.payload;
		},
		setRealTimerTotalSeconds: (state, action: PayloadAction<number>) => {
			state.timerRealTime.totalSeconds = action.payload;
		},
		clearTimerRealTime: (state) => {
			state.timerRealTime = {} as ITimerRealTime;
		},
		setTaskTimerList: (state, action: PayloadAction<ITaskTimerList>) => {
			state.taskTimerList = action.payload;
		},
		editTimerReducer: (state, action: PayloadAction<IElapsedTime>) => {
			const foundedItem = state.taskTimerList.elapsedTimes.find((time) => time.id === action.payload.id);

			state.taskTimerList.totalSeconds = state.taskTimerList.totalSeconds += action.payload.seconds - foundedItem.seconds;
			state.taskTimerList.myTime = state.taskTimerList.myTime += action.payload.seconds - foundedItem.seconds;

			state.taskTimerList.elapsedTimes = state.taskTimerList.elapsedTimes.map((time) => {
				return time.id === action.payload.id ? action.payload : time;
			});
		},
		deleteTimerReducer: (state, action: PayloadAction<number>) => {
			const foundedItem = state.taskTimerList.elapsedTimes.find((time) => time.id === action.payload);

			state.taskTimerList.totalSeconds = state.taskTimerList.totalSeconds -= foundedItem.seconds;
			state.taskTimerList.myTime = state.taskTimerList.myTime -= foundedItem.seconds;

			state.taskTimerList.elapsedTimes = state.taskTimerList.elapsedTimes.filter((time) => {
				return time.id !== +action.payload;
			});
		},
		clearStartTimerError: (state) => {
			state.errorLoadingStartTimer = null;
		},
	},
	extraReducers: {
		[fetchTimerRealTime.fulfilled.type]: (state, action: PayloadAction<ITimerRealTime>) => {
			state.loadingTimerRealTimer = false;
			state.errorLoadingTimerRealTimer = null;
			state.timerRealTime = action.payload;
		},
		[fetchTimerRealTime.pending.type]: (state) => {
			state.loadingTimerRealTimer = true;
			state.errorLoadingTimerRealTimer = null;
		},
		[fetchTimerRealTime.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingTimerRealTimer = false;
			state.errorLoadingTimerRealTimer = action.payload;
		},

		[startTimer.fulfilled.type]: (state) => {
			state.loadingStartTimer = false;
			state.errorLoadingStartTimer = null;
			if (!state.timerRealTime.taskId && !state.isTaskTimerActive) {
				state.isTaskTimerActive = true;
			}
		},
		[startTimer.pending.type]: (state) => {
			state.loadingStartTimer = true;
			state.errorLoadingStartTimer = null;
		},
		[startTimer.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingStartTimer = false;
			state.errorLoadingStartTimer = action.payload;
		},

		[stopTimer.fulfilled.type]: (state, action: PayloadAction<IElapsedTime>) => {
			state.loadingStopTimer = false;
			state.errorLoadingStopTimer = null;
			if (state.timerRealTime.taskId === action.payload.taskId) {
				state.isTaskTimerActive = false;
				state.timerObj = action.payload;
			}
		},
		[stopTimer.pending.type]: (state) => {
			state.loadingStopTimer = true;
			state.errorLoadingStopTimer = null;
		},
		[stopTimer.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingStopTimer = false;
			state.errorLoadingStopTimer = action.payload;
		},

		[fetchTaskTimerList.fulfilled.type]: (state, action: PayloadAction<ITaskTimerList>) => {
			state.loadingTaskTimerList = false;
			state.errorLoadingTaskTimerList = null;
			state.taskTimerList = action.payload;
		},
		[fetchTaskTimerList.pending.type]: (state) => {
			state.loadingTaskTimerList = true;
			state.errorLoadingTaskTimerList = null;
		},
		[fetchTaskTimerList.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingTaskTimerList = false;
			state.errorLoadingTaskTimerList = action.payload;
		},

		[createTimer.fulfilled.type]: (state, action: PayloadAction<IElapsedTime>) => {
			state.loadingCreateTimer = false;
			state.errorLoadingCreateTimer = null;
			state.taskTimerList.totalSeconds = state.taskTimerList.totalSeconds += action.payload.seconds;
			state.taskTimerList.myTime = state.taskTimerList.myTime += action.payload.seconds;
			state.taskTimerList.elapsedTimes.push(action.payload);
		},
		[createTimer.pending.type]: (state) => {
			state.loadingCreateTimer = true;
			state.errorLoadingCreateTimer = null;
		},
		[createTimer.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingCreateTimer = false;
			state.errorLoadingCreateTimer = action.payload;
		},

		[editTimer.fulfilled.type]: (state) => {
			state.loadingEditTimer = false;
			state.errorLoadingEditTimer = null;
		},
		[editTimer.pending.type]: (state) => {
			state.loadingEditTimer = true;
			state.errorLoadingEditTimer = null;
		},
		[editTimer.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingEditTimer = false;
			state.errorLoadingEditTimer = action.payload;
		},

		[deleteTimer.fulfilled.type]: (state) => {
			state.loadingDeleteTimer = false;
			state.errorLoadingDeleteTimer = null;
		},
		[deleteTimer.pending.type]: (state) => {
			state.loadingDeleteTimer = true;
			state.errorLoadingDeleteTimer = null;
		},
		[deleteTimer.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingDeleteTimer = false;
			state.errorLoadingDeleteTimer = action.payload;
		},
	},
});

export const {
	setIsTaskTimerActive,
	clearTimerRealTime,
	setRealTimerTotalSeconds,
	setTaskTimerList,
	editTimerReducer,
	deleteTimerReducer,
	clearStartTimerError,
} = timerReducer.actions;
export default timerReducer.reducer;
