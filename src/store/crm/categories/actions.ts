import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IProductCategory } from '@uspacy/sdk/lib/models/crm-products-category';

export const fetchCategories = createAsyncThunk('crm/categories/fetchCategories', async (_: { entityCode: string }, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmProductsCategoryService?.getProductCategories();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createCategory = createAsyncThunk(
	'crm/categories/createCategory',
	async ({ data }: { entityCode?: string; data: Partial<IProductCategory> }, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmProductsCategoryService?.createProductCategory(data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const updateCategory = createAsyncThunk(
	'crm/categories/updateCategory',
	async ({ category }: { entityCode?: string; category: Partial<IProductCategory> }, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmProductsCategoryService?.updateProductCategory(category.id, category);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteCategory = createAsyncThunk('crm/categories/deleteCategory', async ({ id }: { entityCode?: string; id: number }, thunkAPI) => {
	try {
		await uspacySdk?.crmProductsCategoryService?.deleteProductCategory(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
