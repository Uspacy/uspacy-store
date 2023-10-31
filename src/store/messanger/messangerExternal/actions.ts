import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IUser } from '@uspacy/sdk/lib/models/user';

import { formatChats } from '../../../helpers/messanger';

export const fetchExternalChats = createAsyncThunk(
	'messenger/fetchExternalChats',
	async ({ getFormattedUserName }: { getFormattedUserName: (u: Partial<IUser>) => string }, { rejectWithValue, getState }) => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const state: any = getState();
			const users = state.users.data.filter((u) => u.authUserId);
			const profile = state.profile.data;
			const { data: items } = await uspacySdk.messangerService.getChats({ type: 'EXTERNAL' });
			return formatChats(items, users, profile, getFormattedUserName);
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);
