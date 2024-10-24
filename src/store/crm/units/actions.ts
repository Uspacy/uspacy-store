import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IMeasurementUnit } from '@uspacy/sdk/lib/models/crm-products-unit';

export const fetchUnits = createAsyncThunk('crm/units/fetchUnits', async (_: { entityCode: string }, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmProductUnitService?.getProductUnits();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createUnit = createAsyncThunk(
	'crm/units/createUnit',
	async ({ data }: { entityCode: string; data: Partial<IMeasurementUnit> }, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmProductUnitService?.createProductUnit(data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const updateUnit = createAsyncThunk(
	'crm/units/updateUnit',
	async ({ data }: { entityCode: string; data: Partial<IMeasurementUnit> }, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmProductUnitService?.updateProductUnit(data.id, data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteUnit = createAsyncThunk('crm/units/deleteUnit', async ({ id }: { id: number; entityCode: string }, thunkAPI) => {
	try {
		return await uspacySdk?.crmProductUnitService?.deleteProductUnit(id);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
