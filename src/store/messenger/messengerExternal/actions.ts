import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IExternalChatStatus } from '@uspacy/sdk/lib/models/messenger';
import { IUser } from '@uspacy/sdk/lib/models/user';

import { formatChats } from '../../../helpers/messenger';

const DEFAULT_EXTERNAL_PAGE_SIZE = 30;

/**
 * Cursor (keyset) paginated fetch of ONE external status bucket.
 * Omit `cursor` for the first page (which also returns the `pinned` block).
 */
export const fetchExternalChatsPage = createAsyncThunk(
	'messenger/fetchExternalChatsPage',
	async (
		{
			status,
			cursor,
			limit = DEFAULT_EXTERNAL_PAGE_SIZE,
			getFormattedUserName,
		}: { status: IExternalChatStatus; cursor?: string; limit?: number; getFormattedUserName: (u: Partial<IUser>) => string },
		{ rejectWithValue, getState },
	) => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const state: any = getState();
			const users = state.users.data.filter((u) => u.authUserId);
			const profile = state.profile.data;
			const { data } = await uspacySdk.messengerService.getExternalChatsPage({ externalStatuses: status, cursor, limit });
			return {
				status,
				isFirstPage: !cursor,
				pinned: data.pinned ? formatChats(data.pinned, users, profile, getFormattedUserName) : [],
				data: formatChats(data.data, users, profile, getFormattedUserName),
				nextCursor: data.nextCursor,
				hasNext: data.hasNext,
			};
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

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
