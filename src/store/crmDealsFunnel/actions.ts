import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IFunnel } from '@uspacy/sdk/lib/models/crm-funnel';
import { IReason, IReasonsCreate, IStage } from '@uspacy/sdk/lib/models/crm-stages';

export const fetchDealsFunnel = createAsyncThunk('dealsFunnel/fetchDealsFunnel', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmDealsFunnelsService?.getDealsFunnels();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createDealsFunnel = createAsyncThunk('dealsFunnel/createDealsFunnel', async (data: Partial<IFunnel>, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmDealsFunnelsService?.createDealsFunnel(data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const editDealsFunnel = createAsyncThunk('dealsFunnel/editDealsFunnel', async (funnelData: Partial<IFunnel>, thunkAPI) => {
	const { id, ...data } = funnelData;
	try {
		const res = await uspacySdk?.crmDealsFunnelsService?.updateDealsFunnel(id, data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteDealsFunnel = createAsyncThunk('dealsFunnel/deleteDealsFunnel', async (id: number, thunkAPI) => {
	try {
		await uspacySdk?.crmDealsFunnelsService?.deleteDealsFunnel(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createStageForDealsFunnel = createAsyncThunk('dealsFunnel/createStageForDealsFunnel', async (data: Partial<IStage>, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmDealsFunnelsService?.createStageForDealsFunnel(data);
		const resData = res.data;

		return { ...resData, funnel_id: data.funnel_id };
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const editStageForDealsFunnel = createAsyncThunk(
	'dealsFunnel/editStageForDealsFunnel',
	async ({ id, data }: { id: number; data: Partial<IStage> }, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmDealsFunnelsService?.updateStageForDealsFunnel(id, data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteStageForDealsFunnel = createAsyncThunk('dealsFunnel/deleteStageForDealsFunnel', async (id: number, thunkAPI) => {
	try {
		await uspacySdk?.crmDealsFunnelsService?.deleteStageForDealsFunnel(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createReasonsForDealsFunnelStage = createAsyncThunk(
	'dealsFunnel/createReasonsForDealsFunnelStage',
	async (reasonData: IReasonsCreate, thunkAPI) => {
		try {
			const res = await uspacySdk?.crmDealsFunnelsService?.createReasonsForDealsFunnelStage(reasonData);
			const resData = res.data;
			return { ...resData, funnel_id: reasonData.funnelId };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const editReasonsForDealsFunnelStage = createAsyncThunk(
	'dealsFunnel/editReasonsForDealsFunnelStage',
	async (reasonData: IReason, thunkAPI) => {
		const { id, ...data } = reasonData;
		try {
			const res = await uspacySdk?.crmDealsFunnelsService?.updateReasonsForDealsFunnelStage(id, data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteReasonsForDealsFunnelStage = createAsyncThunk('dealsFunnel/deleteReasonsForDealsFunnelStage', async (id: number, thunkAPI) => {
	try {
		await uspacySdk?.crmDealsFunnelsService?.deleteReasonsForDealsFunnelStage(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const fetchStagesForDealsFunnel = createAsyncThunk('dealsFunnel/fetchStagesForDealsFunnel', async (funnelId: number, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmDealsFunnelsService?.getStagesForDealsFunnel(funnelId);
		const resData = res?.data;

		return {
			data: resData.data,
			funnelId,
		};
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
