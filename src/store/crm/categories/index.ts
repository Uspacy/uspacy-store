import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProductCategory } from '@uspacy/sdk/lib/models/crm-products-category';

import { createCategory, deleteCategory, fetchCategories, updateCategory } from './actions';
import { IState } from './types';

const initialCategories = {
	data: [],
	loading: false,
};

const initialState: IState = {};

const categoriesReducer = createSlice({
	name: 'categoriesReducer',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchCategories.fulfilled.type]: (state, action: PayloadAction<{ data: IProductCategory[] }, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loading = false;
			state[action.meta.arg.entityCode].errorMessage = '';
			state[action.meta.arg.entityCode].data = action.payload.data;
		},
		[fetchCategories.pending.type]: (state, action: PayloadAction<string, string, { arg: { entityCode: string } }>) => {
			if (!state[action.meta.arg.entityCode]) {
				state[action.meta.arg.entityCode] = { ...initialCategories };
			}
			state[action.meta.arg.entityCode].loading = true;
			state[action.meta.arg.entityCode].errorMessage = '';
		},
		[fetchCategories.rejected.type]: (state, action: PayloadAction<string, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loading = false;
			state[action.meta.arg.entityCode].errorMessage = action.payload;
		},

		[createCategory.fulfilled.type]: (state, action: PayloadAction<IProductCategory, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loading = false;
			state[action.meta.arg.entityCode].errorMessage = '';
			state[action.meta.arg.entityCode].data = [...state[action.meta.arg.entityCode].data, action.payload];
		},
		[createCategory.pending.type]: (state, action: PayloadAction<IProductCategory, string, { arg: { entityCode: string } }>) => {
			if (!state[action.meta.arg.entityCode]) {
				state[action.meta.arg.entityCode] = initialCategories;
			}
			state[action.meta.arg.entityCode].errorMessage = '';
			state[action.meta.arg.entityCode].loading = true;
		},
		[createCategory.rejected.type]: (state, action: PayloadAction<string, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].errorMessage = action.payload;
			state[action.meta.arg.entityCode].loading = false;
		},

		[updateCategory.pending.type]: (
			state,
			action: PayloadAction<unknown, string, { arg: { entityCode: string; category: Partial<IProductCategory> } }>,
		) => {
			state[action.meta.arg.entityCode].data = state[action.meta.arg.entityCode].data.map((category) => {
				if (category.id === action.meta.arg.category.id) {
					return {
						...category,
						...action.meta.arg.category,
					};
				}
				return category;
			});
		},

		[deleteCategory.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string; id: number } }>) => {
			state[action.meta.arg.entityCode].data = state[action.meta.arg.entityCode].data.filter((category) => category.id !== action.meta.arg.id);
		},
	},
});

export const {} = categoriesReducer.actions;

export default categoriesReducer.reducer;
