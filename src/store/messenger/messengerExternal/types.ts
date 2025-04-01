import { IExternalChatsItems } from '@uspacy/sdk/lib/models/messenger';

export interface IState {
	externalChats: {
		items: IExternalChatsItems;
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

export interface ICrmConnectEntity {
	entity: 'leads' | 'contacts' | 'companies' | 'deals';
	id: number;
	owner: number;
	title: string;
}
