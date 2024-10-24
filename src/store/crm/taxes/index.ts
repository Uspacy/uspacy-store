import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITax } from '@uspacy/sdk/lib/models/crm-products-taxes';

import { createTax, deleteTax, fetchTaxes, updateTax } from './actions';
import { EntityTaxes, IState } from './types';

const initialTaxes: EntityTaxes = {
	data: [],
	loading: false,
	errorMessage: '',
};

const initialState: IState = {};

const productsTaxesReducer = createSlice({
	name: 'productsTaxes',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchTaxes.fulfilled.type]: (state, action: PayloadAction<{ data: ITax[] }, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loading = false;
			state[action.meta.arg.entityCode].errorMessage = '';
			state[action.meta.arg.entityCode].data = action.payload.data;
		},
		[fetchTaxes.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string } }>) => {
			if (!state[action.meta.arg.entityCode]) {
				state[action.meta.arg.entityCode] = { ...initialTaxes };
			}
			state[action.meta.arg.entityCode].loading = true;
			state[action.meta.arg.entityCode].errorMessage = '';
		},
		[fetchTaxes.rejected.type]: (state, action: PayloadAction<string, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loading = false;
			state[action.meta.arg.entityCode].errorMessage = action.payload;
		},

		[createTax.fulfilled.type]: (state, action: PayloadAction<ITax, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loading = false;
			state[action.meta.arg.entityCode].errorMessage = '';
			state[action.meta.arg.entityCode].data = [...state[action.meta.arg.entityCode].data, action.payload];
		},
		[createTax.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].errorMessage = '';
			state[action.meta.arg.entityCode].loading = true;
			if (!state[action.meta.arg.entityCode]) {
				state[action.meta.arg.entityCode] = initialTaxes;
			}
		},
		[createTax.rejected.type]: (state, action: PayloadAction<string, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].errorMessage = action.payload;
			state[action.meta.arg.entityCode].loading = false;
		},

		[updateTax.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string; data: ITax } }>) => {
			state[action.meta.arg.entityCode].data = state[action.meta.arg.entityCode].data.map((item) => {
				if (item.id === action.meta.arg.data.id) {
					return {
						...item,
						...action.meta.arg.data,
					};
				}
				return item;
			});
		},

		[deleteTax.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string; id: number } }>) => {
			state[action.meta.arg.entityCode].data = state[action.meta.arg.entityCode].data.filter((item) => item.id !== action.meta.arg.id);
		},
	},
});

export const {} = productsTaxesReducer.actions;
export default productsTaxesReducer.reducer;
