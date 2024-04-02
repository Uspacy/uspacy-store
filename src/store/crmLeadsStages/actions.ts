import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IReason, IReasonsCreate, IStage } from '@uspacy/sdk/lib/models/crm-stages';

import { EntityIds } from './../../const';

export const fetchLeadsStages = createAsyncThunk('stages/fetchLeadsStages', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmLeadsStagesService?.getLeadsStages();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createLeadsStage = createAsyncThunk('leads/createLeadsStage', async (data: Partial<IStage>, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmLeadsStagesService?.createLeadsStage(data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const editLeadsStage = createAsyncThunk('tasks/editLeadsStage', async ({ id, data }: { id: number; data: Partial<IStage> }, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmLeadsStagesService?.updateLeadsStage(id, data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteLeadsStage = createAsyncThunk('stages/deleteLeadsStage', async (id: number, thunkAPI) => {
	try {
		await uspacySdk?.crmLeadsStagesService?.deleteLeadsStage(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const fetchReasonsForLead = createAsyncThunk('leads/fetchReasonsForLeads', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmLeadsStagesService?.getLeadsReasons(Number(EntityIds.leads));
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createReasonsForLeadsStage = createAsyncThunk('stages/createReasonsForLeadsStage', async (reasonData: IReasonsCreate, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmLeadsStagesService?.createLeadsStageReasons(Number(EntityIds.leads), reasonData);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const editReasonForLeadsStage = createAsyncThunk('stages/editReasonForLeadsStage', async (reasonData: IReason, thunkAPI) => {
	const { id, ...data } = reasonData;
	try {
		const res = await uspacySdk?.crmLeadsStagesService?.updateLeadsReason(id, data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteReasonsForLeadsStage = createAsyncThunk('stages/deleteReasonsForLeadsStage', async (id: number, thunkAPI) => {
	try {
		await uspacySdk?.crmLeadsStagesService?.deleteLeadsReason(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
