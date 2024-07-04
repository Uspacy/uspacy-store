import { IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { ILetter } from '@uspacy/sdk/lib/models/email';
import { EMessengerType, IChat } from '@uspacy/sdk/lib/models/messenger';

export interface IMessengerDrawerData {
	type: EMessengerType;
	data: {
		chatId?: IChat['id'] | null;
		letter?: ILetter | null;
		crmEntities?: { [key: string]: IEntityData[] };
	};
}

export interface IState {
	messengerData: IMessengerDrawerData;
}
