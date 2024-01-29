import { ITax, ITaxes } from '@uspacy/sdk/lib/models/crm-products-taxes';

export interface IState {
	productsTaxes: ITaxes;
	productsTax: ITax;
	errorMessage: string;
	loadingList: boolean;
	loading: boolean;
}
