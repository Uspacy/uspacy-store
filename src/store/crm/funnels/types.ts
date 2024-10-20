import { IFunnel } from '@uspacy/sdk/lib/models/crm-funnel';

export type EntityFunnels = {
	loading: boolean;
	data: IFunnel[];
	errorMessage?: string;
};

export interface IState {
	[key: string]: EntityFunnels;
}
