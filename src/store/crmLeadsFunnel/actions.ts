import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IFunnel } from '@uspacy/sdk/lib/models/crm-funnel';
import { IReason, IReasonsCreate, IStage } from '@uspacy/sdk/lib/models/crm-stages';

export const fetchLeadsFunnel = createAsyncThunk('leadsFunnel/fetchLeadsFunnel', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmLeadsFunnelsService?.getLeadsFunnels();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createLeadsFunnel = createAsyncThunk('leadsFunnel/createLeadsFunnel', async (data: Partial<IFunnel>, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmLeadsFunnelsService?.createLeadsFunnel(data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const editLeadsFunnel = createAsyncThunk('leadsFunnel/editLeadsFunnel', async (funnelData: Partial<IFunnel>, thunkAPI) => {
	const { id, ...data } = funnelData;
	try {
		const res = await uspacySdk?.crmLeadsFunnelsService?.updateLeadsFunnel(id, data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteLeadsFunnel = createAsyncThunk('leadsFunnel/deleteLeadsFunnel', async (id: number, thunkAPI) => {
	try {
		await uspacySdk?.crmLeadsFunnelsService?.deleteLeadsFunnel(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createStageForLeadsFunnel = createAsyncThunk('leadsFunnel/createStageForLeadsFunnel', async (data: Partial<IStage>, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmLeadsFunnelsService?.createStageForLeadsFunnel(data);
		const resData = res.data;

		return { ...resData, funnel_id: data.funnel_id };
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const editStageForLeadsFunnel = createAsyncThunk(
	'leadsFunnel/editStageForLeadsFunnel',
	async ({ id, data }: { id: number; data: Partial<IStage> }, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmLeadsFunnelsService?.updateStageForLeadsFunnel(id, data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteStageForLeadsFunnel = createAsyncThunk('leadsFunnel/deleteStageForLeadsFunnel', async (id: number, thunkAPI) => {
	try {
		await uspacySdk?.crmLeadsFunnelsService?.deleteStageForLeadsFunnel(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createReasonsForLeadsFunnelStage = createAsyncThunk(
	'leadsFunnel/createReasonsForLeadsFunnelStage',
	async (reasonData: IReasonsCreate, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmLeadsFunnelsService?.createReasonsForLeadsFunnelStage(reasonData);
			const resData = res.data;
			return { ...resData, funnel_id: reasonData.funnelId };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const editReasonsForLeadsFunnelStage = createAsyncThunk('leadsFunnel/editReasonForLeadsStage', async (reasonData: IReason, thunkAPI) => {
	const { id, ...data } = reasonData;
	try {
		const res = await uspacySdk?.crmLeadsFunnelsService?.updateReasonsForLeadsFunnelStage(id, data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteReasonsForLeadsFunnelStage = createAsyncThunk('leadsFunnel/deleteReasonsForLeadsFunnelStage', async (id: number, thunkAPI) => {
	try {
		await uspacySdk?.crmLeadsFunnelsService?.deleteReasonsForLeadsFunnelStage(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
