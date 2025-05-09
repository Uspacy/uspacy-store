import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProductForEntity, IProductInfoForEntity } from '@uspacy/sdk/lib/models/crm-products-for-entity';

import {
	createProductForEntity,
	createProductsForEntity,
	deleteProductForEntityById,
	deleteProductsForEntity,
	editInfoProductsForEntity,
	editProductForEntity,
	editProductsForEntity,
	fetchInfoProductsForEntity,
	fetchProductForEntity,
	fetchProductsForEntity,
} from './actions';
import { IState } from './types';

const initialState = {
	productsWithInfoForEntity: {},
	productsForEntity: [],
	errorMessage: '',
	defaultProduct: {
		createType: '',
		price: 0,
		product: null,
		amount: 0,
		currency: JSON.parse(localStorage.getItem('userSettings'))?.defaultCurrency || 'UAH',
		discount_type: 'relative',
		measurement_unit_abbr: 'pcs',
		discount_price: 0,
		discount_value: 0,
		quantity: 1,
		tax_rate: null,
		title: '',
		id: 0,
		is_tax_included: 0,
		updated_at: null,
		created_at: null,
	},
	loadingList: false,
	loading: false,
} as IState;

const productsForEntityReducer = createSlice({
	name: 'productsForEntity',
	initialState,
	reducers: {
		changeDefaultCurrency: (state, action: PayloadAction<string>) => {
			state.defaultProduct = { ...state.defaultProduct, currency: action.payload };
		},
		liveEditProductForEntity: (state, action: PayloadAction<IProductForEntity>) => {
			state.productsWithInfoForEntity.list_products = state.productsWithInfoForEntity.list_products.map((product) => {
				if (product.id === action.payload.id) {
					return action.payload;
				}
				return product;
			});
			state.productsForEntity = state.productsForEntity.map((product) => {
				if (product.id === action.payload.id) {
					return action.payload;
				}
				return product;
			});
		},
		liveEditProductsForEntity: (state, action: PayloadAction<IProductForEntity[]>) => {
			state.productsWithInfoForEntity.list_products = action.payload;
			state.productsForEntity = action.payload;
		},
		liveEditInfoProductsForEntity: (state, action: PayloadAction<IProductInfoForEntity>) => {
			state.productsWithInfoForEntity = { ...state.productsWithInfoForEntity, ...action.payload };
		},
		clearProductsForEntity: (state) => {
			state.productsWithInfoForEntity = initialState.productsWithInfoForEntity;
			state.productsForEntity = initialState.productsForEntity;
		},
		addProduct: (state, action: PayloadAction<IProductForEntity>) => {
			state.productsWithInfoForEntity.list_products = [
				...state.productsWithInfoForEntity.list_products.filter((product) => product.id !== 0),
				action.payload,
			];
			state.productsForEntity = [...state.productsForEntity.filter((product) => product.id !== 0), action.payload];
		},
		deleteLocalProduct: (state, action: PayloadAction<number>) => {
			state.productsWithInfoForEntity.list_products = state.productsWithInfoForEntity.list_products.filter(
				(product) => product.id !== action.payload,
			);
			state.productsForEntity = state.productsForEntity.filter((product) => product.id !== action.payload);
			if (!state.productsForEntity.length) {
				state.productsForEntity = [state.defaultProduct];
				state.productsWithInfoForEntity.list_products = [state.defaultProduct];
			}
		},
	},
	extraReducers: {
		[fetchInfoProductsForEntity.fulfilled.type]: (state, action: PayloadAction<IProductInfoForEntity>) => {
			state.loadingList = false;
			state.errorMessage = '';
			state.productsWithInfoForEntity = {
				...action.payload,
				list_products: !!action.payload.list_products.length ? action.payload.list_products : [state.defaultProduct],
			};
			state.productsForEntity = !!action.payload.list_products.length ? action.payload.list_products : [state.defaultProduct];
		},
		[fetchInfoProductsForEntity.pending.type]: (state) => {
			state.loadingList = true;
			state.errorMessage = '';
		},
		[fetchInfoProductsForEntity.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingList = false;
			state.errorMessage = action.payload;
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		[editInfoProductsForEntity.fulfilled.type]: (state, action: PayloadAction<IProductInfoForEntity>) => {
			state.loading = false;
			state.errorMessage = '';
			// TODO prev logic
			// state.productsWithInfoForEntity = { ...state.productsWithInfoForEntity, ...action.payload };
		},
		[editInfoProductsForEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[editInfoProductsForEntity.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[fetchProductsForEntity.fulfilled.type]: (state, action: PayloadAction<IProductForEntity[]>) => {
			state.loadingList = false;
			state.errorMessage = '';
			state.productsForEntity = !!action.payload.length ? action.payload : [state.defaultProduct];
			state.productsWithInfoForEntity = {
				...state.productsWithInfoForEntity,
				list_products: !!action.payload.length ? action.payload : [state.defaultProduct],
			};
		},
		[fetchProductsForEntity.pending.type]: (state) => {
			state.loadingList = true;
			state.errorMessage = '';
		},
		[fetchProductsForEntity.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingList = false;
			state.errorMessage = action.payload;
		},
		[fetchProductForEntity.fulfilled.type]: (state, action: PayloadAction<IProductForEntity>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productsWithInfoForEntity.list_products = state.productsWithInfoForEntity.list_products.map((product) => {
				if (product.id === action.payload.id) {
					return action.payload;
				}
				return product;
			});
			state.productsForEntity = state.productsForEntity.map((product) => {
				if (product.id === action.payload.id) {
					return action.payload;
				}
				return product;
			});
		},
		[fetchProductForEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[fetchProductForEntity.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createProductForEntity.fulfilled.type]: (state, action: PayloadAction<IProductForEntity>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productsForEntity = [...state.productsForEntity, action.payload].filter((it) => it.id !== 0);
			state.productsWithInfoForEntity = {
				...state.productsWithInfoForEntity,
				list_products: state.productsForEntity,
			};
		},
		[createProductForEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createProductForEntity.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},

		[createProductsForEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createProductsForEntity.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		[createProductsForEntity.fulfilled.type]: (state, action: { payload: { data: IProductForEntity[] }; meta: { arg: IProductForEntity[] } }) => {
			state.loading = false;
			state.errorMessage = '';
			const addedItems = action.payload.data.map((it, idx) => {
				return { ...action?.meta?.arg?.[idx], ...it };
			});

			state.productsWithInfoForEntity.list_products = [
				...state.productsWithInfoForEntity.list_products.filter((product) => product.id !== 0),
				...addedItems,
			];
			state.productsForEntity = [...state.productsForEntity.filter((product) => product.id !== 0), ...addedItems];
		},

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		[editProductForEntity.fulfilled.type]: (state, action: PayloadAction<IProductForEntity>) => {
			state.loading = false;
			state.errorMessage = '';
			// TODO prev logic
			// state.productsWithInfoForEntity.list_products = state.productsWithInfoForEntity.list_products.map((product) => {
			// 	if (product.id === action.payload.id) {
			// 		return action.payload;
			// 	}
			// 	return product;
			// });
			// state.productsForEntity = state.productsForEntity.map((product) => {
			// 	if (product.id === action.payload.id) {
			// 		return action.payload;
			// 	}
			// 	return product;
			// });
		},
		[editProductForEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[editProductForEntity.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		[editProductsForEntity.fulfilled.type]: (state, action: PayloadAction<IProductForEntity[]>) => {
			state.loading = false;
			state.errorMessage = '';
			// TODO prev logic
			// state.productsWithInfoForEntity.list_products = action.payload;
			// state.productsForEntity = action.payload;
			// });
		},
		[editProductsForEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[editProductsForEntity.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteProductForEntityById.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productsWithInfoForEntity.list_products = state.productsWithInfoForEntity.list_products.filter(
				(product) => product.id !== action.payload,
			);
			state.productsForEntity = state.productsForEntity.filter((product) => product.id !== action.payload);
			if (!state.productsForEntity.length) {
				state.productsForEntity = [state.defaultProduct];
				state.productsWithInfoForEntity.list_products = [state.defaultProduct];
			}
		},
		[deleteProductForEntityById.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteProductForEntityById.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteProductsForEntity.fulfilled.type]: (state, action: PayloadAction<number[]>) => {
			state.loading = false;
			state.errorMessage = '';
			state.productsWithInfoForEntity.list_products = state.productsWithInfoForEntity.list_products.filter(
				(product) => !action.payload.includes(product.id),
			);
			state.productsForEntity = state.productsForEntity.filter((product) => !action.payload.includes(product.id));
			if (!state.productsForEntity.length) {
				state.productsForEntity = [state.defaultProduct];
				state.productsWithInfoForEntity.list_products = [state.defaultProduct];
			}
		},
		[deleteProductsForEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteProductsForEntity.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
	},
});

export const {
	clearProductsForEntity,
	liveEditProductForEntity,
	liveEditInfoProductsForEntity,
	addProduct,
	liveEditProductsForEntity,
	deleteLocalProduct,
	changeDefaultCurrency,
} = productsForEntityReducer.actions;

export default productsForEntityReducer.reducer;
