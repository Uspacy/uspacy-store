import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IProductForEntity, IProductForEntityCreate, IProductInfoForEntity } from '@uspacy/sdk/lib/models/crm-products-for-entity';

export const fetchInfoProductsForEntity = createAsyncThunk(
	'productsForEntity/fetchInfoProductsForEntity',
	async (data: { entityType: string; entityId: number }, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmProductsForEntityService?.getInfoProductsForEntity(data.entityType, data.entityId);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const editInfoProductsForEntity = createAsyncThunk(
	'productsForEntity/editInfoProductsForEntity',
	async (info: Partial<IProductInfoForEntity>, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmProductsForEntityService?.updateInfoProductForEntity(info?.id, info);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const fetchProductsForEntity = createAsyncThunk('productsForEntity/fetchProductsForEntity', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmProductsForEntityService?.getProductsForEntity();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const fetchProductForEntity = createAsyncThunk('productsForEntity/fetchProductForEntity', async (id: number, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmProductsForEntityService?.getProductForEntity(id);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
export const createProductForEntity = createAsyncThunk(
	'productsForEntity/createProductForEntity',
	async (data: Partial<IProductForEntityCreate>, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmProductsForEntityService?.createProductForEntity(data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const createProductsForEntity = createAsyncThunk(
	'productsForEntity/createProductsForEntity',
	async (data: Partial<IProductForEntity[]>, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmProductsForEntityService?.createProductsForEntity(data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const editProductForEntity = createAsyncThunk('productsForEntity/editProductForEntity', async (data: Partial<IProductForEntity>, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmProductsForEntityService?.updateProductForEntity(data?.id, data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const editProductsForEntity = createAsyncThunk(
	'productsForEntity/editProductsForEntity',
	async (data: Partial<IProductForEntity[]>, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmProductsForEntityService?.updateProductsForEntity(data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);
export const deleteProductForEntityById = createAsyncThunk(
	'productsForEntity/deleteProductForEntityById',
	async (data: { productForEntityId: number }, thunkAPI) => {
		try {
			await uspacySdk?.crmProductsForEntityService?.deleteProductForEntity(data.productForEntityId);

			return data.productForEntityId;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteProductsForEntity = createAsyncThunk('productsForEntity/deleteProductsForEntity', async (data: { ids: number[] }, thunkAPI) => {
	try {
		await uspacySdk?.crmProductsForEntityService?.deleteProductsForEntity(data.ids);
		return data.ids;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
