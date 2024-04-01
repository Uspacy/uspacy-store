import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProductCategories, IProductCategory } from '@uspacy/sdk/lib/models/crm-products-category';

import { createProductCategory, deleteProductCategory, editProductCategory, fetchProductsCategories } from './actions';
import { IState } from './types';

const initialState = {
	productsCategory: { data: [] },
	productCategory: {},
	errorMessage: '',
	loadingList: false,
	loading: false,
} as IState;

const productsCategoryReducer = createSlice({
	name: 'productsCategory',
	initialState,
	reducers: {
		clearProductCategory: (state) => {
			state.productCategory = initialState.productCategory;
		},
	},
	extraReducers: {
		[fetchProductsCategories.fulfilled.type]: (state, action: PayloadAction<IProductCategories>) => {
			state.loadingList = false;
			state.errorMessage = '';
			state.productsCategory = action.payload;
		},
		[fetchProductsCategories.pending.type]: (state) => {
			state.loadingList = true;
			state.errorMessage = '';
		},
		[fetchProductsCategories.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingList = false;
			state.errorMessage = action.payload;
		},
		[createProductCategory.fulfilled.type]: (state, action: PayloadAction<IProductCategory>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productsCategory = { data: [...state.productsCategory.data, action.payload] };
		},
		[createProductCategory.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createProductCategory.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[editProductCategory.fulfilled.type]: (state, action: PayloadAction<IProductCategory>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productsCategory.data = state.productsCategory.data.map((category) => {
				if (category.id === action.payload.id) {
					return action.payload;
				}
				return category;
			});
		},
		[editProductCategory.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[editProductCategory.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteProductCategory.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productsCategory.data = state.productsCategory.data.filter((category) => category.id !== action.payload);
		},
		[deleteProductCategory.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteProductCategory.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
	},
});

export const { clearProductCategory } = productsCategoryReducer.actions;

export default productsCategoryReducer.reducer;
