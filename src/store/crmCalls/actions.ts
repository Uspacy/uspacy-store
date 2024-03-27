import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ICall } from '@uspacy/sdk/lib/models/crm-calls';
import { ICallFilters } from '@uspacy/sdk/lib/models/crm-filters';

export const fetchCalls = createAsyncThunk('calls/fetchCalls', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.crmCallsService.getCalls();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const fetchCallsWithFilters = createAsyncThunk('calls/fetchCallsWithFilters', async (data: Omit<ICallFilters, 'openDatePicker'>, thunkAPI) => {
	const params = {
		page: data.page,
		list: data.perPage,
		status: data.status,
		type: data.type,
		responsible_id: data.responsible_id,
		start_time: data.period,
		...(data.search ? { q: data.search } : {}),
	};
	try {
		const res = await uspacySdk.crmCallsService.getCallsWithFilters(params);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createCall = createAsyncThunk('calls/createCall', async (data: ICall, thunkAPI) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, ...rest } = data;
		const res = await uspacySdk.crmCallsService.createCall(rest);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const editCall = createAsyncThunk('calls/editCall', async ({ id, data }: { id: number; data: Partial<ICall> }, thunkAPI) => {
	try {
		const res = await uspacySdk.crmCallsService.editCall(id, data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const fetchCall = createAsyncThunk('calls/fetchCall', async (id: string, thunkAPI) => {
	try {
		const res = await uspacySdk.crmCallsService.getCall(id);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure!');
	}
});

export const deleteCall = createAsyncThunk('calls/deleteCall', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.crmCallsService.deleteCall(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
