import { IExternalChatsItems } from '@uspacy/sdk/lib/models/messenger';

export interface IState {
	externalChats: {
		items: IExternalChatsItems;
		externalChatsLength: number;
		loading: boolean;
		currentChatId?: string;
	};
}
