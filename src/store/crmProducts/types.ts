/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFiltersPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { ICreatedAt, IProductFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IProduct, IProducts } from '@uspacy/sdk/lib/models/crm-products';
import { IFields } from '@uspacy/sdk/lib/models/field';

export interface IState {
	products: IProducts;
	product: IProduct;
	createdProduct: IProduct;
	deleteProductId: number;
	deleteProductIds: number[];
	deleteAllFromKanban: boolean;
	changeProducts: IProduct[];
	createdAt: ICreatedAt[];
	productTime: ICreatedAt[];
	productFields: IFields;
	productFilters: IProductFilters;
	productFiltersPreset: IFiltersPreset;
	loading: boolean;
	loadingProductList: boolean;
	errorMessage: string;
}
