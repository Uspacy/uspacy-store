import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPriceType } from '@uspacy/sdk/lib/models/crm-products-price-types';

import { createProductPrice, deleteProductPriceType, fetchPriceTypes, updateProductPrice } from './actions';
import { IState } from './types';

const initialProductTypes = {
	data: [],
	loading: false,
};

const initialState: IState = {};

const normalizeSort = (newItems: IPriceType[]): IPriceType[] => {
	return newItems
		.sort((a, b) => a.sort - b.sort)
		.map((item, index) => ({
			...item,
			sort: (index + 1) * 10,
		}));
};

const productPriceReducer = createSlice({
	name: 'productPriceReducer',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchPriceTypes.fulfilled.type]: (state, action: PayloadAction<{ data: IPriceType[] }, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loading = false;
			state[action.meta.arg.entityCode].errorMessage = '';
			state[action.meta.arg.entityCode].data = (action.payload.data || []).sort((a, b) => a.sort - b.sort);
		},
		[fetchPriceTypes.pending.type]: (state, action: PayloadAction<string, string, { arg: { entityCode: string } }>) => {
			if (!state[action.meta.arg.entityCode]) {
				state[action.meta.arg.entityCode] = { ...initialProductTypes };
			}
			state[action.meta.arg.entityCode].loading = true;
			state[action.meta.arg.entityCode].errorMessage = '';
		},
		[fetchPriceTypes.rejected.type]: (state, action: PayloadAction<string, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].loading = false;
			state[action.meta.arg.entityCode].errorMessage = action.payload;
		},

		[createProductPrice.fulfilled.type]: (state, action: PayloadAction<IPriceType, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].errorMessage = '';
			state[action.meta.arg.entityCode].data = [...state[action.meta.arg.entityCode].data, action.payload];
		},
		[createProductPrice.pending.type]: (state, action: PayloadAction<IPriceType, string, { arg: { entityCode: string } }>) => {
			if (!state[action.meta.arg.entityCode]) {
				state[action.meta.arg.entityCode] = initialProductTypes;
			}
			state[action.meta.arg.entityCode].errorMessage = '';
		},
		[createProductPrice.rejected.type]: (state, action: PayloadAction<string, string, { arg: { entityCode: string } }>) => {
			state[action.meta.arg.entityCode].errorMessage = action.payload;
		},

		[updateProductPrice.pending.type]: (
			state,
			action: PayloadAction<unknown, string, { arg: { entityCode: string; priceType: IPriceType } }>,
		) => {
			const updatePriceType = action.meta.arg.priceType;
			const withUpdatedPriceSort = state[action.meta.arg.entityCode].data.map((item) =>
				item.id === updatePriceType.id
					? { ...item, sort: updatePriceType.sort, default: updatePriceType.default }
					: { ...item, default: updatePriceType.default ? false : item.default },
			);
			state[action.meta.arg.entityCode].data = normalizeSort(withUpdatedPriceSort);
		},

		[deleteProductPriceType.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string; id: number } }>) => {
			const removeItem = state[action.meta.arg.entityCode].data.find((it) => it.id === action.meta.arg.id);
			const withoutRemovedPriceType = state[action.meta.arg.entityCode].data.filter((it) => it.id !== action.meta.arg.id);
			if (removeItem?.default) {
				const [firstItem, ...otherItems] = withoutRemovedPriceType ?? [];
				state[action.meta.arg.entityCode].data = normalizeSort([{ ...firstItem, default: true, active: true }, ...otherItems]);
			} else {
				state[action.meta.arg.entityCode].data = normalizeSort(withoutRemovedPriceType);
			}
		},
	},
});

export const {} = productPriceReducer.actions;

export default productPriceReducer.reducer;
