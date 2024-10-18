import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ITax } from '@uspacy/sdk/lib/models/crm-products-taxes';

export const fetchTaxes = createAsyncThunk('crm/taxes/fetchTaxes', async (_: { entityCode: string }, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmProductTaxesService?.getProductTaxes();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createTax = createAsyncThunk('crm/taxes/createTax', async ({ data }: { entityCode: string; data: Partial<ITax> }, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmProductTaxesService?.createProductTax(data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateTax = createAsyncThunk('crm/taxes/updateTax', async ({ data }: { entityCode: string; data: Partial<ITax> }, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmProductTaxesService?.updateProductTax(data.id, data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteTax = createAsyncThunk('crm/taxes/deleteTax', async ({ id }: { id: number; entityCode: string }, thunkAPI) => {
	try {
		return await uspacySdk?.crmProductTaxesService?.deleteProductTax(id);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
