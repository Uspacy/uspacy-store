/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { ICallFilters, IEntityFilters, IFilter, IFilterCurrenciesAmount } from '@uspacy/sdk/lib/models/crm-filters';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { IProduct } from '@uspacy/sdk/lib/models/crm-products';
import { IField } from '@uspacy/sdk/lib/models/field';
import { IMoveCardsData } from 'src/store/crmEntities/types';

import { getDealsParams, getFilterParams } from '../../../helpers/filterFieldsArrs';
import { normalizeCategories, normalizeProduct, normalizeProductForView } from '../../../helpers/normalizeProduct';

export const fetchEntityItems = createAsyncThunk(
	'crm/items/fetchEntityItems',
	async (
		{
			fields,
			filters,
			entityCode,
			signal,
			parentEntityId,
			parentEntityCode,
		}: {
			filters: Omit<IEntityFilters, 'openDatePicker'>;
			entityCode: string;
			fields: IField[];
			signal?: AbortSignal;
			parentEntityId?: number;
			parentEntityCode?: string;
		},
		thunkAPI,
	) => {
		try {
			const params = getFilterParams(filters, fields || []) as { [key: string]: any };
			switch (entityCode) {
				case 'calls': {
					const {
						responsible_id: responsibleId,
						duration_by: durationBy,
						duration_from: durationFrom,
						duration_to: durationTo,
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						boolean_operator: booleanOperator,
						...otherParams
					} = params;
					const filter = {
						...otherParams,
						...(responsibleId && { owner: responsibleId }),
						...((!!durationFrom || !!durationTo) && { duration_by: durationBy, duration_to: durationTo, duration_from: durationFrom }),
					} as ICallFilters;
					const res = await uspacySdk.crmCallsService.getCallsWithFilters(filter);
					return res?.data;
				}
				case 'products': {
					const productCategoryIds = normalizeCategories(filters.select);
					const withoutCategories = productCategoryIds === null;
					const newParams = {
						...params,
						product_category_ids: withoutCategories ? ' ' : normalizeCategories(filters.select),
					};
					const res = await uspacySdk.crmProductsService.getProductsWithFilters(newParams as IFilter);
					return res?.data;
				}
				case 'tasks':
				case 'activities': {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
					const { table_fields: tableFields, ...rest } = params as any;
					const res = await uspacySdk.crmTasksService.getTasksWithFilters(rest);
					return res?.data;
				}
				case 'deals': {
					const dealsParams = getDealsParams(filters, params);

					const res = await uspacySdk.crmEntitiesService.getEntityItemsWithFilters(
						entityCode,
						dealsParams,
						signal,
						String(parentEntityId),
						parentEntityCode,
					);
					return res?.data;
				}
				default: {
					const res = await uspacySdk.crmEntitiesService.getEntityItemsWithFilters(
						entityCode,
						params,
						signal,
						String(parentEntityId),
						parentEntityCode,
					);
					return res?.data;
				}
			}
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const moveItemFromStageToStage = createAsyncThunk(
	'crm/items/moveItemFromStageToStage',
	async ({ entityId, stageId, reason_id: reasonId, entityCode }: IMoveCardsData, thunkAPI) => {
		try {
			return await uspacySdk.crmEntitiesService.moveEntityItemFromStageToStage(entityCode, entityId, stageId, reasonId);
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const createEntityItem = createAsyncThunk(
	'crm/items/createEntityItem',
	async ({ data, entityCode, stageId }: { data: Partial<IEntityData>; entityCode: string; stageId?: number }, thunkAPI) => {
		try {
			switch (entityCode) {
				case 'products': {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { id, ...rest } = data as IProduct;
					const res = await uspacySdk?.crmProductsService?.createProduct(normalizeProduct(rest));
					const resData = res?.data;
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					return normalizeProductForView(resData as any);
				}
				case 'activities':
				case 'tasks': {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { id, ...rest } = data;
					const res = await uspacySdk.crmTasksService.createTask(rest);
					return res?.data;
				}
				default: {
					const res = await uspacySdk.crmEntitiesService.createEntityItem(entityCode, {
						...data,
						kanban_stage_id: data.kanban_stage_id || stageId,
					});
					return res?.data;
				}
			}
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const updateEntityItem = createAsyncThunk(
	'crm/items/updateEntityItem',
	async ({ data, entityCode }: { data: IEntityData; entityCode: string; stageId?: number }, thunkAPI) => {
		try {
			switch (entityCode) {
				case 'products': {
					const { id, ...rest } = data as IProduct;
					const res = await uspacySdk?.crmProductsService?.updateProduct(id, normalizeProduct(rest));
					const resData = res?.data;
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					return normalizeProductForView(resData as any);
				}
				case 'activities':
				case 'tasks': {
					const res = await uspacySdk.crmTasksService.updateTask(data.id, data);
					return res?.data;
				}
				default: {
					const { id, ...rest } = data;
					const res = await uspacySdk.crmEntitiesService.updateEntityItem(entityCode, id, rest);
					return res?.data;
				}
			}
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const deleteEntityItem = createAsyncThunk(
	'crm/items/deleteEntityItem',
	async ({ id, entityCode }: { id: number; entityCode: string; stageId?: number }, thunkAPI) => {
		try {
			switch (entityCode) {
				case 'products': {
					return await uspacySdk?.crmProductsService?.deleteProduct(id);
				}
				case 'activities':
				case 'tasks': {
					return await uspacySdk.crmTasksService.deleteTask(id);
				}
				default: {
					return await uspacySdk.crmEntitiesService.deleteEntityItem(entityCode, id);
				}
			}
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const massItemsEditing = createAsyncThunk(
	'crm/items/massItemsEditing',
	async (
		{ entityIds, exceptIds, all, params, payload, settings, entityCode }: IMassActions & { entityCode: string; stageId?: number },
		{ rejectWithValue },
	) => {
		try {
			switch (entityCode) {
				case 'activities':
				case 'tasks': {
					if (payload?.status === 'planned') {
						return await uspacySdk.crmTasksService.massTasksReopen({
							all,
							entityIds,
							exceptIds,
							params: all && params?.length ? params : undefined,
						});
					}
					return await uspacySdk.crmTasksService.massTasksEditing({
						all,
						entityIds,
						exceptIds,
						params: all && params?.length ? params : undefined,
						payload,
						settings,
					});
				}
				default: {
					return await uspacySdk.crmEntitiesService.massEntityItemsEditing(entityCode, {
						all,
						entityIds,
						exceptIds,
						params: all && params?.length ? params : undefined,
						payload,
						settings,
					});
				}
			}
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const massItemsDeletion = createAsyncThunk(
	'crm/items/massItemsDeletion',
	async ({ entityCode, entityIds, exceptIds, all, params }: IMassActions & { entityCode: string; stageId?: number }, { rejectWithValue }) => {
		try {
			switch (entityCode) {
				case 'activities':
				case 'tasks': {
					return await uspacySdk.crmTasksService.massTasksDeletion({
						all,
						entityIds,
						exceptIds,
						params: all && params?.length ? params : undefined,
					});
				}
				case 'products': {
					return await uspacySdk.crmProductsService.massProductsDeletion({
						all,
						entityIds,
						exceptIds,
						params: all && params?.length ? params : undefined,
					});
				}
				default: {
					return await uspacySdk.crmEntitiesService.massEntityItemsDeletion(entityCode, {
						all,
						entityIds,
						exceptIds,
						params: all && params?.length ? params : undefined,
					});
				}
			}
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const fetchEntityItemsByStage = createAsyncThunk(
	'crm/items/fetchEntityItemsByStage',
	async (
		{
			fields,
			filters,
			entityCode,
			stageId,
		}: {
			filters: Omit<IEntityFilters, 'openDatePicker'>;
			entityCode: string;
			fields: IField[];
			stageId: string;
		},
		thunkAPI,
	) => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, camelcase
			const { table_fields, ...filtersParams } = filters as any;
			const params = getFilterParams(filtersParams as IEntityFilters, fields || []);
			switch (entityCode) {
				case 'activities':
				case 'tasks': {
					const res = await uspacySdk.crmTasksService.getTasksWithFilters(params);
					return res?.data;
				}
				case 'deals': {
					const dealsParams = getDealsParams(filters, getFilterParams(filters, fields || []));

					const res = await uspacySdk.crmEntitiesService.getEntityItemsByStage(entityCode, dealsParams, stageId);
					return res?.data;
				}
				default: {
					const res = await uspacySdk.crmEntitiesService.getEntityItemsByStage(entityCode, getFilterParams(filters, fields || []), stageId);
					return res?.data;
				}
			}
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const getEntitiesCurrenciesAmount = createAsyncThunk(
	'deals/getEntitiesCurrenciesAmount',
	async (
		{
			filters,
			currenciesParams,
			fields,
			entityCode,
			stageId,
		}: {
			filters: Omit<IEntityFilters, 'openDatePicker'>;
			currenciesParams: IFilterCurrenciesAmount;
			fields: IField[];
			entityCode: string;
			stageId: number;
		},
		thunkAPI,
	) => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars, camelcase
			const { table_fields, ...filtersParams } = filters;
			const params = getFilterParams(filtersParams as IEntityFilters, fields || []) as IFilterCurrenciesAmount;

			const getParams = () => {
				if (entityCode === 'deals') return getDealsParams(filters, params) as IFilterCurrenciesAmount;
				return params;
			};

			const res = await uspacySdk.crmEntitiesService.getEntitiesCurrenciesAmount(
				{ filter: { ...getParams() }, ...currenciesParams },
				entityCode,
				stageId,
			);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const uploadEntityItemAvatar = createAsyncThunk(
	'crm/items/uploadEntityItemAvatar',
	async ({ file, entityCode, id }: { file: File | null; entityCode: string; id: number }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.uploadAvatar({ file, code: entityCode, id });
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);
