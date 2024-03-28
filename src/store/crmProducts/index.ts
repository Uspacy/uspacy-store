import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilterPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { ICreatedAt, IProductFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { IProduct, IProducts } from '@uspacy/sdk/lib/models/crm-products';
import { IField, IFields } from '@uspacy/sdk/lib/models/field';

import { idColumn, OTHER_DEFAULT_FIELDS } from './../../const';
import { getField } from './../../helpers/filterFieldsArrs';
import { normalizeGetProducts, normalizeProductField, normalizeProductFields } from './../../helpers/normalizeProduct';
import {
	createProduct,
	createProductField,
	deleteProduct,
	deleteProductField,
	deleteProductListValues,
	fetchFieldsForProduct,
	fetchProducts,
	fetchProductsWithFilters,
	massProductsDeletion,
	massProductsEditing,
	updateProduct,
	updateProductField,
	updateProductListValues,
} from './actions';
import { IState } from './types';

const initialProductsFilterPreset = {
	isNewPreset: false,
	currentPreset: {},
	standardPreset: {},
	filterPresets: [],
};

const defColumn: IField = {
	name: '',
	code: '',
	required: true,
	editable: true,
	show: true,
	hidden: false,
	multiple: false,
	type: 'string',
	system_field: true,
	base_field: true,
};

const defaultProduct: IProduct = {
	id: null,
	title: '',
	product_category_id: 0,
	type: '',
	article: '',
	prices: [],
	measurement_unit_id: null,
	comment: '',
	availability: '',
	is_active: true,
	description: '',
	quantity: null,
	reserved_quantity: null,
	remainder: null,
	preview_image_id: null,
	file_ids: [],
	files: [],
};

const defaultDataColumns = [
	{ ...defColumn, name: 'product/service', code: 'title', type: 'productTitle' },
	{ ...defColumn, name: 'category', code: 'product_category_id', type: 'productCategory' },
	{ ...defColumn, name: 'productType', code: 'type', type: 'productType' },
	{ ...defColumn, name: 'article', code: 'article', type: 'productArticle' },
	{ ...defColumn, name: 'price', code: 'prices', type: 'productPrice', multiple: true },
	{ ...defColumn, name: 'unit', code: 'measurement_unit_id', type: 'productUnit' },
	{ ...defColumn, name: 'availability', code: 'availability', type: 'productAvailability' },
	{ ...defColumn, name: 'remainder', code: 'remainder', type: 'productRemind' },
	{ ...defColumn, name: 'description', code: 'description', type: 'textarea' },
	{ ...defColumn, name: 'tax', code: 'tax', type: 'productTax' },
	{ ...defColumn, name: 'activity', code: 'is_active', type: 'productActivity' },
	{ ...defColumn, name: 'productGallery', code: 'files', type: 'productGallery' },
	{ ...defColumn, name: 'productLink', code: 'link', type: 'productLink' },
	{ ...defColumn, name: 'commentProduct', code: 'comment', type: 'textarea' },
	{ ...defColumn, name: 'currency', code: 'currency', type: 'label' },
];

const initialProducts = {
	data: [],
	meta: {
		total: 0,
		from: 0,
		per_page: 0,
		list: 0,
	},
	aborted: false,
};

export const initialProductsFilter: IProductFilters = {
	availability: [],
	type: [],
	currency: '',
	price_from: null,
	price_to: null,
	balance_from: null,
	balance_to: null,
	is_active: [],
	openDatePicker: false,
	search: '',
	page: 0,
	perPage: 0,
	select: 0,
	boolean_operator: '',
	sortModel: [],
};

const initialState = {
	products: { ...initialProducts },
	product: { ...initialProducts.data[0] },
	createdProduct: { ...initialProducts.data[0] },
	productFields: {
		data: [],
	},
	createdAt: [],
	deleteProductId: 0,
	deleteProductIds: [],
	deleteAllFromKanban: false,
	changeProducts: [],
	productTime: [],
	productFilters: initialProductsFilter,
	productFiltersPreset: initialProductsFilterPreset,
	errorMessage: '',
	loading: false,
	loadingProductList: true,
} as IState;

const productsReducer = createSlice({
	name: 'products',
	initialState,
	reducers: {
		changeFilterProducts: (state, action: PayloadAction<{ key: string; value: IProductFilters[keyof IProductFilters] }>) => {
			state.productFilters[action.payload.key] = action.payload.value;
		},
		changeItemsFilterProducts: (state, action: PayloadAction<IProductFilters>) => {
			state.productFilters = action.payload;
		},
		changeTaskTime: (state, action: PayloadAction<ICreatedAt[]>) => {
			state.productTime = action.payload;
		},
		clearProducts: (state) => {
			state.products = initialProducts;
			state.loadingProductList = true;
		},
		clearProductsFilter: (state) => {
			state.productTime = [];
			if (!!Object.keys(state.productFields.data)?.length) {
				state.productFilters = {
					...state.productFields.data.reduce((acc, it) => ({ ...acc, ...getField(it) }), {}),
					...OTHER_DEFAULT_FIELDS,
					page: 1,
					perPage: 20,
				};
			}
		},
		clearCreatedProduct: (state) => {
			state.createdProduct = defaultProduct;
		},
		changeReasonForProduct: (state, action: PayloadAction<{ id: number; reasonId: number | string }>) => {
			state.products.data = state.products.data.map((lead) => {
				if (lead?.id === action?.payload?.id) {
					return {
						...lead,
						kanban_reason_id: +action.payload.reasonId,
					};
				}

				return lead;
			});
		},
		setDeleteAllFromKanban: (state, action: PayloadAction<boolean>) => {
			state.deleteAllFromKanban = action.payload;
		},
		setIsNewPreset: (state, action: PayloadAction<boolean>) => {
			state.productFiltersPreset.isNewPreset = action.payload;
		},
		setCurrentPreset: (state, action: PayloadAction<IFilterPreset>) => {
			state.productFiltersPreset.currentPreset = action.payload;
		},
		setStandardPreset: (state, action: PayloadAction<IFilterPreset>) => {
			state.productFiltersPreset.standardPreset = action.payload;
		},
		setFilterPresets: (state, action: PayloadAction<IFilterPreset[]>) => {
			state.productFiltersPreset.filterPresets = action.payload;
		},
	},
	extraReducers: {
		[fetchProducts.fulfilled.type]: (state, action: PayloadAction<IProducts>) => {
			state.loadingProductList = false;
			state.errorMessage = '';
			state.products = action.payload;
		},
		[fetchProducts.pending.type]: (state) => {
			state.loadingProductList = true;
			state.errorMessage = '';
		},
		[fetchProducts.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingProductList = false;
			state.errorMessage = action.payload;
		},
		[fetchProductsWithFilters.fulfilled.type]: (state, action: PayloadAction<IProducts>) => {
			state.loadingProductList = action.payload.aborted;
			state.errorMessage = '';
			state.products = action.payload.aborted ? state.products : normalizeGetProducts(action.payload);
		},
		[fetchProductsWithFilters.pending.type]: (state) => {
			state.loadingProductList = true;
			state.errorMessage = '';
		},
		[createProduct.fulfilled.type]: (state, action: PayloadAction<IProduct>) => {
			state.loading = false;
			state.errorMessage = '';
			state.products.data.unshift(action.payload);
			state.products.meta.total = ++state.products.meta.total;
		},
		[fetchProductsWithFilters.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingProductList = false;
			state.errorMessage = action.payload;
		},
		[createProduct.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createProduct.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[updateProduct.fulfilled.type]: (state, action: PayloadAction<IProduct>) => {
			state.loading = false;
			state.errorMessage = '';
			state.products.data = state.products.data.map((product) => {
				if (product.id === action.payload.id) {
					return action.payload;
				}
				return product;
			});
		},
		[updateProduct.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[updateProduct.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteProduct.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loading = false;
			state.errorMessage = '';
			state.products.data = state.products.data.filter((product) => product.id !== action.payload);
			state.deleteProductId = action.payload;
		},
		[deleteProduct.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteProduct.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[massProductsDeletion.fulfilled.type]: (state, action: PayloadAction<IMassActions>) => {
			state.loading = false;
			state.loadingProductList = false;
			state.errorMessage = '';
			state.products.data = state.products.data.filter((item) => !action.payload.entityIds.includes(item?.id));

			state.deleteProductIds = action?.payload.entityIds.map((id) => id);

			if (action.payload.all) {
				state.deleteAllFromKanban = true;
			}

			if (action.payload.all) {
				state.products.meta.total = 0;
			} else if (action.payload.all && action.payload.exceptIds.length) {
				state.products.meta.total = action.payload.exceptIds.length;
			} else {
				state.products.meta.total = state.products.meta.total - action.payload.entityIds.length;
			}
		},
		[massProductsDeletion.pending.type]: (state) => {
			state.loading = true;
			state.loadingProductList = true;
			state.errorMessage = '';
		},
		[massProductsDeletion.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingProductList = false;
			state.errorMessage = action.payload;
		},
		[massProductsEditing.fulfilled.type]: (state) => {
			state.loading = false;
			state.errorMessage = '';
		},
		[massProductsEditing.pending.type]: (state) => {
			state.loading = true;
			state.loadingProductList = true;
			state.errorMessage = '';
		},
		[massProductsEditing.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingProductList = false;
			state.errorMessage = action.payload;
		},
		[fetchFieldsForProduct.fulfilled.type]: (state, action: PayloadAction<IFields>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productFields.data = normalizeProductFields(action.payload, defaultDataColumns);
			// @ts-ignore
			state.productFields.data.splice(0, 0, idColumn);
		},
		[fetchFieldsForProduct.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[fetchFieldsForProduct.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[updateProductField.fulfilled.type]: (state, action: PayloadAction<IField>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productFields.data = state.productFields.data.map((field) => {
				const imageCode = field.code === 'preview_image_id' && action.payload.code === 'files';
				if (field.code === action.payload.code || imageCode) {
					const payload = imageCode ? { ...action.payload, code: 'preview_image_id', type: 'photo' } : action.payload;
					const normalizedField = normalizeProductField(payload, defaultDataColumns);
					return { ...normalizedField, values: action?.payload?.values || field?.values };
				}
				return field;
			});
		},
		[updateProductField.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[updateProductField.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[updateProductListValues.fulfilled.type]: (state, action: PayloadAction<IField>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productFields.data = state.productFields.data.map((field) => {
				if (field.code === action.payload.code) {
					field = action.payload;
					field.values.sort((a, b) => a.sort - b.sort);
				}
				return field;
			});
		},
		[updateProductListValues.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[updateProductListValues.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createProductField.fulfilled.type]: (state, action: PayloadAction<IField>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productFields.data.push(action.payload);
		},
		[createProductField.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createProductField.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteProductField.fulfilled.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productFields.data = state.productFields.data.filter((field) => field.code !== action.payload);
		},
		[deleteProductField.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteProductField.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteProductListValues.fulfilled.type]: (state, action: PayloadAction<{ fieldCode: string; value: string }>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productFields.data = state.productFields.data.map((field) => {
				if (field.code === action.payload.fieldCode) {
					field.values = field.values.filter((value) => value.value !== action.payload.value);
				}
				return field;
			});
		},
		[deleteProductListValues.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteProductListValues.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
	},
});

export const {
	changeFilterProducts,
	changeItemsFilterProducts,
	changeTaskTime,
	clearProducts,
	clearProductsFilter,
	clearCreatedProduct,
	changeReasonForProduct,
	setDeleteAllFromKanban,
	setIsNewPreset,
	setCurrentPreset,
	setStandardPreset,
	setFilterPresets,
} = productsReducer.actions;
export default productsReducer.reducer;
