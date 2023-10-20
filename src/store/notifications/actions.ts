import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

import { getRead, transformNotificationMessage } from '../../helpers/notifications';

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async (_, { rejectWithValue, getState }) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const state: any = getState();
		const users = state.users.data;
		const { data: items } = await uspacySdk.notificationsService.getNotifications();
		const read = await getRead();
		return items.map((it) => {
			const notification = transformNotificationMessage(it, users);
			return {
				...notification,
				read: read.includes(notification.id),
			};
		});
	} catch (e) {
		return rejectWithValue(e);
	}
});
