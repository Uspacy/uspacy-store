import { IProductCategory } from '@uspacy/sdk/lib/models/crm-products-category';

export interface EntityCategories {
	data: IProductCategory[];
	category?: IProductCategory;
	errorMessage?: string;
	loading: boolean;
}

export interface IState {
	[key: string]: EntityCategories;
}
