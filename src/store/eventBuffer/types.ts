/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IEvents {
	notifId: string;
	action: string;
	payload: any;
}

export enum EEventEntity {
	comment = 'comment',
	entity_crm = 'entity_crm',
}

type EventEntities = 'comment' | 'entity_crm';

type EventEntity = EventEntities | (string & {});

export interface IState {
	events: {
		[key in EventEntity]?: {
			[id: string]: IEvents[];
		};
	};
}
