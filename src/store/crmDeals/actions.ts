/* eslint-disable camelcase */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { IDealFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { IField } from '@uspacy/sdk/lib/models/field';

import { IMoveCardsData } from './types';

export const fetchDeals = createAsyncThunk('deals/fetchDeals', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmDealsService?.getDeals();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const fetchDealsWithFilters = createAsyncThunk(
	'deals/fetchDealsWithFilters',
	async (
		data: { params: Omit<IDealFilters, 'openDatePicker'>; signal: AbortSignal; relatedEntityId?: string; relatedEntityType?: string },
		thunkAPI,
	) => {
		try {
			const tasksArray = Array.isArray(data.params.tasks) ? data.params.tasks : [data.params.tasks];
			// @ts-ignore
			const noTasks = tasksArray.includes(0);
			// @ts-ignore
			const tasks = tasksArray.filter((el) => el !== 0);
			const params = {
				...(data.params.search ? { q: data.params.search } : {}),
				stages: data.params.stages,
				created_at: data.params.period,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				tasks: noTasks ? (' ' as any) : tasks,
				kanban_status: data.params.kanban_status,
				owner: data.params.owner,
				page: data.params.page,
				list: data.params.perPage,
				funnel_id: data.params.select,
				table_fields: data.params.table_fields,
			};

			const res = await uspacySdk.crmDealsService.getDealsWithFilters(params, data?.signal, data?.relatedEntityId, data?.relatedEntityType);
			return res?.data;
		} catch (e) {
			if (data.signal.aborted) {
				return {
					aborted: true,
				};
			} else {
				return thunkAPI.rejectWithValue('Failure');
			}
		}
	},
);

export const createDeal = createAsyncThunk('deals/createDeal', async (data: Partial<IEntityData>, thunkAPI) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, ...rest } = data;
		const res = await uspacySdk.crmDealsService.createDeal(rest);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createDealFromKanban = createAsyncThunk(
	'deals/createDeal',
	async ({ data, dontRenderInKanban }: { data: Partial<IEntityData>; dontRenderInKanban?: boolean }, thunkAPI) => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, ...rest } = data;
			const res = await uspacySdk.crmDealsService.createDeal(rest);
			return {
				data: res?.data,
				dontRenderInKanban,
			};
			// eslint-disable-next-line prettier/prettier, @typescript-eslint/no-explicit-any
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const updateDeal = createAsyncThunk('deals/updateDeal', async (data: IEntityData, thunkAPI) => {
	try {
		const { id, ...rest } = data;
		const res = await uspacySdk.crmDealsService.updateDeal(id, rest);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const deleteDeal = createAsyncThunk('deals/deleteDeal', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.crmDealsService.deleteDeal(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const massDealsDeletion = createAsyncThunk(
	'deals/massDeletion',
	async ({ entityIds, exceptIds, all, params }: IMassActions, { rejectWithValue }) => {
		try {
			await uspacySdk.crmDealsService.massDealsDeletion({
				all,
				entityIds,
				exceptIds,
				params: all && params?.length ? `/?${params}` : '',
			});

			return { entityIds, exceptIds, all };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const massDealsEditing = createAsyncThunk(
	'deals/massEditing',
	async ({ entityIds, exceptIds, all, params, payload, settings, profile, admin }: IMassActions, { rejectWithValue }) => {
		try {
			await uspacySdk.crmDealsService.massDealsEditing({
				all,
				entityIds,
				exceptIds,
				params: all && params?.length ? `/?${params}` : '',
				payload,
				settings,
			});

			return { entityIds, exceptIds, all, params, payload, settings, profile, admin };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const fetchFieldsForDeal = createAsyncThunk('deals/fetchFieldsForDeal', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.crmDealsService.getDealFields();
		const resData = res?.data;
		const formattedRes = {
			...resData,
			data: resData?.data?.map((el) => {
				if (el?.code === 'companies') {
					return { ...el, name: 'company' };
				}
				return el;
			}),
		};
		return formattedRes;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateDealField = createAsyncThunk('deals/updateDealField', async (data: IField, thunkAPI) => {
	try {
		const res = await uspacySdk.crmDealsService.updateDealField(data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateDealListValues = createAsyncThunk('deals/updateDealListValues', async (data: IField, thunkAPI) => {
	try {
		const res = await uspacySdk.crmDealsService.updateDealListValues(data);
		return { ...data, values: res?.data };
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createDealField = createAsyncThunk('deals/createDealField', async (data: IField, thunkAPI) => {
	try {
		const res = await uspacySdk.crmDealsService.createDealField(data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteDealListValues = createAsyncThunk(
	'deals/deleteLeadListValues',
	async ({ value, fieldCode }: { value: string; fieldCode: string }, thunkAPI) => {
		try {
			await uspacySdk.crmDealsService.deleteDealListValues(value, fieldCode);
			return { value, fieldCode };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteDealField = createAsyncThunk('deals/deleteDealField', async (code: string, thunkAPI) => {
	try {
		await uspacySdk.crmDealsService.deleteDealField(code);
		return code;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const moveDealFromStageToStage = createAsyncThunk(
	'stages/moveLeadFromStageToStage',
	// eslint-disable-next-line camelcase
	async ({ entityId, stageId, reason_id, funnelHasChanged, isFinishedStage, profileId }: IMoveCardsData, thunkAPI) => {
		try {
			await uspacySdk.crmDealsService.moveDealFromStageToStage(entityId, stageId, reason_id);
			return { entityId, stageId, funnelHasChanged, isFinishedStage, profileId };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);
