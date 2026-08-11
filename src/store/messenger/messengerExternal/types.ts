import { ICrmConnectEntity, IExternalChatsItems, IExternalChatStatus } from '@uspacy/sdk/lib/models/messenger';
import { ITask } from '@uspacy/sdk/lib/models/tasks';

export interface IExternalPaginationBucket {
	cursor: string | null;
	hasNext: boolean;
	loadingMore: boolean;
}

export type IExternalChatsPagination = Record<IExternalChatStatus, IExternalPaginationBucket>;

export interface IState {
	externalChats: {
		items: IExternalChatsItems;
		pagination: IExternalChatsPagination;
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
