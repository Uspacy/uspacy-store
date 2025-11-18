import { IChat, ICrmConnectEntity, IExternalChatsItems } from '@uspacy/sdk/lib/models/messenger';
import { IMeta } from '@uspacy/sdk/lib/models/tasks';

export interface IState {
	externalChats: {
		items: IExternalChatsItems;
		journalList: { data: IChat[]; meta?: IMeta };
		externalChatsLength: number;
		loading: boolean;
		currentChatId?: string;
		crmConnectEntities: {
			leads: ICrmConnectEntity[];
			contacts: ICrmConnectEntity[];
			companies: ICrmConnectEntity[];
			deals: ICrmConnectEntity[];
		};
	};
}
