import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ECreateEntity, IBooking } from '@uspacy/sdk/lib/models/booking';
import { IResource } from '@uspacy/sdk/lib/models/resources';

import { prepareResourceInToBooking } from '../../helpers/prepareData';
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
		responsible: null,
	},
	userData: {
		formName: '',
		entity: ECreateEntity.activity,
		source: '',
		fields: [],
		language: 'en',
	},
	meetHours: {
		active: true,
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
	invalidBookingFields: [],
	bookingList: [],
	loading: false,
	loadingDetail: false,
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
		setBookingData: (state, action: PayloadAction<Partial<IBooking>>) => {
			state.booking = {
				...state.booking,
				...action.payload,
			};
		},
		clearBooking: (state) => {
			state.booking = initialBookingState;
		},
		addBooking: (state, action: PayloadAction<IBooking>) => {
			state.bookingList.push(action.payload);
		},
		removeBooking: (state, action: PayloadAction<IBooking['id']>) => {
			state.bookingList = state.bookingList.filter((booking) => booking.id !== action.payload);
		},
		setLoadingDetail: (state, action: PayloadAction<boolean>) => {
			state.loadingDetail = action.payload;
		},
		updateBookingInList: (state, action: PayloadAction<IBooking>) => {
			const bookingIndex = state.bookingList.findIndex((it) => it.id === action.payload.id);
			state.bookingList[bookingIndex] = action.payload;
		},
		setInvalidBookingFields: (state, action: PayloadAction<unknown[]>) => {
			state.invalidBookingFields = action.payload;
		},
	},
	extraReducers: {
		[getBookings.fulfilled.type]: (state, action: PayloadAction<IResource[]>) => {
			state.loading = false;
			state.bookingList = Array.isArray(action.payload) ? action.payload.map((resource) => prepareResourceInToBooking(resource)) : [];
		},
		[getBookings.pending.type]: (state) => {
			state.loading = true;
		},
		[getBookings.rejected.type]: (state) => {
			state.loading = false;
		},
	},
});

export const {
	updateBooking,
	clearBooking,
	addBooking,
	removeBooking,
	setBookingData,
	setLoadingDetail,
	updateBookingInList,
	setInvalidBookingFields,
} = bookingsReducer.actions;
export default bookingsReducer.reducer;
