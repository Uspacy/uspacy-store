import { EMessengerType, IChat, ICreateWidgetData, IMessage, IMessagesGroup } from '@uspacy/sdk/lib/models/messenger';
import { IMeta } from '@uspacy/sdk/lib/models/tasks';

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
	widgets: {
		data: ICreateWidgetData[];
		meta: IMeta;
		loading: boolean;
	};
	AISummaryData: {
		messages: IMessage[];
		text: string;
		loading: boolean;
	};
}
