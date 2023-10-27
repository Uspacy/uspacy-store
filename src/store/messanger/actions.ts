import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { FetchMessagesRequest, GoToMessageRequest, IChat } from '@uspacy/sdk/lib/models/messanger';
import { IUser } from '@uspacy/sdk/lib/models/user';

import { formatChats } from '../../helpers/messanger';

export const fetchChats = createAsyncThunk(
	'messenger/fetchChats',
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
			const { data: items } = await uspacySdk.messangerService.getChats();
			return formatChats(items, users, profile, getFormattedUserName);
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const fetchMessages = createAsyncThunk(
	'messenger/fetchMessages',
	async ({ chatId, limit, lastTimestamp, firstTimestamp }: FetchMessagesRequest, { rejectWithValue }) => {
		try {
			return (await uspacySdk.messangerService.getMessages({ chatId, limit, lastTimestamp, firstTimestamp })).data;
		} catch (e) {
			return rejectWithValue(undefined);
		}
	},
);

export const goToMessage = createAsyncThunk('messenger/goToMessage', async ({ id }: GoToMessageRequest, { rejectWithValue }) => {
	try {
		return (await uspacySdk.messangerService.goToMessage({ id })).data;
	} catch (e) {
		return rejectWithValue(undefined);
	}
});

export const fetchPinedMessages = createAsyncThunk('messenger/fetchPinedMessages', async (chatId: IChat['id'], { rejectWithValue }) => {
	try {
		const items = (await uspacySdk.messangerService.getPinnedMessages(chatId)).data;
		return { chatId, items };
	} catch (e) {
		return rejectWithValue(undefined);
	}
});
