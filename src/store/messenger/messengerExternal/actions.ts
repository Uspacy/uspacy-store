import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IChat } from '@uspacy/sdk/lib/models/messenger';
import { IUser } from '@uspacy/sdk/lib/models/user';

import { formatChats } from '../../../helpers/messenger';

export const fetchExternalChats = createAsyncThunk(
	'messenger/fetchExternalChats',
	async ({ getFormattedUserName }: { getFormattedUserName: (u: Partial<IUser>) => string }, { rejectWithValue, getState }) => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const state: any = getState();
			const users = state.users.data.filter((u) => u.authUserId);
			const profile = state.profile.data;
			const { data: items } = await uspacySdk.messengerService.getChats({ type: 'EXTERNAL' });
			return formatChats(items, users, profile, getFormattedUserName);
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const fetchAllExternalChats = createAsyncThunk(
	'messenger/fetchAllExternalChats',
	async ({ rowsPerPage, page }: { rowsPerPage?: number; page?: number }, { rejectWithValue }) => {
		try {
			const payload = await uspacySdk.messengerService.getChats({
				type: 'EXTERNAL',
				all: true,
				include: 'customer_contacts',
				page,
				list: rowsPerPage,
			});
			const { data } = payload as unknown as { data: { data: IChat[]; meta: unknown } };
			return { data: data.data, meta: data.meta };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);
