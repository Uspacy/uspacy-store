import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { FetchMessagesRequest, GoToMessageRequest, IChat, ICreateWidgetData } from '@uspacy/sdk/lib/models/messenger';
import { IUser } from '@uspacy/sdk/lib/models/user';

import { formatChats } from '../../../helpers/messenger';

export const fetchChats = createAsyncThunk(
	'messenger/fetchChats',
	async ({ getFormattedUserName }: { getFormattedUserName: (u: Partial<IUser>) => string }, { rejectWithValue, getState }) => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const state: any = getState();
			const users = state.users.data.filter((u) => u.authUserId);
			const profile = state.profile.data;
			const { data: items } = await uspacySdk.messengerService.getChats({});
			return formatChats(items, users, profile, getFormattedUserName);
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const fetchMessages = createAsyncThunk(
	'messenger/fetchMessages',
	async ({ chatId, limit, lastTimestamp, firstTimestamp, unreadFirst }: FetchMessagesRequest, { rejectWithValue, getState }) => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const state: any = getState();
			const items = (await uspacySdk.messengerService.getMessages({ chatId, limit, lastTimestamp, firstTimestamp, unreadFirst })).data;
			return { items, profile: state.profile.data };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const goToMessage = createAsyncThunk('messenger/goToMessage', async ({ id }: GoToMessageRequest, { rejectWithValue, getState }) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const state: any = getState();
		const items = (await uspacySdk.messengerService.goToMessage({ id })).data;
		return { items, profile: state.profile.data };
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const fetchPinedMessages = createAsyncThunk('messenger/fetchPinedMessages', async (chatId: IChat['id'], { rejectWithValue }) => {
	try {
		const items = (await uspacySdk.messengerService.getPinnedMessages(chatId)).data;
		return { chatId, items };
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const createWidget = createAsyncThunk('messenger/createWidget', async (data: ICreateWidgetData, { rejectWithValue }) => {
	try {
		return (await uspacySdk.messengerService.createWidget(data)).data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getWidgets = createAsyncThunk('messenger/getWidgets', async (_, { rejectWithValue }) => {
	try {
		return (await uspacySdk.messengerService.getWidgets()).data;
	} catch (e) {
		return rejectWithValue(e);
	}
});
