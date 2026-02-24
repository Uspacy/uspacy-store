import { ICrmConnectEntity, IExternalChatsItems } from '@uspacy/sdk/lib/models/messenger';
import { ITask } from '@uspacy/sdk/lib/models/tasks';

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
		connectedTasks: ITask[];
		isLoadingConnectedTasks: boolean;
	};
}
