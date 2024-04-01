import { EMessengerType, IChat } from '@uspacy/sdk/lib/models/messenger';

export interface IState {
	messengerData: {
		type: EMessengerType;
		chatId: IChat['id'] | null;
	};
}
