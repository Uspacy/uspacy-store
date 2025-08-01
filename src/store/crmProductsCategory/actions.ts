import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IProductCategory } from '@uspacy/sdk/lib/models/crm-products-category';

export const fetchProductsCategories = createAsyncThunk('productsCategory/fetchProductsCategory', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmProductsCategoryService?.getProductCategories();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createProductCategory = createAsyncThunk(
	'productsCategory/createProductCategory',
	async (data: Pick<IProductCategory, 'name' | 'parent_id'>, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmProductsCategoryService?.createProductCategory(data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const editProductCategory = createAsyncThunk('productsCategory/editProductCategory', async (category: Partial<IProductCategory>, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmProductsCategoryService?.updateProductCategory(category.id, category);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteProductCategory = createAsyncThunk('productsCategory/deleteProductCategory', async (id: number, thunkAPI) => {
	try {
		await uspacySdk?.crmProductsCategoryService?.deleteProductCategory(id, null);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
