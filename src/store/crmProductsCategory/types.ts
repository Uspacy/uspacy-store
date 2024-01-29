import { IProductCategories, IProductCategory } from '@uspacy/sdk/lib/models/crm-products-category';

export interface IState {
	productsCategory: IProductCategories;
	productCategory: IProductCategory;
	errorMessage: string;
	loadingList: boolean;
	loading: boolean;
}
