import { IPriceType } from '@uspacy/sdk/lib/models/crm-products-price-types';

export interface EntityPriceTypes {
	data: IPriceType[];
	priceType?: IPriceType;
	errorMessage?: string;
	loading: boolean;
}

export interface IState {
	[key: string]: EntityPriceTypes;
}
