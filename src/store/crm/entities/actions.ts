/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IEntityMainData } from '@uspacy/sdk/lib/models/crm-entities';

export const fetchEntities = createAsyncThunk('crm/entities/fetchEntities', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.crmEntitiesService.getEntities();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const fetchEntitiesWithFunnels = createAsyncThunk('crm/entities/fetchEntitiesWithFunnels', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.crmEntitiesService.getEntitiesWithFunnels();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createEntity = createAsyncThunk('crm/entities/createEntity', async (data: Partial<IEntityMainData>, thunkAPI) => {
	try {
		const res = await uspacySdk.crmEntitiesService.createEntity(data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const deleteEntity = createAsyncThunk('crm/entities/deleteEntity', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.crmEntitiesService.deleteEntity(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateEntity = createAsyncThunk('crm/entities/updateEntity', async (data: Partial<IEntityMainData>, thunkAPI) => {
	try {
		const res = await uspacySdk.crmEntitiesService.updateEntity(data?.id, data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
