/* eslint-disable no-console */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EMessengerType, FetchMessagesRequest, GoToMessageRequest, IChat, IMessage } from '@uspacy/sdk/lib/models/messenger';
import { differenceInMinutes } from 'date-fns';

import {
	decUnreadCountByChatId,
	getUniqueItems,
	onlyUnique,
	readLastMessageInChat,
	readLastMessagesInChat,
	setFirstUnreadMessage,
	sortChats,
} from '../../../helpers/messenger';
import { fetchChats, fetchMessages, fetchPinedMessages, goToMessage } from './actions';
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
};

const prepereMessages = (items: IMessage[]) => {
	let comparedMessage: IMessage;
	// eslint-disable-next-line no-console
	return items.map((message) => {
		if (
			!comparedMessage ||
			differenceInMinutes(comparedMessage.timestamp, message.timestamp) > 1 ||
			comparedMessage.authorId !== message.authorId
		) {
			comparedMessage = message;
		}
		const showTime = comparedMessage.id === message.id || differenceInMinutes(comparedMessage.timestamp, message.timestamp) > 1;
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
		setCurrentChat(state, action: PayloadAction<string>) {
			state.chats.currentChatId = action.payload;
		},
		unsetCurrentChat(state) {
			state.chats.currentChatId = undefined;
		},
		removeChat(state, action: PayloadAction<string>) {
			if (state.chats.currentChatId === action.payload) {
				state.chats.currentChatId = undefined;
			}
			state.chats.items = state.chats.items.filter(({ id }) => id !== action.payload);
			state.messages = state.messages.filter(({ chatId }) => chatId !== action.payload);
		},
		unshiftMessage(state, action: PayloadAction<{ chatId: string; item: IMessage; isNotMy?: boolean }>) {
			state.messages = state.messages.map((group) => {
				if (group.chatId === action.payload.chatId) {
					const items = prepereMessages([action.payload.item, ...group.items]);
					return {
						...group,
						items,
					};
				}
				return group;
			});
			const items = [...state.chats.items].map((chat) => {
				if (chat.id === action.payload.chatId) {
					return {
						...chat,
						lastMessage: action.payload.item,
						timestamp: action.payload.item.timestamp,
						unreadCount: action.payload.isNotMy ? chat.unreadCount + 1 : chat.unreadCount,
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
		setParentMessageId(state, action: PayloadAction<string | undefined>) {
			state.messages = state.messages.map((group) => {
				if (group.chatId === state.chats.currentChatId) {
					return {
						...group,
						parentMessageId: action.payload,
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

			state.chats.items = decUnreadCountByChatId(readLastMessageInChat(state.chats.items, messageAction, userId), messageAction.chatId);
		},
		readMessages(state, action: PayloadAction<{ items: { id: string; readBy: number[] }[]; chatId: string }>) {
			const { items: itemsAction, chatId } = action.payload;

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
			state.chats.items = readLastMessagesInChat(state.chats.items, itemsAction, chatId);
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
						items: setFirstUnreadMessage(it.items),
					};
				}

				return it;
			});
		},
		clearUnreadCounter(state, action: PayloadAction<IChat['id']>) {
			state.chats.items = state.chats.items.map((it) => {
				console.log(it.id);
				console.log(action.payload);
				if (it.id === action.payload) {
					return {
						...it,
						unreadCount: 0,
					};
				}

				return it;
			});
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

		[fetchMessages.fulfilled.type]: (state, action: PayloadAction<IMessage[], string, { arg: FetchMessagesRequest }>) => {
			state.messages = state.messages.map((group) => {
				if (group.chatId === action.meta.arg.chatId) {
					const { dir } = action.meta.arg;
					const lastTimestamp = dir === 'prev' || !dir ? action.payload[action.payload.length - 1]?.timestamp : group.lastTimestamp;
					const firstTimestamp = dir === 'next' || !dir ? action.payload[0]?.timestamp : group.firstTimestamp;
					const items =
						dir === 'prev' ? [...group.items, ...action.payload] : dir === 'next' ? [...action.payload, ...group.items] : action.payload;
					return {
						...group,
						items: setFirstUnreadMessage(prepereMessages(getUniqueItems(items))),
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
					message: '',
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

		[goToMessage.fulfilled.type]: (state, action: PayloadAction<IMessage[], string, { arg: GoToMessageRequest }>) => {
			const isFirstOpenedChat = !state.messages.find((it) => it.chatId === action.payload[0]?.chatId);
			const lastTimestamp = action.payload[action.payload.length - 1]?.timestamp;
			const firstTimestamp = action.payload[0]?.timestamp;

			// fix when we go to message in first opened chat
			if (isFirstOpenedChat) {
				state.messages.push({
					message: '',
					chatId: action.payload[0]?.chatId,
					items: prepereMessages(action.payload),
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
						items: prepereMessages(action.payload),
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
	clearUnreadCounter,
} = chatSlice.actions;

export default chatSlice.reducer;
