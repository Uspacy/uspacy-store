import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMeasurementUnit } from '@uspacy/sdk/lib/models/crm-products-unit';

import { createUnit, deleteUnit, fetchUnits, updateUnit } from './actions';
import { EntityUnits, IState } from './types';

const initialUnits: EntityUnits = {
	data: [],
	loading: false,
	errorMessage: '',
};

const initialState: IState = {};

const productsUnitReducer = createSlice({
	name: 'productsUnit',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchUnits.fulfilled.type]: (state, action: PayloadAction<{ data: IMeasurementUnit[] }, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loading = false;
			state[action.meta.arg.entityCode].errorMessage = '';
			state[action.meta.arg.entityCode].data = action.payload.data;
		},
		[fetchUnits.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string } }>) => {
			if (!state[action.meta.arg.entityCode]) {
				state[action.meta.arg.entityCode] = {
					...initialUnits,
				};
			}
			state[action.meta.arg.entityCode].loading = true;
			state[action.meta.arg.entityCode].errorMessage = '';
		},
		[fetchUnits.rejected.type]: (state, action: PayloadAction<string, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loading = false;
			state[action.meta.arg.entityCode].errorMessage = action.payload;
		},

		[createUnit.fulfilled.type]: (state, action: PayloadAction<IMeasurementUnit, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loading = false;
			state[action.meta.arg.entityCode].errorMessage = '';
			state[action.meta.arg.entityCode].data = [...state[action.meta.arg.entityCode].data, action.payload];
		},
		[createUnit.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string } }>) => {
			if (!state[action.meta.arg.entityCode]) {
				state[action.meta.arg.entityCode] = initialUnits;
			}
			state[action.meta.arg.entityCode].errorMessage = '';
			state[action.meta.arg.entityCode].loading = true;
		},
		[createUnit.rejected.type]: (state, action: PayloadAction<string, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].errorMessage = action.payload;
			state[action.meta.arg.entityCode].loading = false;
		},
		[updateUnit.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string; data: IMeasurementUnit } }>) => {
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

		[deleteUnit.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string; id: number } }>) => {
			state[action.meta.arg.entityCode].data = state[action.meta.arg.entityCode].data.filter((item) => item.id !== action.meta.arg.id);
		},
	},
});

export const {} = productsUnitReducer.actions;
export default productsUnitReducer.reducer;
