import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChat, IMessage } from '@uspacy/sdk/lib/models/messenger';

import {
	onlyUnique,
	readLastMessageInChat,
	readLastMessagesInChat,
	separateExternalChats,
	updateExternalChat,
	updateLastMessageInExternalChat,
} from '../../../helpers/messenger';
import { fetchExternalChats } from './actions';
import { IState } from './types';

const initialState: IState = {
	externalChats: {
		loading: true,
		items: {
			active: [],
			undistributed: [],
			inactive: [],
		},
		externalChatsLength: 0,
	},
};

export const externalChatSlice = createSlice({
	name: 'messengerExternal',
	initialState,
	reducers: {
		setCurrentChat(state, action: PayloadAction<string>) {
			state.externalChats.currentChatId = action.payload;
		},
		unsetCurrentChat(state) {
			state.externalChats.currentChatId = undefined;
		},
		updateChat(state, action: PayloadAction<IChat>) {
			state.externalChats.items = updateExternalChat(state.externalChats.items, action.payload);
		},
		addChatToActive(state, action: PayloadAction<IChat>) {
			state.externalChats.items.active = [action.payload, ...state.externalChats.items.active];
		},
		addChatToInactive(state, action: PayloadAction<IChat>) {
			state.externalChats.items.inactive = [action.payload, ...state.externalChats.items.inactive];
		},
		addChatToUndistributed(state, action: PayloadAction<IChat>) {
			state.externalChats.items.undistributed = [action.payload, ...state.externalChats.items.undistributed];
		},
		removeChatFromUndistributed(state, action: PayloadAction<IChat['id']>) {
			state.externalChats.items.undistributed = state.externalChats.items.undistributed.filter((chat) => chat.id !== action.payload);
		},
		removeChatFromInactive(state, action: PayloadAction<IChat['id']>) {
			state.externalChats.items.inactive = state.externalChats.items.inactive.filter((chat) => chat.id !== action.payload);
		},
		removeChatFromActive(state, action: PayloadAction<IChat['id']>) {
			if (state.externalChats.currentChatId === action.payload) {
				state.externalChats.currentChatId = undefined;
			}
			state.externalChats.items.active = state.externalChats.items.active.filter((chat) => chat.id !== action.payload);
		},
		unshiftLastMessage(state, action: PayloadAction<{ chatId: string; item: IMessage; isNotMy?: boolean }>) {
			const { chatId, item, isNotMy } = action.payload;
			state.externalChats.items = updateLastMessageInExternalChat(state.externalChats.items, chatId, item, isNotMy);
		},
		appendChatsToUndistributed(state, action: PayloadAction<IChat>) {
			state.externalChats.items.undistributed = [action.payload, ...state.externalChats.items.undistributed];
		},
		addExternalMembersAction(state, action: PayloadAction<{ id: string; members: number[] }>) {
			state.externalChats.items = {
				...state.externalChats.items,
				active: state.externalChats.items.active.map((chat) => {
					if (chat.id === action.payload.id) {
						return {
							...chat,
							members: [...chat.members, ...action.payload.members].filter(onlyUnique),
						};
					}
					return chat;
				}),
			};
		},
		deleteExternalMembersAction(state, action: PayloadAction<{ id: string; members: number[] }>) {
			state.externalChats.items = {
				...state.externalChats.items,
				active: state.externalChats.items.active.map((chat) => {
					if (chat.id === action.payload.id) {
						return {
							...chat,
							members: chat.members.filter((m) => !action.payload.members.includes(m)),
						};
					}
					return chat;
				}),
			};
		},
		readLastMessageInExternalChat(state, action: PayloadAction<{ message: IMessage; userId: number }>) {
			const { message, userId } = action.payload;
			state.externalChats.items.active = readLastMessageInChat(state.externalChats.items.active, message, userId);
		},
		readExtMessagesAction(state, action: PayloadAction<{ items: { id: string; readBy: number[] }[]; chatId: string }>) {
			const { items, chatId } = action.payload;
			state.externalChats.items.active = readLastMessagesInChat(state.externalChats.items.active, items, chatId);
		},
	},
	extraReducers: {
		[fetchExternalChats.fulfilled.type]: (state, action: PayloadAction<IChat[]>) => {
			state.externalChats.loading = false;
			state.externalChats.externalChatsLength = action.payload.length;
			state.externalChats.items = separateExternalChats(action.payload);
		},
		[fetchExternalChats.pending.type]: (state) => {
			state.externalChats.loading = true;
		},
		[fetchExternalChats.rejected.type]: (state) => {
			state.externalChats.loading = false;
		},
	},
});

export const {
	setCurrentChat,
	unsetCurrentChat,
	addChatToActive,
	addChatToInactive,
	removeChatFromUndistributed,
	removeChatFromActive,
	unshiftLastMessage,
	removeChatFromInactive,
	updateChat,
	addChatToUndistributed,
	appendChatsToUndistributed,
	addExternalMembersAction,
	deleteExternalMembersAction,
	readLastMessageInExternalChat,
	readExtMessagesAction,
} = externalChatSlice.actions;

export default externalChatSlice.reducer;
