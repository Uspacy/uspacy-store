import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ECreateEntity, IBooking } from '@uspacy/sdk/lib/models/booking';
import { IResource } from '@uspacy/sdk/lib/models/resources';

import { prepareResourceInToBooking } from '../../helpers/prepareData';
import { getBookings } from './actions';
import { IBookingMeta, IState, SecondLevelKeys, ThirdLevelKeys, UpdateBookingPayload } from './types';

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
			value: 60,
		},
		hoursBeforeEvent: {
			active: true,
			value: 4,
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
	meta: {
		currentPage: 0,
		total: 0,
		totalActiveByPortal: 0,
		totalActiveForUser: 0,
		totalPages: 0,
	},
};

const bookingsReducer = createSlice({
	name: 'bookingsReducer',
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
			state.meta = {
				...state.meta,
				total: state.meta.total + 1,
				totalActiveByPortal: state.meta.totalActiveByPortal + 1,
				totalActiveForUser: state.meta.totalActiveForUser + 1,
			};
		},
		removeBooking: (state, action: PayloadAction<IBooking['id']>) => {
			state.bookingList = state.bookingList.filter((booking) => booking.id !== action.payload);
			state.meta = {
				...state.meta,
				total: state.meta.total - 1,
				totalActiveByPortal: state.meta.totalActiveByPortal - 1,
				totalActiveForUser: state.meta.totalActiveForUser - 1,
			};
		},
		setLoadingDetail: (state, action: PayloadAction<boolean>) => {
			state.loadingDetail = action.payload;
		},
		updateBookingInList: (state, action: PayloadAction<{ booking: IBooking; isChangeActive?: boolean }>) => {
			const { booking, isChangeActive } = action.payload;
			const bookingIndex = state.bookingList.findIndex((it) => it.id === booking.id);
			state.bookingList[bookingIndex] = booking;
			if (isChangeActive) {
				if (booking.active) {
					state.meta = {
						...state.meta,
						totalActiveByPortal: state.meta.totalActiveByPortal + 1,
						totalActiveForUser: state.meta.totalActiveForUser + 1,
					};
				} else {
					state.meta = {
						...state.meta,
						totalActiveByPortal: state.meta.totalActiveByPortal - 1,
						totalActiveForUser: state.meta.totalActiveForUser - 1,
					};
				}
			}
		},
		setInvalidBookingFields: (state, action: PayloadAction<unknown[]>) => {
			state.invalidBookingFields = action.payload;
		},
	},
	extraReducers: {
		[getBookings.fulfilled.type]: (state, action: PayloadAction<{ data: IResource[]; meta: IBookingMeta }>) => {
			const { data, meta } = action.payload;
			state.loading = false;
			state.bookingList = Array.isArray(data) ? data.map((resource) => prepareResourceInToBooking(resource)) : [];
			state.meta = meta;
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
