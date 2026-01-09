export interface IEvents {
	notifId: string;
	action: string;
	payload: any;
}

export enum EEventEntity {
	comment = 'comment',
	crm = 'crm',
}

type EventEntities = 'comment' | 'crm';

type EventEntity = EventEntities | (string & {});

export interface IState {
	events: {
		[key in EventEntity]?: {
			[id: string]: IEvents[];
		};
	};
}
