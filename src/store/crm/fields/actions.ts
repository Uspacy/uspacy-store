/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IField } from '@uspacy/sdk/lib/models/field';

export const fetchFields = createAsyncThunk('crm/fields/fetchFields', async (code: string, thunkAPI) => {
	try {
		const res = await uspacySdk.crmEntitiesService.getEntityFields(code);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createField = createAsyncThunk(
	'crm/fields/createField',
	async ({ data, entityCode }: { data: Partial<IField>; entityCode: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.createEntityField(entityCode, data);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteField = createAsyncThunk(
	'crm/fields/deleteField',
	async ({ fieldCode, entityCode }: { fieldCode: string; entityCode }, thunkAPI) => {
		try {
			return await uspacySdk.crmEntitiesService.deleteEntityField(entityCode, fieldCode);
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const updateField = createAsyncThunk(
	'crm/fields/updateField',
	async ({ data, entityCode }: { data: Partial<IField>; entityCode: string }, thunkAPI) => {
		try {
			const { code, ...rest } = data;
			const res = await uspacySdk.crmEntitiesService.updateEntityField(entityCode, code, rest as IField);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const updateListValues = createAsyncThunk(
	'crm/fields/updateListValues',
	async ({ data, entityCode }: { data: Pick<IField, 'code' | 'values'>; entityCode: string }, thunkAPI) => {
		try {
			const { code, values } = data;
			const res = await uspacySdk.crmEntitiesService.updateEntityListValues(entityCode, code, values);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteListValue = createAsyncThunk(
	'crm/fields/deleteListValue',
	async ({ fieldCode, value, entityCode }: { fieldCode: string; value: string; entityCode: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.deleteEntityListValues(entityCode, fieldCode, value);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);
