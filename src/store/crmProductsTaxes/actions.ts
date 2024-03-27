import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ITax } from '@uspacy/sdk/lib/models/crm-products-taxes';

export const fetchProductsTaxes = createAsyncThunk('productsTaxes/fetchProductsCategory', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmProductTaxesService?.getProductTaxes();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createProductTax = createAsyncThunk(
	'productsTaxes/createProductTax',
	async (data: Pick<ITax, 'name' | 'is_active' | 'rate'>, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmProductTaxesService?.createProductTax(data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const editProductTax = createAsyncThunk('productsTaxes/editProductTax', async (tax: Partial<ITax>, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmProductTaxesService?.updateProductTax(tax.id, tax);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteProductTax = createAsyncThunk('productsTaxes/deleteProductTax', async (id: number, thunkAPI) => {
	try {
		await uspacySdk?.crmProductTaxesService?.deleteProductTax(id);

		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
