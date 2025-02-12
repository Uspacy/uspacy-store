import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChat, IMessage } from '@uspacy/sdk/lib/models/messenger';
import { IUser } from '@uspacy/sdk/lib/models/user';

import {
	onlyUnique,
	readLastMessageInChat,
	readLastMessagesInChat,
	separateExternalChats,
	sortChats,
	updateExternalChat,
	updateLastMessageInExternalChat,
	updateUnreadCountAndMentionedByChatId,
} from '../../../helpers/messenger';
import { fetchExternalChats } from './actions';
import { ICrmConnectEntity, IState } from './types';

const initialConnectEntities = {
	leads: [],
	contacts: [],
	companies: [],
	deals: [],
};

const initialState: IState = {
	externalChats: {
		loading: true,
		items: {
			active: [],
			undistributed: [],
			inactive: [],
		},
		externalChatsLength: 0,
		crmConnectEntities: initialConnectEntities,
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
		unshiftLastMessage(state, action: PayloadAction<{ chatId: string; item: IMessage; profile: IUser }>) {
			const { chatId, item, profile } = action.payload;
			state.externalChats.items = updateLastMessageInExternalChat(state.externalChats.items, chatId, item, profile);
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
			state.externalChats.items.active = updateUnreadCountAndMentionedByChatId(
				readLastMessageInChat(state.externalChats.items.active, message, userId),
				message.chatId,
				userId,
				message,
			);
		},
		readExtMessagesAction(state, action: PayloadAction<{ items: { id: string; readBy: number[] }[]; chatId: string; profile: IUser }>) {
			const { items, chatId, profile } = action.payload;
			state.externalChats.items.active = readLastMessagesInChat(state.externalChats.items.active, items, chatId, profile);
		},
		setTimestamp(state, action: PayloadAction<{ chatId: IChat['id']; divider: 'now' | 'original' }>) {
			state.externalChats.items.active = state.externalChats.items.active
				.map((it) => {
					if (it.id === action.payload.chatId) {
						return {
							...it,
							timestamp: action.payload.divider === 'now' ? Date.now() : it.originalTimestamp,
						};
					}
					return it;
				})
				.sort(sortChats);
		},
		setInviteStatus(state, action: PayloadAction<{ chatId: IChat['id']; value: boolean }>) {
			state.externalChats.items.active = state.externalChats.items.active.map((it) => {
				if (it.id === action.payload.chatId)
					return {
						...it,
						isInviteChat: action.payload.value,
					};
				return it;
			});
		},
		setConnectedCrmEntities(state, action: PayloadAction<IState['externalChats']['crmConnectEntities']>) {
			state.externalChats.crmConnectEntities = action.payload;
		},
		updateConnectedCrmEntitiesByKey(
			state,
			action: PayloadAction<{ type: keyof IState['externalChats']['crmConnectEntities']; items: ICrmConnectEntity[] }>,
		) {
			const { type, items } = action.payload;
			state.externalChats.crmConnectEntities[type] = items;
		},
		addConnectedCrmEntities(
			state,
			action: PayloadAction<{ type: keyof IState['externalChats']['crmConnectEntities']; item: ICrmConnectEntity }>,
		) {
			state.externalChats.crmConnectEntities[action.payload.type].push(action.payload.item);
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
	setTimestamp,
	setInviteStatus,
	setConnectedCrmEntities,
	addConnectedCrmEntities,
	updateConnectedCrmEntitiesByKey,
} = externalChatSlice.actions;

export default externalChatSlice.reducer;
