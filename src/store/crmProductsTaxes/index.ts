import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITax, ITaxes } from '@uspacy/sdk/lib/models/crm-products-taxes';

import { createProductTax, deleteProductTax, editProductTax, fetchProductsTaxes } from './actions';
import { IState } from './types';

const initialState = {
	productsTaxes: { data: [] },
	productsTax: {},
	errorMessage: '',
	loadingList: false,
	loading: false,
} as IState;

const productsTaxesReducer = createSlice({
	name: 'productsTaxes',
	initialState,
	reducers: {
		clearProductTax: (state) => {
			state.productsTax = initialState.productsTax;
		},
	},
	extraReducers: {
		[fetchProductsTaxes.fulfilled.type]: (state, action: PayloadAction<ITaxes>) => {
			state.loadingList = false;
			state.errorMessage = '';
			state.productsTaxes = action.payload;
		},
		[fetchProductsTaxes.pending.type]: (state) => {
			state.loadingList = true;
			state.errorMessage = '';
		},
		[fetchProductsTaxes.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingList = false;
			state.errorMessage = action.payload;
		},
		[createProductTax.fulfilled.type]: (state, action: PayloadAction<ITax>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productsTaxes = { data: [...state.productsTaxes.data, action.payload] };
		},
		[createProductTax.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createProductTax.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[editProductTax.fulfilled.type]: (state, action: PayloadAction<ITax>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productsTaxes.data = state.productsTaxes.data.map((tax) => {
				if (tax.id === action.payload.id) {
					return action.payload;
				}
				return tax;
			});
		},
		[editProductTax.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[editProductTax.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteProductTax.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productsTaxes.data = state.productsTaxes.data.filter((tax) => tax.id !== action.payload);
		},
		[deleteProductTax.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteProductTax.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
	},
});

export const { clearProductTax } = productsTaxesReducer.actions;
export default productsTaxesReducer.reducer;
