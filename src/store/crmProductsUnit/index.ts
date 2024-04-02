import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMeasurementUnit, IMeasurementUnits } from '@uspacy/sdk/lib/models/crm-products-unit';

import { createProductMeasurementUnit, deleteProductMeasurementUnit, editProductMeasurementUnit, fetchProductsMeasurementUnits } from './actions';
import { IState } from './types';

const initialState = {
	productsUnit: {},
	productsUnits: {
		data: [],
	},
	errorMessage: '',
	loadingList: false,
	loading: false,
} as IState;

const productsUnitReducer = createSlice({
	name: 'productsUnit',
	initialState,
	reducers: {
		clearProductUnit: (state) => {
			state.productsUnit = initialState.productsUnit;
		},
	},
	extraReducers: {
		[fetchProductsMeasurementUnits.fulfilled.type]: (state, action: PayloadAction<IMeasurementUnits>) => {
			state.loadingList = false;
			state.errorMessage = '';
			state.productsUnits = action.payload;
		},
		[fetchProductsMeasurementUnits.pending.type]: (state) => {
			state.loadingList = true;
			state.errorMessage = '';
		},
		[fetchProductsMeasurementUnits.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingList = false;
			state.errorMessage = action.payload;
		},
		[createProductMeasurementUnit.fulfilled.type]: (state, action: PayloadAction<IMeasurementUnit>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productsUnits = { data: [...state.productsUnits.data, action.payload] };
		},
		[createProductMeasurementUnit.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createProductMeasurementUnit.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[editProductMeasurementUnit.fulfilled.type]: (state, action: PayloadAction<IMeasurementUnit>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productsUnits.data = state.productsUnits.data.map((unit) => {
				if (unit.id === action.payload.id) {
					return action.payload;
				}
				return unit;
			});
		},
		[editProductMeasurementUnit.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[editProductMeasurementUnit.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteProductMeasurementUnit.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productsUnits.data = state.productsUnits.data.filter((unit) => unit.id !== action.payload);
		},
		[deleteProductMeasurementUnit.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteProductMeasurementUnit.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
	},
});

export const { clearProductUnit } = productsUnitReducer.actions;
export default productsUnitReducer.reducer;
