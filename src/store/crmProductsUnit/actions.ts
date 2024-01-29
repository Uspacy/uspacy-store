import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IMeasurementUnit } from '@uspacy/sdk/lib/models/crm-products-unit';

export const fetchProductsMeasurementUnits = createAsyncThunk('productsUnit/fetchProductsMeasurementUnits', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmProductUnitService?.getProductUnits();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createProductMeasurementUnit = createAsyncThunk(
	'productsUnit/createProductMeasurementUnit',
	async (data: Pick<IMeasurementUnit, 'name' | 'abbr'>, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmProductUnitService?.createProductUnit(data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const editProductMeasurementUnit = createAsyncThunk('productsUnit/editProductMeasurementUnit', async (unit: IMeasurementUnit, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmProductUnitService?.updateProductUnit(unit.id, unit);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteProductMeasurementUnit = createAsyncThunk('productsUnit/deleteProductMeasurementUnit', async (id: number, thunkAPI) => {
	try {
		await uspacySdk?.crmProductUnitService?.deleteProductUnit(id);

		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
