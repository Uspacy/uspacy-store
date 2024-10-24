import { ITax } from '@uspacy/sdk/lib/models/crm-products-taxes';

export interface EntityTaxes {
	data: ITax[];
	errorMessage: string;
	loading: boolean;
}
export interface IState {
	[key: string]: EntityTaxes;
}
