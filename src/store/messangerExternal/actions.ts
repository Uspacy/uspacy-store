import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IUser } from '@uspacy/sdk/lib/models/user';

import { formatChats } from '../../helpers/messanger';

export const fetchExternalChats = createAsyncThunk(
	'messenger/fetchExternalChats',
	async (
		{
			users,
			profile,
			getFormattedUserName,
		}: {
			users: IUser[];
			profile: IUser;
			getFormattedUserName: (u: Partial<IUser>) => string;
		},
		{ rejectWithValue },
	) => {
		try {
			const { data: items } = await uspacySdk.messangerService.getChats('EXTERNAL');
			return formatChats(items, users, profile, getFormattedUserName);
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);
