import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IPriceType } from '@uspacy/sdk/lib/models/crm-products-price-types';

export const fetchPriceTypes = createAsyncThunk('crm/priceTypes/fetchPriceTypes', async (_: { entityCode: string }, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmProductsPriceTypes?.getProductPriceTypes();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createProductPrice = createAsyncThunk(
	'crm/priceTypes/createCategory',
	async ({ data }: { entityCode?: string; data: Partial<IPriceType> }, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmProductsPriceTypes?.createProductPriceType(data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const updateProductPrice = createAsyncThunk(
	'crm/priceTypes/updateCategory',
	async ({ priceType }: { entityCode?: string; priceType: Partial<IPriceType> }, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmProductsPriceTypes?.updateProductPriceType(priceType.id, priceType);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const deleteProductPriceType = createAsyncThunk(
	'crm/priceTypes/deleteProductPriceType',
	async ({ id }: { entityCode?: string; id: number }, thunkAPI) => {
		try {
			await uspacySdk?.crmProductsPriceTypes?.deleteProductPriceType(id);
			return id;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);
