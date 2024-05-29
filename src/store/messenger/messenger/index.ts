import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EMessengerType, FetchMessagesRequest, GoToMessageRequest, IChat, ICreateWidgetData, IMessage } from '@uspacy/sdk/lib/models/messenger';
import { IMeta } from '@uspacy/sdk/lib/models/tasks';
import { IUser } from '@uspacy/sdk/lib/models/user';
import differenceInMinutes from 'date-fns/differenceInMinutes';

import {
	getUniqueItems,
	onlyUnique,
	readLastMessageInChat,
	readLastMessagesInChat,
	sortChats,
	updateUnreadCountAndMentionedByChatId,
} from '../../../helpers/messenger';
import { createWidget, deleteWidget, fetchChats, fetchMessages, fetchPinedMessages, getWidgets, goToMessage, updateWidget } from './actions';
import { IState } from './types';

const initialState: IState = {
	chats: {
		loading: true,
		items: [],
	},
	messages: [],
	activeMessengerType: EMessengerType.INTERNAL_CHAT,
	forwardMessage: null,
	selectedMessages: [],
	selectNotMyMessageCount: 0,
	pinedMessages: [],
	widgets: {
		data: [],
		meta: {
			currentPage: 1,
			from: 0,
			lastPage: 1,
			perPage: 0,
			to: 0,
			total: 0,
		},
		loading: false,
	},
};

interface IPreperedMessage extends IMessage {
	readByTemp?: number[];
}

const prepereMessages = (items: IPreperedMessage[], profile: IUser) => {
	let comparedMessage: IPreperedMessage;
	return items.flatMap((message, index, origin) => {
		if (
			!comparedMessage ||
			differenceInMinutes(comparedMessage.timestamp, message.timestamp) > 1 ||
			comparedMessage.authorId !== message.authorId
		) {
			comparedMessage = message;
		}
		const showTime = comparedMessage.id === message.id || differenceInMinutes(comparedMessage.timestamp, message.timestamp) > 1;

		const nextMessage = items[index + 1];
		const isFirstUnread =
			Array.isArray(message.readBy) &&
			message.authorId !== profile.authUserId &&
			!message.readBy.includes(profile.authUserId) &&
			nextMessage?.readBy?.includes(profile.authUserId);

		if (isFirstUnread && !origin.find((it) => it.isFirstUnread)) {
			return [
				message,
				{
					...message,
					id: `${message.id}-unreadMessage`,
					message: 'unreadMessages',
					isFirstUnread,
				},
			];
		}
		return {
			...message,
			showTime,
		};
	});
};

export const chatSlice = createSlice({
	name: 'messenger',
	initialState,
	reducers: {
		appendChats(state, action: PayloadAction<{ items: IChat[] }>) {
			const items = getUniqueItems([...action.payload.items, ...state.chats.items]).sort(sortChats);
			state.chats.items = items;
		},
		setCurrentChat(state, action: PayloadAction<{ id: string; profile: IUser }>) {
			state.chats.currentChatId = action.payload.id;
			state.messages = state.messages.map((group) => {
				if (group.chatId === action.payload.id) {
					const items = prepereMessages(
						group.items.filter((message) => !message.isFirstUnread),
						action.payload.profile,
					);
					return {
						...group,
						items,
					};
				}
				return group;
			});
		},
		unsetCurrentChat(state) {
			state.messages = state.messages.map((group) => {
				if (group.chatId === state.chats.currentChatId) {
					return {
						...group,
						items: group.items.filter((message) => !message.isFirstUnread),
					};
				}
				return group;
			});
			state.chats.currentChatId = undefined;
		},
		removeChat(state, action: PayloadAction<string>) {
			if (state.chats.currentChatId === action.payload) {
				state.chats.currentChatId = undefined;
			}
			state.chats.items = state.chats.items.filter(({ id }) => id !== action.payload);
			state.messages = state.messages.filter(({ chatId }) => chatId !== action.payload);
		},
		unshiftMessage(state, action: PayloadAction<{ chatId: string; item: IMessage; profile: IUser }>) {
			const { chatId, item, profile } = action.payload;
			state.messages = state.messages.map((group) => {
				if (group.chatId === chatId) {
					const items = prepereMessages([item, ...group.items], profile);
					return {
						...group,
						items,
					};
				}
				return group;
			});

			const items = [...state.chats.items].map((chat) => {
				if (chat.id === chatId) {
					return {
						...chat,
						lastMessage: item,
						timestamp: item.timestamp,
						originalTimestamp: item.timestamp,
						unreadCount: item.authorId !== profile.authUserId ? chat.unreadCount + 1 : chat.unreadCount,
						// update unreadMentions when we get messages
						...(item.mentioned.includes(profile.authUserId) && { unreadMentions: [item.id, ...chat.unreadMentions] }),
					};
				}

				return chat;
			});
			state.chats.items = items.sort(sortChats);
		},
		updateChat(state, action: PayloadAction<IChat>) {
			state.chats.items = state.chats.items.map((chat) => {
				if (chat.id === action.payload.id) {
					return {
						...chat,
						...action.payload,
					};
				}
				return chat;
			});
		},
		leaveChat(state, action: PayloadAction<{ id: string; member: number }>) {
			state.chats.items = state.chats.items.map((chat) => {
				if (chat.id === action.payload.id) {
					return {
						...chat,
						members: chat.members.filter((member) => member !== action.payload.member),
					};
				}
				return chat;
			});
		},
		addMembers(state, action: PayloadAction<{ id: string; members: number[] }>) {
			state.chats.items = state.chats.items.map((chat) => {
				if (chat.id === action.payload.id) {
					return {
						...chat,
						members: [...chat.members, ...action.payload.members].filter(onlyUnique),
					};
				}
				return chat;
			});
		},
		deleteMembers(state, action: PayloadAction<{ id: string; members: number[] }>) {
			state.chats.items = state.chats.items.map((chat) => {
				if (chat.id === action.payload.id) {
					return {
						...chat,
						members: chat.members.filter((m) => !action.payload.members.includes(m)),
					};
				}
				return chat;
			});
		},
		removeMessage(state, action: PayloadAction<string>) {
			state.messages = state.messages.map((group) => {
				if (group.items.find(({ id }) => id === action.payload)) {
					const items = group.items.filter(({ id }) => id !== action.payload);
					return {
						...group,
						items,
					};
				}
				return group;
			});
			state.chats.items = state.chats.items.map((chat) => {
				if (chat.lastMessage?.id === action.payload) {
					const messages = state.messages.find(({ chatId }) => chatId === chat.id);
					if (!messages) return chat;
					const [lastMessage] = messages.items;
					return {
						...chat,
						lastMessage,
					};
				}
				return chat;
			});
		},
		setEditableMessageId(state, action: PayloadAction<{ value: string | undefined; currentExternalChatId?: string }>) {
			const { value, currentExternalChatId } = action.payload;
			const currentChatId = !!currentExternalChatId ? currentExternalChatId : state.chats.currentChatId;

			state.messages = state.messages.map((group) => {
				if (group.chatId === currentChatId) {
					return {
						...group,
						editableMessageId: value,
					};
				}
				return group;
			});
		},
		setParentMessageId(state, action: PayloadAction<{ messageId: string | undefined; externalChatId?: string }>) {
			const { messageId, externalChatId } = action.payload;
			const selectedChatId = !!externalChatId ? externalChatId : state.chats.currentChatId;

			state.messages = state.messages.map((group) => {
				if (group.chatId === selectedChatId) {
					return {
						...group,
						parentMessageId: messageId,
					};
				}
				return group;
			});
		},
		updateMessage(state, action: PayloadAction<IMessage>) {
			state.messages = state.messages.map((group) => {
				if (group.chatId === action.payload.chatId) {
					const items = group.items.map((message) => {
						if (message.id === action.payload.id) return action.payload;
						return message;
					});
					return {
						...group,
						items,
					};
				}
				return group;
			});
			state.chats.items = state.chats.items.map((chat) => {
				if (chat.id === action.payload.chatId && chat.lastMessage?.id === action.payload.id) {
					return {
						...chat,
						lastMessage: action.payload,
					};
				}
				return chat;
			});
		},
		readMessage(state, action: PayloadAction<{ message: IMessage; userId: number }>) {
			const { message: messageAction, userId } = action.payload;
			state.messages = state.messages.map((group) => {
				if (group.chatId === messageAction.chatId) {
					const items = group.items.map((message) => {
						if (message.id === messageAction.id)
							return {
								...message,
								readBy: [...(message.readBy || []), userId],
							};
						return message;
					});
					return {
						...group,
						items,
					};
				}
				return group;
			});

			state.chats.items = updateUnreadCountAndMentionedByChatId(
				readLastMessageInChat(state.chats.items, messageAction, userId),
				messageAction.chatId,
				userId,
				messageAction,
			);
		},
		readMessages(state, action: PayloadAction<{ items: { id: string; readBy: number[] }[]; chatId: string; profile: IUser }>) {
			const { items: itemsAction, chatId, profile } = action.payload;
			state.messages = state.messages.map((group) => {
				if (group.chatId === chatId) {
					const items = group.items.map((message) => {
						const info = itemsAction.find(({ id }) => id === message.id);
						if (info)
							return {
								...message,
								readBy: info.readBy,
							};
						return message;
					});
					return {
						...group,
						items,
					};
				}
				return group;
			});
			state.chats.items = readLastMessagesInChat(state.chats.items, itemsAction, chatId, profile);
		},
		setActiveMessengerType(state, action: PayloadAction<EMessengerType>) {
			state.activeMessengerType = action.payload;
		},
		setForwardMessage(state, action: PayloadAction<{ chatForForwardId: IChat['id']; message: IMessage } | null>) {
			state.forwardMessage = action.payload;
		},
		pinChat(state, action: PayloadAction<string>) {
			state.chats.items = state.chats.items
				.map((chat) => {
					if (chat.id === action.payload) {
						return {
							...chat,
							pinned: true,
							pinnedTimestamp: Date.now(),
						};
					}
					return chat;
				})
				.sort(sortChats);
		},
		unpinChat(state, action: PayloadAction<string>) {
			state.chats.items = state.chats.items
				.map((chat) => {
					if (chat.id === action.payload) {
						return {
							...chat,
							pinned: false,
							pinnedTimestamp: undefined,
						};
					}
					return chat;
				})
				.sort(sortChats);
		},
		saveScrollPosition(state, action: PayloadAction<{ chatId: string; scrollPosition: number }>) {
			state.messages = state.messages.map((group) => {
				if (group.chatId === action.payload.chatId) {
					return {
						...group,
						scrollPosition: action.payload.scrollPosition,
					};
				}
				return group;
			});
		},
		setMessage(state, action: PayloadAction<{ chatId: string; message: string }>) {
			state.messages = state.messages.map((group) => {
				if (group.chatId === action.payload.chatId) {
					return {
						...group,
						message: action.payload.message,
					};
				}
				return group;
			});
		},
		selectMessage(state, action: PayloadAction<IMessage['id']>) {
			state.selectedMessages = [action.payload, ...state.selectedMessages];
		},
		unselectMessage(state, action: PayloadAction<IMessage['id']>) {
			state.selectedMessages = state.selectedMessages.filter((it) => it !== action.payload);
		},
		clearSelected(state) {
			state.selectedMessages = [];
			state.selectNotMyMessageCount = 0;
		},
		incSelectNotMyMessageCount(state) {
			state.selectNotMyMessageCount++;
		},
		decSelectNotMyMessageCount(state) {
			state.selectNotMyMessageCount--;
		},
		addMessageInToPined(state, action: PayloadAction<IMessage>) {
			state.pinedMessages = state.pinedMessages.map((pinedMessage) => {
				if (action.payload.chatId === pinedMessage.chatId) {
					return {
						...pinedMessage,
						items: [action.payload, ...pinedMessage.items],
					};
				}
				return pinedMessage;
			});
		},
		removeMessageFromPined(state, action: PayloadAction<IMessage['id']>) {
			state.pinedMessages = state.pinedMessages.map((pinedMessage) => ({
				...pinedMessage,
				items: pinedMessage.items.filter((it) => it.id !== action.payload),
			}));
		},
		updatePinedMessagesByChatId(state, action: PayloadAction<{ messages: IMessage[]; chatId: IChat['id'] }>) {
			state.pinedMessages = state.pinedMessages.map((it) => {
				if (it.chatId === action.payload.chatId)
					return {
						...it,
						items: action.payload.messages,
					};
				return it;
			});
		},
		updateMuteTimestampInChat(state, action: PayloadAction<{ chatId: IChat['id']; muteUntil?: number }>) {
			state.chats.items = state.chats.items.map((chat) => {
				if (chat.id === action.payload.chatId) {
					return {
						...chat,
						settings: {
							...chat.settings,
							muteUntil: action.payload.muteUntil || undefined,
						},
					};
				}
				return chat;
			});
		},
		updateLastUnreadMessage(state, action: PayloadAction<IChat['id']>) {
			state.messages = state.messages.map((it) => {
				if (it.chatId === action.payload) {
					return {
						...it,
						// items: setFirstUnreadMessage(it.items),
					};
				}

				return it;
			});
		},
		readAllMessages(state, action: PayloadAction<{ chatId: IChat['id']; profile: IUser; userId: IUser['authUserId'] }>) {
			const { chatId, profile, userId } = action.payload;

			if (profile.authUserId === userId) {
				state.chats.items = state.chats.items.map((it) => {
					if (it.id === chatId) {
						return {
							...it,
							unreadCount: 0,
							unreadMentions: [],
						};
					}
					return it;
				});
			}

			state.messages = state.messages.map((group) => {
				if (group.chatId === chatId) {
					return {
						...group,
						items: group.items.filter((it) => !it.isFirstUnread).map((it) => ({ ...it, readBy: [...it.readBy, userId] })),
					};
				}
				return group;
			});
		},
		resetMessages(state) {
			state.messages = [];
		},
		saveDraftMessage(state, action: PayloadAction<{ chatId: IChat['id']; message: string }>) {
			state.messages = state.messages.map((group) => {
				if (group.chatId === action.payload.chatId) {
					return {
						...group,
						draftMessage: action.payload.message,
					};
				}

				return group;
			});
		},
		setTimestamp(state, action: PayloadAction<{ chatId: IChat['id']; divider: 'now' | 'original' }>) {
			state.chats.items = state.chats.items
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
	},
	extraReducers: {
		[fetchChats.fulfilled.type]: (state, action: PayloadAction<IChat[]>) => {
			state.chats.loading = false;
			state.chats.items = action.payload;
			if (state.chats.currentChatId && !action.payload.find(({ id }) => id === state.chats.currentChatId)) {
				state.messages = state.messages.filter(({ chatId }) => chatId !== state.chats.currentChatId);
				state.chats.currentChatId = undefined;
			}
		},
		[fetchChats.pending.type]: (state) => {
			state.chats.loading = true;
		},
		[fetchChats.rejected.type]: (state) => {
			state.chats.loading = false;
		},

		[fetchMessages.fulfilled.type]: (
			state,
			action: PayloadAction<{ items: IMessage[]; profile: IUser }, string, { arg: FetchMessagesRequest }>,
		) => {
			state.messages = state.messages.map((group) => {
				if (group.chatId === action.meta.arg.chatId) {
					const { dir } = action.meta.arg;
					const lastTimestamp =
						dir === 'prev' || !dir ? action.payload.items[action.payload.items.length - 1]?.timestamp : group.lastTimestamp;
					const firstTimestamp = dir === 'next' || !dir ? action.payload.items[0]?.timestamp : group.firstTimestamp;
					const items =
						dir === 'prev'
							? [...group.items, ...action.payload.items]
							: dir === 'next'
							? [...action.payload.items, ...group.items]
							: action.payload.items;
					return {
						...group,
						items: prepereMessages(getUniqueItems(items), action.payload.profile),
						loading: false,
						lastTimestamp,
						firstTimestamp,
					};
				}
				return group;
			});
		},
		[fetchMessages.pending.type]: (state, action: PayloadAction<unknown, string, { arg: FetchMessagesRequest }>) => {
			if (action.meta.arg.push) return;
			if (action.meta.arg.reconnect) {
				state.messages = state.messages.filter(({ chatId }) => chatId === action.meta.arg.chatId);
			}
			if (!state.messages.find((group) => group.chatId === action.meta.arg.chatId)) {
				state.messages.push({
					chatId: action.meta.arg.chatId,
					items: [],
					loading: true,
					draftMessage: '',
				});
			} else {
				state.messages = state.messages.map((group) => {
					if (group.chatId === action.meta.arg.chatId) {
						return {
							...group,
							loading: true,
						};
					}
					return group;
				});
			}
		},
		[fetchMessages.rejected.type]: (state, action: PayloadAction<unknown, string, { arg: FetchMessagesRequest }>) => {
			state.messages = state.messages.map((group) => {
				if (group.chatId === action.meta.arg.chatId) {
					return {
						...group,
						loading: false,
					};
				}
				return group;
			});
		},

		[goToMessage.fulfilled.type]: (state, action: PayloadAction<{ items: IMessage[]; profile: IUser }, string, { arg: GoToMessageRequest }>) => {
			const isFirstOpenedChat = !state.messages.find((it) => it.chatId === action.payload.items[0]?.chatId);
			const lastTimestamp = action.payload.items[action.payload.items.length - 1]?.timestamp;
			const firstTimestamp = action.payload.items[0]?.timestamp;
			// fix when we go to message in first opened chat
			if (isFirstOpenedChat) {
				state.messages.push({
					draftMessage: '',
					chatId: action.payload.items[0]?.chatId,
					items: prepereMessages(action.payload.items, action.payload.profile),
					loading: false,
					lastTimestamp,
					firstTimestamp,
				});

				return;
			}
			state.messages = state.messages.map((group) => {
				if (group.chatId === action.meta.arg.chatId) {
					return {
						...group,
						items: prepereMessages(action.payload.items, action.payload.profile),
						loading: false,
						lastTimestamp,
						firstTimestamp,
					};
				}
				return group;
			});
		},
		[goToMessage.pending.type]: (state, action: PayloadAction<unknown, string, { arg: GoToMessageRequest }>) => {
			state.messages = state.messages.map((group) => {
				if (group.chatId === action.meta.arg.chatId) {
					return {
						...group,
						loading: true,
					};
				}
				return group;
			});
		},
		[goToMessage.rejected.type]: (state, action: PayloadAction<unknown, string, { arg: GoToMessageRequest }>) => {
			state.messages = state.messages.map((group) => {
				if (group.chatId === action.meta.arg.chatId) {
					return {
						...group,
						loading: false,
					};
				}
				return group;
			});
		},

		[fetchPinedMessages.fulfilled.type]: (state, action: PayloadAction<{ chatId: IChat['id']; items: IMessage[] }>) => {
			state.pinedMessages = [...state.pinedMessages, action.payload];
		},
		[createWidget.pending.type]: (state) => {
			state.widgets.loading = true;
		},
		[createWidget.rejected.type]: (state) => {
			state.widgets.loading = false;
		},
		[createWidget.fulfilled.type]: (state, action: PayloadAction<ICreateWidgetData>) => {
			state.widgets.data = [...state.widgets.data, action.payload];
			state.widgets.meta.total = state.widgets.meta.total + 1;
			state.widgets.loading = false;
		},
		[getWidgets.pending.type]: (state) => {
			state.widgets.loading = true;
		},
		[getWidgets.rejected.type]: (state) => {
			state.widgets.loading = false;
		},
		[getWidgets.fulfilled.type]: (state, action: PayloadAction<{ data: ICreateWidgetData[]; meta: IMeta }>) => {
			state.widgets.data = action.payload.data;
			state.widgets.meta = action.payload.meta;
			state.widgets.loading = false;
		},
		[deleteWidget.fulfilled.type]: (state, action: PayloadAction<ICreateWidgetData>) => {
			state.widgets.data = state.widgets.data.filter((it) => it.id !== action.payload.id);
		},
		[updateWidget.fulfilled.type]: (state, action: PayloadAction<ICreateWidgetData>) => {
			state.widgets.data = state.widgets.data.map((it) => {
				if (it.id === action.payload.id) return action.payload;
				return it;
			});
		},
	},
});

export const {
	appendChats,
	setCurrentChat,
	unsetCurrentChat,
	removeChat,
	leaveChat,
	addMembers,
	deleteMembers,
	unshiftMessage,
	updateChat,
	removeMessage,
	updateMessage,
	setEditableMessageId,
	setParentMessageId,
	readMessage,
	readMessages,
	setActiveMessengerType,
	setForwardMessage,
	pinChat,
	unpinChat,
	saveScrollPosition,
	setMessage,
	selectMessage,
	unselectMessage,
	clearSelected,
	incSelectNotMyMessageCount,
	decSelectNotMyMessageCount,
	addMessageInToPined,
	removeMessageFromPined,
	updatePinedMessagesByChatId,
	updateMuteTimestampInChat,
	updateLastUnreadMessage,
	readAllMessages,
	resetMessages,
	saveDraftMessage,
	setTimestamp,
} = chatSlice.actions;

export default chatSlice.reducer;
