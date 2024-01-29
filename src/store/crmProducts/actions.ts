/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IProductFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { IProduct } from '@uspacy/sdk/lib/models/crm-products';
import { IField } from '@uspacy/sdk/lib/models/field';

import { normalizeCategories, normalizeProduct, normalizeProductForView } from '../../helpers/normalizeProduct';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmProductsService?.getProducts();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const fetchProductsWithFilters = createAsyncThunk(
	'products/fetchProductsWithFilters',
	async (
		data: { params: Omit<IProductFilters, 'openDatePicker'>; signal: AbortSignal; relatedEntityId?: string; relatedEntityType?: string },
		thunkAPI,
	) => {
		try {
			const product_category_ids = normalizeCategories(data.params.select);
			const withoutCategories = product_category_ids === null;
			const params = {
				...(data.params.search ? { q: data.params.search } : {}),
				page: data.params.page,
				list: data.params.perPage,
				availability: Array.isArray(data.params.availability) ? data.params.availability : [data.params.availability],
				type: Array.isArray(data.params.type) ? data.params.type : [data.params.type],
				currency: (data.params.price_from || data.params.price_to) && data.params.currency,
				...(data.params.price_from ? { price_from: Math.round(data.params.price_from * 100) } : {}),
				...(data.params.price_to ? { price_to: Math.round(data.params.price_to * 100) } : {}),
				balance_from: data.params.balance_from,
				balance_to: data.params.balance_to,
				is_active: (Array.isArray(data.params.is_active) ? data.params.is_active : [data.params.is_active]).map((it) => {
					if (it === 'active') return 1;
					if (it === 'noActive') return 0;
					return it;
				}) as any,
				product_category_ids: withoutCategories ? ' ' : normalizeCategories(data.params.select),
			};

			const res = await uspacySdk?.crmProductsService?.getProductsWithFilters(params, data?.signal);
			return res?.data;
		} catch (e) {
			if (data.signal.aborted) {
				return {
					aborted: true,
				};
			} else {
				return thunkAPI.rejectWithValue('Failure');
			}
		}
	},
);

export const createProduct = createAsyncThunk('products/createProduct', async (data: Partial<IProduct>, thunkAPI) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, ...rest } = data;
		const res = await uspacySdk?.crmProductsService?.createProduct(normalizeProduct(rest as IProduct));
		const resData = res?.data;

		return normalizeProductForView(resData as any);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const updateProduct = createAsyncThunk('products/updateProduct', async (data: IProduct, thunkAPI) => {
	try {
		const { id, ...rest } = data;
		const res = await uspacySdk?.crmProductsService?.updateProduct(id, normalizeProduct(rest));
		const resData = res?.data;
		return normalizeProductForView(resData as any);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: number, thunkAPI) => {
	try {
		await uspacySdk?.crmProductsService?.deleteProduct(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const massProductsDeletion = createAsyncThunk(
	'products/massDeletion',
	async ({ entityIds, exceptIds, all, params }: IMassActions, { rejectWithValue }) => {
		try {
			await uspacySdk.crmProductsService.massProductsDeletion({
				all,
				entityIds,
				exceptIds,
				params: all && params?.length ? `/?${params}` : '',
			});

			return { entityIds, exceptIds, all };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const massProductsEditing = createAsyncThunk(
	'products/massEditing',
	async ({ entityIds, exceptIds, all, params, payload, settings, profile, admin }: IMassActions, { rejectWithValue }) => {
		try {
			await uspacySdk.crmProductsService.massProductsEditing({
				all,
				entityIds,
				exceptIds,
				params: all && params?.length ? `/?${params}` : '',
				payload,
				settings,
			});

			return { entityIds, exceptIds, all, params, payload, settings, profile, admin };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const fetchFieldsForProduct = createAsyncThunk('products/fetchFieldsForProduct', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.crmProductsService.getProductFields();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateProductField = createAsyncThunk('products/updateProductField', async (data: IField, thunkAPI) => {
	try {
		const res = await uspacySdk.crmProductsService.updateProductField(data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateProductListValues = createAsyncThunk('products/updateProductListValues', async (data: IField, thunkAPI) => {
	try {
		const res = await uspacySdk.crmProductsService.updateProductListValues(data);
		return { ...data, values: res?.data };
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createProductField = createAsyncThunk('products/createProductField', async (data: IField, thunkAPI) => {
	try {
		const res = await uspacySdk.crmProductsService.createProductField(data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteProductListValues = createAsyncThunk(
	'products/deleteLeadListValues',
	async ({ value, fieldCode }: { value: string; fieldCode: string }, thunkAPI) => {
		try {
			await uspacySdk.crmProductsService.deleteProductListValues(value, fieldCode);
			return { value, fieldCode };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteProductField = createAsyncThunk('products/deleteProductField', async (code: string, thunkAPI) => {
	try {
		await uspacySdk.crmProductsService.deleteProductField(code);
		return code;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
