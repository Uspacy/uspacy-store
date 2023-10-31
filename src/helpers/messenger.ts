import { ChatType, EActiveEntity, IChat, IExternalChatsItems, IMessage } from '@uspacy/sdk/lib/models/messenger';
import { IUser } from '@uspacy/sdk/lib/models/user';

export const getChatName = (chat: IChat, users: IUser[], profile: IUser, formattedUserName: (u: IUser) => string) => {
	switch (chat.type) {
		case ChatType.DIRECT: {
			const withSelf = chat.members.length === 1 && chat.members.includes(profile.authUserId);
			if (withSelf) return formattedUserName(profile);
			const userId = chat.members.find((member) => profile.authUserId !== member);
			const user = users.find(({ authUserId }) => authUserId === userId);
			if (!user) return undefined;
			return formattedUserName(user);
		}
		default:
			return chat.name;
	}
};

export const getChatPictureUrl = (chat: IChat, users: IUser[], profile: IUser) => {
	switch (chat.type) {
		case ChatType.DIRECT: {
			const withSelf = chat.members.length === 1 && chat.members.includes(profile.authUserId);
			if (withSelf) return profile.avatar;
			const userId = chat.members.find((member) => profile.authUserId !== member);
			const user = users.find(({ authUserId }) => authUserId === userId);
			return user?.avatar;
		}
		default:
			return chat.pictureUrl;
	}
};

export const formatChat = (chat: IChat, users: IUser[], profile: IUser, formattedUserName: (u: IUser) => string) => ({
	...chat,
	name: getChatName(chat, users, profile, formattedUserName),
	pictureUrl: getChatPictureUrl(chat, users, profile),
});

export const formatChats = (chats: IChat[], users: IUser[], profile: IUser, formattedUserName: (u: IUser) => string) => {
	return chats.map((chat) => formatChat(chat, users, profile, formattedUserName)).filter(({ name }) => Boolean(name));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUniqueItems = (items: any[]) => {
	return items.reduce((acc, it) => {
		if (!acc.find(({ id }) => id === it.id)) acc.push(it);
		return acc;
	}, []);
};

export const onlyUnique = (value, index, array) => {
	return array.indexOf(value) === index;
};

export const readLastMessageInChat = (chats: IChat[], message: IMessage, userId: number) =>
	chats.map((chat) => {
		if (chat.id === message.chatId && chat.lastMessage?.id === message.id) {
			return {
				...chat,
				lastMessage: {
					...chat.lastMessage,
					readBy: [...(chat.lastMessage.readBy || []), userId],
				},
			};
		}
		return chat;
	});

export const readLastMessagesInChat = (chats: IChat[], items: { id: string; readBy: number[] }[], chatId: string) =>
	chats.map((chat) => {
		if (chat.id === chatId) {
			const info = items.find(({ id }) => id === chat.lastMessage?.id);
			if (info) {
				return {
					...chat,
					lastMessage: {
						...chat.lastMessage,
						readBy: info.readBy,
					},
				};
			}
			return chat;
		}
		return chat;
	});

export const sortChats = (a: IChat, b: IChat) => {
	if (b.pinned && !a.pinned) return 1;
	if (!b.pinned && a.pinned) return -1;
	if (b.pinned && a.pinned) return b.pinnedTimestamp - a.pinnedTimestamp;
	return b.timestamp - a.timestamp;
};

export const separateExternalChats = (items: IChat[]) =>
	items.reduce(
		(acc, item) => {
			const isActive = item.active && !!item.members.length;
			const isUndistributed = item.active && !item.members.length;
			const isInactive = !item.active;

			switch (true) {
				case isActive: {
					acc.active.push({ ...item, externalChatStatus: EActiveEntity.ACTIVE_EXTERNAL });
					break;
				}
				case isUndistributed: {
					acc.undistributed.push({ ...item, externalChatStatus: EActiveEntity.UNDISTRIBUTED_EXTERNAL });
					break;
				}
				case isInactive: {
					acc.inactive.push({ ...item, externalChatStatus: EActiveEntity.INACTIVE_EXTERNAL });
				}
			}

			return acc;
		},
		{
			active: [],
			undistributed: [],
			inactive: [],
		},
	);

const updateChatById = (chats: IChat[], newChat: IChat) =>
	chats.map((chat) => {
		if (chat.id === newChat.id) {
			return {
				...chat,
				...newChat,
			};
		}
		return chat;
	});

export const updateExternalChat = (chats: IExternalChatsItems, chat: IChat) => ({
	active: chat.externalChatStatus === EActiveEntity.ACTIVE_EXTERNAL ? updateChatById(chats.active, chat) : chats.active,
	undistributed: chat.externalChatStatus === EActiveEntity.UNDISTRIBUTED_EXTERNAL ? updateChatById(chats.undistributed, chat) : chats.undistributed,
	inactive: chat.externalChatStatus === EActiveEntity.INACTIVE_EXTERNAL ? updateChatById(chats.inactive, chat) : chats.inactive,
});

const changeLastMessageByChatId = (chat, chatId, message) => {
	if (chat.id === chatId) {
		return {
			...chat,
			lastMessage: message,
			timestamp: message.timestamp,
		};
	}
	return chat;
};

export const updateLastMessageInExternalChat = (chats: IExternalChatsItems, chatId: string, message: IMessage): IExternalChatsItems => ({
	active: chats.active.map((chat) => changeLastMessageByChatId(chat, chatId, message)).sort((a, b) => b.timestamp - a.timestamp),
	undistributed: chats.undistributed.map((chat) => changeLastMessageByChatId(chat, chatId, message)).sort((a, b) => b.timestamp - a.timestamp),
	inactive: chats.inactive.map((chat) => changeLastMessageByChatId(chat, chatId, message)).sort((a, b) => b.timestamp - a.timestamp),
});
