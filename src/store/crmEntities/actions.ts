/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IEntityData, IEntityMainData } from '@uspacy/sdk/lib/models/crm-entities';
import { IEntityFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IFunnel } from '@uspacy/sdk/lib/models/crm-funnel';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { IReason, IReasonsCreate, IStage } from '@uspacy/sdk/lib/models/crm-stages';
import { IField } from '@uspacy/sdk/lib/models/field';

import { getFilterParams } from './../../helpers/filterFieldsArrs';
import { IMoveCardsData } from './types';

export const fetchEntities = createAsyncThunk('entities/fetchEntities', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.crmEntitiesService.getEntities();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const fetchEntitiesWithFunnels = createAsyncThunk('entities/fetchEntitiesWithFunnels', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.crmEntitiesService.getEntitiesWithFunnels();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createUniversalEntity = createAsyncThunk('entities/createUniversalEntity', async (data: Partial<IEntityMainData>, thunkAPI) => {
	try {
		const res = await uspacySdk.crmEntitiesService.createEntity(data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const deleteUniversalEntity = createAsyncThunk('entities/deleteEntity', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.crmEntitiesService.deleteEntity(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const editUniversalEntity = createAsyncThunk('entities/editEntity', async (data: IEntityMainData, thunkAPI) => {
	try {
		const res = await uspacySdk.crmEntitiesService.updateEntity(data?.id, data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const fetchUniversalFunnel = createAsyncThunk('entities/fetchUniversalFunnel', async (code: string, thunkAPI) => {
	try {
		const res = await uspacySdk.crmEntitiesService.getEntityFunnel(code);
		return { res: res?.data, code };
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const fetchFieldsForUniversalEntity = createAsyncThunk('entities/fetchFieldsForUniversalEntity', async (code: string, thunkAPI) => {
	try {
		const res = await uspacySdk.crmEntitiesService.getEntityFields(code);
		return { res: res?.data, code };
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateFieldForUniversalEntity = createAsyncThunk(
	'entities/updateFieldForUniversalEntity',
	async ({ data, entityCode }: { data: IField; entityCode: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.updateEntityField(entityCode, data);
			return { response: res?.data, entityCode };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const updateListValuesForUniversalEntity = createAsyncThunk(
	'entities/updateListValuesForUniversalEntity',
	async ({ data, entityCode }: { data: IField; entityCode: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.updateEntityListValues(entityCode, data);

			return { code: data?.code, values: res?.data, entityCode };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const createFieldForUniversalEntity = createAsyncThunk(
	'entities/createFieldForUniversalEntity',
	async ({ data, entityCode }: { data: IField; entityCode: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.createEntityField(entityCode, data);
			return { response: res?.data, entityCode };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteListValuesForUniversalEntity = createAsyncThunk(
	'entities/deleteListValuesForUniversalEntity',
	async ({ value, fieldCode, entityCode }: { fieldCode: string; value: string; entityCode: string }, thunkAPI) => {
		try {
			await uspacySdk.crmEntitiesService.deleteEntityListValues(entityCode, fieldCode, value);
			return { value, fieldCode, entityCode };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteFieldForUniversalEntity = createAsyncThunk(
	'entities/deleteLeadFieldForUniversalEntity',
	async ({ fieldCode, entityCode }: { fieldCode: string; entityCode }, thunkAPI) => {
		try {
			await uspacySdk.crmEntitiesService.deleteEntityField(entityCode, fieldCode);
			return { fieldCode, entityCode };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const createFunnelForUniversalEntity = createAsyncThunk(
	'entities/createFunnelForUniversalEntity',
	async ({ data, entityCode }: { data: Partial<IFunnel>; entityCode }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.createEntityFunnel(entityCode, data);
			return { response: res?.data, entityCode };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const editFunnelForUniversalEntity = createAsyncThunk(
	'entities/editFunnelForUniversalEntity',
	async ({ funnelData, entityCode }: { funnelData: Partial<IFunnel>; entityCode: string }, thunkAPI) => {
		const { id, ...data } = funnelData;
		try {
			const res = await uspacySdk.crmEntitiesService.updateEntityFunnel(entityCode, id, data);
			return { response: res?.data, entityCode };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteFunnelForUniversalEntity = createAsyncThunk(
	'entities/deleteFunnelForUniversalEntity',
	async ({ id, entityCode }: { id: number; entityCode: string }, thunkAPI) => {
		try {
			await uspacySdk.crmEntitiesService.deleteEntityFunnel(entityCode, id);
			return { id, entityCode };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const createStageForUniversalEntity = createAsyncThunk(
	'entities/createStageForUniversalEntity',
	async ({ data, entityCode }: { data: Partial<IStage>; entityCode: string }, thunkAPI) => {
		// eslint-disable-next-line camelcase
		const { funnel_id } = data;
		try {
			const res = await uspacySdk.crmEntitiesService.createEntityStage(entityCode, data);
			// eslint-disable-next-line camelcase
			return { response: res?.data, entityCode, funnel_id };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const editStageForUniversalEntity = createAsyncThunk(
	'entities/editStageForUniversalEntity',
	async ({ id, data, entityCode, funnelId }: { id: number; data: Partial<IStage>; entityCode: string; funnelId: number }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.updateEntityStage(entityCode, id, data);
			return { response: res?.data, funnelId, entityCode };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteStageForUniversalEntity = createAsyncThunk(
	'entities/deleteStageForUniversalEntity',
	async ({ id, entityCode }: { id: number; entityCode: string }, thunkAPI) => {
		try {
			await uspacySdk.crmEntitiesService.deleteEntityStage(entityCode, id);

			return { id, entityCode };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const fetchStagesForUniversalEntity = createAsyncThunk(
	'entities/fetchStagesForForUniversalEntity',
	async ({ funnelId, entityCode }: { funnelId: number; entityCode: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.getEntityStages(entityCode, funnelId);
			const resData = res?.data;
			return {
				response: {
					data: resData.data,
					funnelId,
				},
				funnelId,
				entityCode,
			};
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const createReasonsForUniversalEntity = createAsyncThunk(
	'entities/createReasonsForForUniversalEntity',
	async ({ reasonData, funnelId, entityCode }: { reasonData: IReasonsCreate; funnelId: number; entityCode: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.createEntityReason(funnelId, reasonData);
			return { response: res?.data, funnelId, entityCode };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const editReasonForUniversalEntity = createAsyncThunk(
	'entities/editReasonForUniversalEntity',
	async ({ reasonData, funnelId, entityCode }: { reasonData: IReason; funnelId: number; entityCode: string }, thunkAPI) => {
		const { id, ...data } = reasonData;
		try {
			const res = await uspacySdk.crmEntitiesService.updateEntityReason(id, data);
			return { response: res?.data, funnelId, entityCode };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const deleteReasonForUniversalEntity = createAsyncThunk('entities/deleteReasonForUniversalEntity', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.crmEntitiesService.deleteEntityReason(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const fetchEntityItemsForUniversalEntity = createAsyncThunk(
	'entitites/fetchEntityItemsForUniversalEntity',
	async (entityCode: string, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.getEntityItems(entityCode);
			return { res: res?.data, entityCode };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const fetchUniversalEntityItemsWithFilters = createAsyncThunk(
	'entitites/fetchUniversalEntityItemsWithFilters',
	async (
		{
			data,
		}: {
			data: {
				params: Omit<IEntityFilters, 'openDatePicker'>;
				signal: AbortSignal;
				fields: IField[];
				relatedEntityId?: string;
				relatedEntityType?: string;
			};
		},
		thunkAPI,
	) => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const filterParam = getFilterParams(data.params as any, data?.fields || []);
			const entityCode = data.params.entityCode;
			const signal = data.signal;

			const res = await uspacySdk.crmEntitiesService.getEntityItemsWithFilters(
				entityCode,
				filterParam,
				signal,
				data?.relatedEntityId,
				data?.relatedEntityType,
			);
			return { res: res?.data, entityCode, signal };
		} catch (e) {
			if (data.signal.aborted) {
				return {
					aborted: true,
				};
			} else {
				return thunkAPI.rejectWithValue(e);
			}
		}
	},
);

export const createUniversalEntityItem = createAsyncThunk(
	'entitites/createUniversalEntityItem',
	async ({ data, entityCode }: { data: Partial<IEntityData>; entityCode: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.createEntityItem(entityCode, data);
			return { response: res?.data, entityCode };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const updateUniversalEntityItem = createAsyncThunk(
	'entitites/updateUniversalEntityItem',
	async ({ data, entityCode }: { data: IEntityData; entityCode: string }, thunkAPI) => {
		try {
			const { id, ...rest } = data;
			const res = await uspacySdk.crmEntitiesService.updateEntityItem(entityCode, id, rest);

			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const deleteUniversalEntityItem = createAsyncThunk(
	'entitites/deleteUniversalEntityItem',
	async ({ id, entityCode }: { id: number; entityCode: string }, thunkAPI) => {
		try {
			await uspacySdk.crmEntitiesService.deleteEntityItem(entityCode, id);
			return { id, entityCode };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const massUniversalEntityItemsDeletion = createAsyncThunk(
	'entities/massUniversalEntityItemsDeletion',
	async ({ entityCode, entityIds, exceptIds, all, params }: IMassActions & { entityCode: string }, { rejectWithValue }) => {
		try {
			await uspacySdk.crmEntitiesService.massEntityItemsDeletion(entityCode, {
				all,
				entityIds,
				exceptIds,
				params: all && params?.length ? `/?${params}` : '',
			});

			return { entityCode, entityIds, exceptIds, all };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const massUniversalEntityItemsEditing = createAsyncThunk(
	'entities/massUniversalEntityItemsEditing',
	async (
		{ entityIds, exceptIds, all, params, payload, settings, profile, admin, entityCode }: IMassActions & { entityCode: string },
		{ rejectWithValue },
	) => {
		try {
			await uspacySdk.crmEntitiesService.massEntityItemsEditing(entityCode, {
				all,
				entityIds,
				exceptIds,
				params: all && params?.length ? `/?${params}` : '',
				payload,
				settings,
			});

			return { entityCode, entityIds, exceptIds, all, params, payload, settings, profile, admin };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const moveUniversalItemFromStageToStage = createAsyncThunk(
	'stages/moveUniversalItemFromStageToStage',
	async (
		{
			entityId,
			stageId,
			// eslint-disable-next-line camelcase
			reason_id,
			funnelHasChanged,
			entityCode,
			isFinishedStage,
			profileId,
		}: IMoveCardsData,
		thunkAPI,
	) => {
		try {
			await uspacySdk.crmEntitiesService.moveEntityItemFromStageToStage(entityCode, entityId, stageId, reason_id);

			return { entityId: entityId, stageId: stageId, funnelHasChanged: funnelHasChanged, entityCode, isFinishedStage, profileId };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const createUniversalEntityItemFromKanban = createAsyncThunk(
	'deals/createUniversalEntityItemFromKanban',
	async ({ data, entityCode }: { data: Partial<IEntityData>; entityCode: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.createEntityItemFromKanban(entityCode, data);
			return { response: res?.data, entityCode };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);
