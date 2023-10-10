import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchNotifications } from './actions';
import { INotification, IState } from './types';

const initialState: IState = {
	notifications: [],
	loading: true,
};

const notificationsReducer = createSlice({
	name: 'notifications',
	initialState,
	reducers: {
		setNotifications(state: IState, action: PayloadAction<INotification[]>) {
			state.notifications = action.payload;
		},
		addNotifications(state: IState, action: PayloadAction<INotification>) {
			state.notifications = [action.payload, ...state.notifications];
		},
		readNotification(state: IState, action: PayloadAction<INotification['id']>) {
			state.notifications = state.notifications.map((it) => {
				if (it.id === action.payload)
					return {
						...it,
						read: true,
					};
				return it;
			});
		},
		readAllNotifications(state: IState) {
			state.notifications = state.notifications.map((it) => ({
				...it,
				read: true,
			}));
		},
	},
	extraReducers: {
		[fetchNotifications.fulfilled.type]: (state, action: PayloadAction<INotification[]>) => {
			state.loading = false;
			state.notifications = action.payload;
		},
		[fetchNotifications.pending.type]: (state) => {
			state.loading = true;
		},
		[fetchNotifications.rejected.type]: (state) => {
			state.loading = false;
		},
	},
});

export const { addNotifications, setNotifications, readAllNotifications, readNotification } = notificationsReducer.actions;

export default notificationsReducer.reducer;
