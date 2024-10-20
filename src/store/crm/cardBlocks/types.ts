import { ICardBlock } from '@uspacy/sdk/lib/models/crm-card-blocks';

export type EntityCardBlock = {
	data: ICardBlock[];
};

export interface IState {
	[key: string]: EntityCardBlock;
}
