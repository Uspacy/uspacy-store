import { IChat, ICrmConnectEntity, IExternalChatsItems, IExternalChatStatus } from '@uspacy/sdk/lib/models/messenger';
import { IMeta, ITask } from '@uspacy/sdk/lib/models/tasks';

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
		journalList: { data: IChat[]; meta?: IMeta };
		externalChatsLength: number;
		loading: boolean;
		// number of first-page requests still in flight; `loading` stays true until all of them settle
		firstPagesPending?: number;
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
