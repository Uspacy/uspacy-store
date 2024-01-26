import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IReason, IReasonsCreate, IStage } from '@uspacy/sdk/lib/models/crm-stages';

import { EntityIds } from './../../const';

export const fetchDealsStages = createAsyncThunk('tasks/fetchDealsStages', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmDealsStagesService?.getDealsStages();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createDealsStage = createAsyncThunk('deals/createDealsStage', async (data: Partial<IStage>, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmDealsStagesService?.createDealsStage(data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const editDealsStage = createAsyncThunk('tasks/editDealsStage', async ({ id, data }: { id: number; data: Partial<IStage> }, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmDealsStagesService?.updateDealsStage(id, data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteDealsStage = createAsyncThunk('stages/deleteDealsStage', async (id: number, thunkAPI) => {
	try {
		await uspacySdk?.crmDealsStagesService?.deleteDealsStage(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const fetchReasonsForDeals = createAsyncThunk('leads/fetchReasonsForDeals', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmDealsStagesService?.getDealsReasons(Number(EntityIds.deals));
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createReasonsForDealsStage = createAsyncThunk('stages/createReasonsForDealsStage', async (reasonData: IReasonsCreate, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmDealsStagesService?.createDealsStageReasons(Number(EntityIds.deals), reasonData);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const editReasonForDealsStage = createAsyncThunk('stages/editReasonForDealsStage', async (reasonData: IReason, thunkAPI) => {
	const { id, ...data } = reasonData;
	try {
		const res = await uspacySdk?.crmDealsStagesService?.updateDealsReason(id, data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteReasonsForDealsStage = createAsyncThunk('stages/deleteReasonsForDealsStage', async (id: number, thunkAPI) => {
	try {
		await uspacySdk?.crmDealsStagesService?.deleteDealsReason(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
