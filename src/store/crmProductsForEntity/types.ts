import { IProductForEntity, IProductInfoForEntity } from '@uspacy/sdk/lib/models/crm-products-for-entity';

export interface IState {
	productsWithInfoForEntity: IProductInfoForEntity;
	productsForEntity: IProductForEntity[];
	defaultProduct: IProductForEntity;
	errorMessage: string;
	loadingList: boolean;
	loading: boolean;
}
