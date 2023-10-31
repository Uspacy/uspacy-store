import { EMessengerType, IChat, IMessage, IMessagesGroup } from '@uspacy/sdk/lib/models/messanger';

export interface IState {
	chats: {
		items: IChat[];
		loading: boolean;
		currentChatId?: string;
	};
	messages: IMessagesGroup[];
	activeMessengerType: EMessengerType;
	forwardMessage: {
		chatForForwardId: IChat['id'];
		message: IMessage;
	} | null;
	selectedMessages: IMessage['id'][];
	selectNotMyMessageCount: number;
	pinedMessages: {
		chatId: IChat['id'];
		items: IMessage[];
	}[];
}
