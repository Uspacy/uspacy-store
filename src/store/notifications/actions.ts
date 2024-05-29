import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

import { transformNotificationMessage } from '../../helpers/notifications';

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async (_, { rejectWithValue, getState }) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const state: any = getState();
		const users = state.users.data;
		const profileId = state.profile.data.id;
		const { data: items } = await uspacySdk.notificationsService.getNotifications();
		return items.map((it) => transformNotificationMessage(it, users, profileId));
	} catch (e) {
		return rejectWithValue(e);
	}
});
