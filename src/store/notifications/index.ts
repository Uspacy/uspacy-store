import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INotification } from '@uspacy/sdk/lib/models/notifications';

import { IState } from './types';

const initialState: IState = {
	notifications: [],
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
});

export const { addNotifications, setNotifications, readAllNotifications, readNotification } = notificationsReducer.actions;

export default notificationsReducer.reducer;
