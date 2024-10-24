import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IFunnel } from '@uspacy/sdk/lib/models/crm-funnel';
import { IReason, IReasonsCreate, IStage } from '@uspacy/sdk/lib/models/crm-stages';

export const fetchFunnels = createAsyncThunk('crm/funnels/fetchFunnels', async (code: string, thunkAPI) => {
	try {
		const res = await uspacySdk.crmEntitiesService.getEntityFunnel(code);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const fetchStages = createAsyncThunk(
	'crm/stage/fetchStages',
	async ({ entityCode, funnelId }: { entityCode: string; funnelId?: number }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.getEntityStages(entityCode, funnelId);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const createFunnel = createAsyncThunk(
	'crm/funnels/createFunnel',
	async ({ data, entityCode }: { data: Partial<IFunnel>; entityCode: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.createEntityFunnel(entityCode, data);
			return res?.data as IFunnel;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const updateFunnel = createAsyncThunk(
	'crm/funnels/updateFunnel',
	async ({ data: funnelData, entityCode }: { data: Partial<IFunnel>; entityCode: string }, thunkAPI) => {
		const { id, ...data } = funnelData;
		try {
			const res = await uspacySdk.crmEntitiesService.updateEntityFunnel(entityCode, id, data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteFunnel = createAsyncThunk('crm/funnels/deleteFunnel', async ({ id, entityCode }: { id: number; entityCode: string }, thunkAPI) => {
	try {
		return await uspacySdk.crmEntitiesService.deleteEntityFunnel(entityCode, id);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createStage = createAsyncThunk(
	'crm/funnels/createStage',
	async ({ data, entityCode }: { data: Partial<IStage>; entityCode: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.createEntityStage(entityCode, data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const updateStage = createAsyncThunk(
	'crm/funnels/updateStage',
	async ({ data, entityCode }: { data: Partial<IStage>; entityCode: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.updateEntityStage(entityCode, data.id, data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteStage = createAsyncThunk(
	'crm/funnels/deleteStage',
	async ({ id, entityCode }: { id: number; entityCode: string; funnelId: number }, thunkAPI) => {
		try {
			return await uspacySdk.crmEntitiesService.deleteEntityStage(entityCode, id);
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const createReason = createAsyncThunk('crm/funnels/createReason', async ({ data }: { data: IReasonsCreate; entityCode: string }, thunkAPI) => {
	try {
		const res = await uspacySdk.crmEntitiesService.createEntityReason(data.funnelId, data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateReason = createAsyncThunk(
	'crm/funnels/editReason',
	async ({ data }: { data: IReason; funnelId: number; entityCode: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.updateEntityReason(data.id, data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteReason = createAsyncThunk(
	'crm/funnels/deleteReason',
	async ({ id }: { id: number; funnelId: number; entityCode: string }, thunkAPI) => {
		try {
			return await uspacySdk.crmEntitiesService.deleteEntityReason(id);
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);
