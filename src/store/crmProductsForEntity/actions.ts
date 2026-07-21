import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IProductForEntity, IProductForEntityCreate, IProductInfoForEntity } from '@uspacy/sdk/lib/models/crm-products-for-entity';

import { IState } from './types';

let draftTempId = Date.now();
const nextDraftTempId = () => ++draftTempId;

export const fetchInfoProductsForEntity = createAsyncThunk(
	'productsForEntity/fetchInfoProductsForEntity',
	async (data: { entityType: string; entityId: number }, thunkAPI) => {
		if (!data.entityId) {
			return thunkAPI.rejectWithValue('Failure');
		}
		try {
			const res = await uspacySdk?.crmProductsForEntityService?.getInfoProductsForEntity(data.entityType, data.entityId);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const editInfoProductsForEntity = createAsyncThunk(
	'productsForEntity/editInfoProductsForEntity',
	async (info: Partial<IProductInfoForEntity>, thunkAPI) => {
		const state = thunkAPI.getState() as { crmProductsForEntity: IState };
		if (state.crmProductsForEntity.isDraft) {
			return info;
		}
		try {
			const res = await uspacySdk?.crmProductsForEntityService?.updateInfoProductForEntity(info?.id, info);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const fetchProductsForEntity = createAsyncThunk('productsForEntity/fetchProductsForEntity', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmProductsForEntityService?.getProductsForEntity();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const fetchProductForEntity = createAsyncThunk('productsForEntity/fetchProductForEntity', async (id: number, thunkAPI) => {
	const state = thunkAPI.getState() as { crmProductsForEntity: IState };
	if (state.crmProductsForEntity.isDraft) {
		return thunkAPI.rejectWithValue('Failure');
	}
	try {
		const res = await uspacySdk?.crmProductsForEntityService?.getProductForEntity(id);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
export const createProductForEntity = createAsyncThunk(
	'productsForEntity/createProductForEntity',
	async (data: Partial<IProductForEntityCreate>, thunkAPI) => {
		const state = thunkAPI.getState() as { crmProductsForEntity: IState };
		if (state.crmProductsForEntity.isDraft) {
			return { ...data, id: nextDraftTempId(), created_at: null, updated_at: null } as unknown as IProductForEntity;
		}
		try {
			const res = await uspacySdk?.crmProductsForEntityService?.createProductForEntity(data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const createProductsForEntity = createAsyncThunk(
	'productsForEntity/createProductsForEntity',
	async (data: Partial<IProductForEntity[]>, thunkAPI) => {
		const state = thunkAPI.getState() as { crmProductsForEntity: IState };
		if (state.crmProductsForEntity.isDraft) {
			const localProducts = (data || []).map(
				(it) => ({ ...it, id: nextDraftTempId(), created_at: null, updated_at: null }) as IProductForEntity,
			);
			return { data: localProducts };
		}
		try {
			const res = await uspacySdk?.crmProductsForEntityService?.createProductsForEntity(data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const editProductForEntity = createAsyncThunk('productsForEntity/editProductForEntity', async (data: Partial<IProductForEntity>, thunkAPI) => {
	const state = thunkAPI.getState() as { crmProductsForEntity: IState };
	if (state.crmProductsForEntity.isDraft) {
		return data;
	}
	try {
		const res = await uspacySdk?.crmProductsForEntityService?.updateProductForEntity(data?.id, data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const editProductsForEntity = createAsyncThunk(
	'productsForEntity/editProductsForEntity',
	async (data: Partial<IProductForEntity[]>, thunkAPI) => {
		const state = thunkAPI.getState() as { crmProductsForEntity: IState };
		if (state.crmProductsForEntity.isDraft) {
			return data;
		}
		try {
			const res = await uspacySdk?.crmProductsForEntityService?.updateProductsForEntity(data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);
export const deleteProductForEntityById = createAsyncThunk(
	'productsForEntity/deleteProductForEntityById',
	async (data: { productForEntityId: number }, thunkAPI) => {
		const state = thunkAPI.getState() as { crmProductsForEntity: IState };
		if (state.crmProductsForEntity.isDraft) {
			return data.productForEntityId;
		}
		try {
			await uspacySdk?.crmProductsForEntityService?.deleteProductForEntity(data.productForEntityId);

			return data.productForEntityId;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteProductsForEntity = createAsyncThunk('productsForEntity/deleteProductsForEntity', async (data: { ids: number[] }, thunkAPI) => {
	const state = thunkAPI.getState() as { crmProductsForEntity: IState };
	if (state.crmProductsForEntity.isDraft) {
		return data.ids;
	}
	try {
		await uspacySdk?.crmProductsForEntityService?.deleteProductsForEntity(data.ids);
		return data.ids;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const commitDraftProductsForEntity = createAsyncThunk(
	'productsForEntity/commitDraftProductsForEntity',
	async (
		data: {
			entityType: string;
			entityId: number;
			totals: {
				amountBeforeDiscountAndTax: number;
				amountDiscount: number;
				amountTax: number;
				amountBeforeTax: number;
				amountTotal: number;
			};
			isAutomaticCalculation: boolean;
		},
		thunkAPI,
	) => {
		const state = thunkAPI.getState() as { crmProductsForEntity: IState };
		const draftInfo = state.crmProductsForEntity.productsWithInfoForEntity;
		const draftProducts = (state.crmProductsForEntity.productsForEntity || []).filter((it) => !!it?.id && (!!it?.title || !!it?.product?.id));

		if (!draftProducts.length) {
			return {
				info: { ...draftInfo, entity_id: data.entityId, entity_type: data.entityType },
				list: [] as IProductForEntity[],
				entityId: data.entityId,
				entityType: data.entityType,
			};
		}

		try {
			const infoRes = await uspacySdk?.crmProductsForEntityService?.getInfoProductsForEntity(data.entityType, data.entityId);
			const productEntityInfo = infoRes?.data as IProductInfoForEntity;
			if (!productEntityInfo?.id) {
				return thunkAPI.rejectWithValue('Failure');
			}

			const preparedProducts = draftProducts.map((productIt) => ({
				title: productIt?.title,
				tax_rate: productIt?.tax_rate >= 0 ? productIt?.tax_rate : null,
				price: productIt?.price,
				is_tax_included: productIt?.is_tax_included || 0,
				quantity: productIt?.quantity,
				discount_value: productIt?.discount_value,
				discount_price: productIt?.discount_price || 0,
				discount_type: productIt?.discount_type,
				price_type_id: productIt?.price_type_id,
				currency: productIt?.currency,
				measurement_unit_abbr: productIt?.measurement_unit_abbr,
				amount: productIt?.amount,
				product_id: productIt?.product?.id || productIt?.product_id,
				entity_product_list_id: productEntityInfo?.id,
				product: productIt?.product,
			})) as unknown as IProductForEntity[];

			const createRes = await uspacySdk?.crmProductsForEntityService?.createProductsForEntity(preparedProducts);
			const createdProducts = (createRes?.data as unknown as { data: IProductForEntity[] })?.data;
			if (!createdProducts?.length) {
				return thunkAPI.rejectWithValue('Failure');
			}

			const updatedInfo: Partial<IProductInfoForEntity> = {
				...productEntityInfo,
				list_products: createdProducts,
				amount_before_discount_and_tax: data.totals.amountBeforeDiscountAndTax,
				amount_discount: data.totals.amountDiscount,
				amount_tax: data.totals.amountTax,
				amount_before_tax: data.totals.amountBeforeTax,
				amount_total: data.totals.amountTotal,
				is_automatic_calculation: Number(data.isAutomaticCalculation),
				entity_id: data.entityId,
				entity_type: data.entityType,
			};

			const patchRes = await uspacySdk?.crmProductsForEntityService?.updateInfoProductForEntity(productEntityInfo?.id, updatedInfo);

			return {
				info: (patchRes?.data as IProductInfoForEntity) || (updatedInfo as IProductInfoForEntity),
				list: createdProducts,
				entityId: data.entityId,
				entityType: data.entityType,
			};
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);
