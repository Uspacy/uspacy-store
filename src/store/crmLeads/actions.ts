/* eslint-disable camelcase */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { ILeadFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { IField } from '@uspacy/sdk/lib/models/field';

export const fetchLeadsWithFilters = createAsyncThunk(
	'leads/fetchLeadsWithFilters',
	async (
		data: { params: Omit<ILeadFilters, 'openDatePicker'>; signal: AbortSignal; relatedEntityId?: string; relatedEntityType?: string },
		thunkAPI,
	) => {
		try {
			const params = {
				page: data.params.page,
				list: data.params.perPage,
				q: data.params.search,
				stages: data.params.stages,
				source: data.params.source,
				created_at: data.params.period,
				kanban_status: data.params.kanban_status,
				owner: data.params.owner,
				table_fields: data.params.table_fields,
			};

			const res = await uspacySdk.crmLeadsService.getLeadsWithFilters(params, data?.signal, data?.relatedEntityId, data?.relatedEntityType);
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

export const fetchLeadsByStages = createAsyncThunk('leads/fetchLeadsByStages', async (id: number, thunkAPI) => {
	try {
		const res = await uspacySdk.crmLeadsService.getLeadsByStage(id);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createLead = createAsyncThunk('leads/createLead', async (data: Partial<IEntityData>, thunkAPI) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, ...rest } = data;
		const res = await uspacySdk.crmLeadsService.createLead(rest);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createLeadFromKanban = createAsyncThunk(
	'leads/createLeadFromKanban',
	async ({ data, dontRenderInKanban }: { data: Partial<IEntityData>; dontRenderInKanban?: boolean }, thunkAPI) => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, ...rest } = data;
			const res = await uspacySdk.crmLeadsService.createLead(rest);
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

export const updateLead = createAsyncThunk('leads/updateLead', async (data: IEntityData, thunkAPI) => {
	try {
		const { id, ...rest } = data;
		const res = await uspacySdk.crmLeadsService.updateLead(id, rest);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const deleteLead = createAsyncThunk('leads/deleteLead', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.crmLeadsService.deleteLead(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const massLeadsDeletion = createAsyncThunk(
	'leads/massDeletion',
	async ({ entityIds, exceptIds, all, params }: IMassActions, { rejectWithValue }) => {
		try {
			await uspacySdk.crmLeadsService.massLeadsDeletion({
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

export const massLeadsEditing = createAsyncThunk(
	'leads/massEditing',
	async ({ entityIds, exceptIds, all, params, payload, settings, profile, admin }: IMassActions, { rejectWithValue }) => {
		try {
			await uspacySdk.crmLeadsService.massLeadsEditing({
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

export const fetchFieldsForLead = createAsyncThunk('leads/fetchFieldsForLead', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.crmLeadsService.getLeadFields();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateLeadField = createAsyncThunk('leads/updateLeadField', async (data: IField, thunkAPI) => {
	try {
		const res = await uspacySdk.crmLeadsService.updateLeadField(data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateLeadListValues = createAsyncThunk('leads/updateLeadListValues', async (data: IField, thunkAPI) => {
	try {
		const res = await uspacySdk.crmLeadsService.updateLeadListValues(data);
		return { ...data, values: res?.data };
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createLeadField = createAsyncThunk('leads/createLeadField', async (data: IField, thunkAPI) => {
	try {
		const res = await uspacySdk.crmLeadsService.createLeadField(data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteLeadListValues = createAsyncThunk(
	'leads/deleteLeadListValues',
	async ({ value, fieldCode }: { value: string; fieldCode: string }, thunkAPI) => {
		try {
			await uspacySdk.crmLeadsService.deleteLeadListValues(value, fieldCode);
			return { value, fieldCode };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteLeadField = createAsyncThunk('leads/deleteLeadField', async (code: string, thunkAPI) => {
	try {
		await uspacySdk.crmLeadsService.deleteLeadField(code);
		return code;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
export const moveLeadFromStageToStage = createAsyncThunk(
	'stages/moveLeadFromStageToStage',
	// eslint-disable-next-line camelcase
	async ({ entityId, stageId, reason_id }: { entityId: number; stageId: number; reason_id: number | null }, thunkAPI) => {
		try {
			await uspacySdk.crmLeadsService.moveLeadFromStageToStage(entityId, stageId, reason_id);
			return { entityId, stageId };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);
