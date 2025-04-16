import { IBooking } from '@uspacy/sdk/lib/models/booking';

export interface IState {
	booking: IBooking;
	bookingList: IBooking[];
	loading: boolean;
	loadingDetail: boolean;
}

export type SecondLevelKeys<T, K extends keyof T> = K extends keyof T ? keyof T[K] : never;
export type ThirdLevelKeys<T, K extends keyof T, L extends keyof T[K]> = L extends keyof T[K] ? keyof T[K][L] : never;
export type FourLevelKeys<T, K extends keyof T, L extends keyof T[K], M extends keyof T[K][L]> = M extends keyof T[K][L] ? keyof T[K][L][M] : never;

export interface UpdateBookingPayload<T extends keyof IBooking, K extends SecondLevelKeys<IBooking, T>, L extends ThirdLevelKeys<IBooking, T, K>> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: any;
	keyFirstLevel: T;
	keySecondLevel?: K;
	keyThirdLevel?: L;
}
