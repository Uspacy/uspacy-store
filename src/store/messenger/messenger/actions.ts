import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import {
	FetchMessagesRequest,
	GoToMessageRequest,
	IChat,
	ICreateQuickAnswerDTO,
	ICreateWidgetData,
	IGetQuickAnswerParams,
	IQuickAnswer,
} from '@uspacy/sdk/lib/models/messenger';
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

export const getWidgets = createAsyncThunk(
	'messenger/getWidgets',
	async ({ limit, page }: { limit?: number; page?: number }, { rejectWithValue }) => {
		try {
			return (await uspacySdk.messengerService.getWidgets(limit, page)).data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const deleteWidget = createAsyncThunk('messenger/deleteWidget', async (id: ICreateWidgetData['id'], { rejectWithValue }) => {
	try {
		return (await uspacySdk.messengerService.deleteWidgets(id)).data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const updateWidget = createAsyncThunk('messenger/updateWidget', async (data: ICreateWidgetData, { rejectWithValue }) => {
	try {
		return (await uspacySdk.messengerService.updateWidget(data)).data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getQuickAnswers = createAsyncThunk('messenger/getQuickAnswers', async (params: IGetQuickAnswerParams, { rejectWithValue }) => {
	try {
		return (await uspacySdk.messengerService.getQuickAnswers(params)).data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const createQuickAnswer = createAsyncThunk('messenger/createQuickAnswer', async (data: ICreateQuickAnswerDTO, { rejectWithValue }) => {
	try {
		return (await uspacySdk.messengerService.createQuickAnswer(data)).data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const updateQuickAnswer = createAsyncThunk(
	'messenger/updateQuickAnswer',
	async (params: { id: IQuickAnswer['id']; data: Partial<IQuickAnswer> }, { rejectWithValue }) => {
		try {
			return (await uspacySdk.messengerService.updateQuickAnswer(params.id, params.data)).data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const updateQuickAnswerStatus = createAsyncThunk('messenger/updateQuickAnswer', async (params: { id: IQuickAnswer['id']; status: string }) => {
	try {
		return (await uspacySdk.messengerService.updateQuickAnswerStatus(params.id, params.status)).data;
	} catch (e) {
		return e;
	}
});

export const deleteQuickAnswer = createAsyncThunk('messenger/deleteQuickAnswer', async (params: { id: IQuickAnswer['id'] }, { rejectWithValue }) => {
	try {
		return (await uspacySdk.messengerService.deleteQuickAnswer(params.id)).data.id;
	} catch (e) {
		return rejectWithValue(e);
	}
});
