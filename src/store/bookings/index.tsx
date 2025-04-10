import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ECreateEntity, IBooking } from '@uspacy/sdk/lib/models/booking';

import { getBookings } from './actions';
import { IState, SecondLevelKeys, ThirdLevelKeys, UpdateBookingPayload } from './types';

const initialBookingState: IBooking = {
	general: {
		name: '',
		description: '',
		duration: {
			value: 30,
			customTime: null,
		},
		coffeeBreak: {
			value: 15,
			customTime: null,
		},
		timezone: '',
		emailReminder: {
			value: 30,
			customTime: null,
		},
		calendarReminder: {
			value: 10,
			customTime: null,
		},
		type: 'task',
		participants: [],
		showPicture: true,
		canEditOthers: true,
	},
	userData: {
		formName: '',
		entity: ECreateEntity.deal,
		source: '',
		fields: [],
	},
	meetHours: {
		active: false,
		values: [],
	},
	additionalRestrictions: {
		specialDays: [],
		daysBeforeEvent: {
			active: true,
			value: 0,
		},
		hoursBeforeEvent: {
			active: true,
			value: 0,
		},
		maxMeetingsPerDay: {
			active: false,
			value: 0,
			considerEventsInSpace: true,
		},
	},
};

const initialState: IState = {
	booking: initialBookingState,
	bookingList: [],
	loading: false,
};

const bookingsReducer = createSlice({
	name: 'filesReducer',
	initialState,
	reducers: {
		updateBooking: <T extends keyof IBooking, K extends SecondLevelKeys<IBooking, T>, L extends ThirdLevelKeys<IBooking, T, K>>(
			state,
			action: PayloadAction<UpdateBookingPayload<T, K, L>>,
		) => {
			const { keyFirstLevel, keySecondLevel, keyThirdLevel, value } = action.payload;
			switch (true) {
				case !!keyThirdLevel && !!keySecondLevel: {
					state.booking = {
						...state.booking,
						[keyFirstLevel]: {
							...state.booking[keyFirstLevel],
							[keySecondLevel]: {
								...state.booking[keyFirstLevel][keySecondLevel],
								...value,
							},
						},
					};
					break;
				}
				default: {
					state.booking = {
						...state.booking,
						[keyFirstLevel]: {
							...state.booking[keyFirstLevel],
							[keySecondLevel]: value,
						},
					};
					break;
				}
			}
		},
	},
	extraReducers: {
		[getBookings.fulfilled.type]: (state, action: PayloadAction<IBooking[]>) => {
			state.loading = false;
			state.bookingList = Array.isArray(action.payload) ? action.payload : [];
		},
		[getBookings.pending.type]: (state) => {
			state.loading = true;
		},
		[getBookings.rejected.type]: (state) => {
			state.loading = false;
		},
	},
});

export const { updateBooking } = bookingsReducer.actions;
export default bookingsReducer.reducer;
