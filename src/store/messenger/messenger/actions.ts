import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import {
	EMessageStatus,
	FetchMessagesRequest,
	GoToMessageRequest,
	IChat,
	IChatNote,
	ICreateQuickAnswerDTO,
	IGetQuickAnswerParams,
	IMessage,
	IQuickAnswer,
	IUserSettings,
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
	async (
		{
			chatId,
			limit,
			lastTimestamp,
			firstTimestamp,
			unreadFirst,
			messagesFromIndexedDb,
		}: FetchMessagesRequest & { messagesFromIndexedDb?: (IMessage & { prevMessageId?: string })[] },
		{ rejectWithValue, getState },
	) => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const state: any = getState();
			const items = (await uspacySdk.messengerService.getMessages({ chatId, limit, lastTimestamp, firstTimestamp, unreadFirst })).data;

			if (!messagesFromIndexedDb?.length) return { items, profile: state.profile.data };

			const mergedItemsWithIndexedDb = items.reduce((acc, it) => {
				const fromIndexedDb = messagesFromIndexedDb?.findIndex((m) => m.prevMessageId === it.id);

				if (fromIndexedDb > -1) {
					const messagesFromIndexed = [{ ...messagesFromIndexedDb[fromIndexedDb], status: EMessageStatus.ERROR }];

					for (let index = fromIndexedDb - 1; index > -1; index--) {
						if (messagesFromIndexedDb?.[index]?.prevMessageId === messagesFromIndexedDb[index + 1]?.id) {
							messagesFromIndexed.unshift({ ...messagesFromIndexedDb[index], status: EMessageStatus.ERROR });
						} else break;
					}
					acc.push(...messagesFromIndexed, it);
				} else {
					acc.push(it);
				}
				return acc;
			}, []);

			return { items: mergedItemsWithIndexedDb, profile: state.profile.data };
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
		await uspacySdk.messengerService.deleteQuickAnswer(params.id);
		return params.id;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getUserSettings = createAsyncThunk('messenger/getUserSettings', async (_, { rejectWithValue }) => {
	try {
		return (await uspacySdk.messengerService.getSettings()).data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const updateUserSettings = createAsyncThunk(
	'messenger/updateUserSettings',
	async (settings: Partial<Omit<IUserSettings, 'authUserId' | 'id'>>, { rejectWithValue }) => {
		try {
			return (await uspacySdk.messengerService.updateSettings(settings)).data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const getChatNotes = createAsyncThunk('messenger/getChatNotes', async (chatId: IChatNote['chatId'], { rejectWithValue }) => {
	try {
		return { notes: (await uspacySdk.messengerService.getChatNotes(chatId)).data, chatId };
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const updateChatNote = createAsyncThunk(
	'messenger/updateChatNote',
	async (params: { id: IChatNote['id']; text: IChatNote['text'] }, { rejectWithValue }) => {
		try {
			return (await uspacySdk.messengerService.updateChatNote(params.id, params.text)).data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const deleteChatNote = createAsyncThunk('messenger/deleteChatNote', async (id: IChatNote['id'], { rejectWithValue }) => {
	try {
		return (await uspacySdk.messengerService.deleteChatNote(id)).data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const createChatNote = createAsyncThunk(
	'messenger/createChatNote',
	async (params: { chatId: IChatNote['chatId']; text: IChatNote['text'] }, { rejectWithValue }) => {
		try {
			return (await uspacySdk.messengerService.createChatNote(params.chatId, params.text)).data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);
