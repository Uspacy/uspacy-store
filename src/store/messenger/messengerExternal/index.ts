/* eslint-disable no-console */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EActiveEntity, IChat, ICrmConnectEntity, IMessage } from '@uspacy/sdk/lib/models/messenger';
import { IMeta } from '@uspacy/sdk/lib/models/tasks';
import { IUser } from '@uspacy/sdk/lib/models/user';

import {
	checkExtChatStatus,
	onlyUnique,
	readLastMessageInChat,
	readLastMessagesInChat,
	separateExternalChats,
	sortChats,
	updateChatById,
	updateExternalChat,
	updateLastMessageInExternalChat,
	updateUnreadCountAndMentionedByChatId,
} from '../../../helpers/messenger';
import { fetchAllExternalChats, fetchExternalChats } from './actions';
import { IState } from './types';

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
		journalList: {
			data: [],
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
			state.externalChats.journalList.data = updateChatById(state.externalChats.journalList.data, action.payload);
		},
		addChatToActive(state, action: PayloadAction<IChat>) {
			state.externalChats.items.active = [action.payload, ...state.externalChats.items.active];
			state.externalChats.journalList.data = updateChatById(state.externalChats.journalList.data, action.payload);
		},
		addChatToActiveIfDontExists(state, action: PayloadAction<IChat>) {
			if (state.externalChats.items.active.findIndex((chat) => chat.id === action.payload.id) !== -1) {
				return;
			}
			state.externalChats.items.active = [action.payload, ...state.externalChats.items.active];
		},
		addChatToInactive(state, action: PayloadAction<IChat>) {
			state.externalChats.items.inactive = [action.payload, ...state.externalChats.items.inactive];
			state.externalChats.journalList.data = updateChatById(state.externalChats.journalList.data, action.payload);
		},
		addChatToUndistributed(state, action: PayloadAction<IChat>) {
			state.externalChats.items.undistributed = [action.payload, ...state.externalChats.items.undistributed];
			state.externalChats.journalList.data = updateChatById(state.externalChats.journalList.data, action.payload);
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
			// Add members to active chat
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

			// Add members to journal list
			const currentMembers = state.externalChats.journalList.data.find((chat) => chat.id === action.payload.id)?.members || [];
			state.externalChats.journalList.data = updateChatById(state.externalChats.journalList.data, {
				id: action.payload.id,
				members: [...currentMembers, ...action.payload.members].filter(onlyUnique),
			});
		},
		deleteExternalMembersAction(state, action: PayloadAction<{ id: string; members: number[] }>) {
			// Remove members from active chat
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

			// Remove members from journal list
			const currentMembers = state.externalChats.journalList.data.find((chat) => chat.id === action.payload.id)?.members || [];
			state.externalChats.journalList.data = updateChatById(state.externalChats.journalList.data, {
				id: action.payload.id,
				members: currentMembers.filter((m) => !action.payload.members.includes(m)),
			});
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
		readExtChat(state, action: PayloadAction<{ chatId: IChat['id']; profile: IUser; userId: IUser['authUserId'] }>) {
			const { chatId, profile, userId } = action.payload;

			if (profile.authUserId === userId) {
				state.externalChats.items.active = state.externalChats.items.active.map((it) => {
					if (it.id === chatId && it.unreadCount) {
						return {
							...it,
							unreadCount: 0,
							unreadMentions: [],
						};
					}
					return it;
				});
			} else {
				state.externalChats.items.active = state.externalChats.items.active.map((chat) => {
					if (chat.id === chatId && chat.lastMessage?.authorId !== userId) {
						const { lastMessage } = chat;
						return {
							...chat,
							lastMessage: {
								...lastMessage,
								readBy: !lastMessage.readBy.includes(userId) ? [...lastMessage.readBy, userId] : lastMessage.readBy,
							},
						};
					}

					return chat;
				});
			}
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
		[fetchAllExternalChats.fulfilled.type]: (state, action: PayloadAction<{ data: IChat[]; meta: IMeta }>) => {
			const preparedChats: IChat[] = action.payload.data.map((chat) => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const [isActive, isUndistributed, isInactive] = checkExtChatStatus(chat);
				return {
					...chat,
					externalChatStatus: isActive
						? EActiveEntity.ACTIVE_EXTERNAL
						: isInactive
						? EActiveEntity.INACTIVE_EXTERNAL
						: EActiveEntity.UNDISTRIBUTED_EXTERNAL,
				};
			});
			state.externalChats.journalList = {
				data: preparedChats,
				meta: action.payload.meta,
			};
		},
	},
});

export const {
	setCurrentChat,
	unsetCurrentChat,
	addChatToActive,
	addChatToActiveIfDontExists,
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
	readExtChat,
} = externalChatSlice.actions;

export default externalChatSlice.reducer;
