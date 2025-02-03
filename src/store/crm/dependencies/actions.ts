import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IDependenciesList } from '@uspacy/sdk/lib/models/dependencies-list';

export const fetchDependenciesLists = createAsyncThunk('crm/dependencies/fetchDependenciesLists', async (code: string, thunkAPI) => {
	try {
		const res = await uspacySdk.crmEntitiesService.getDependenciesLists(code);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createDependenciesList = createAsyncThunk(
	'crm/dependencies/createDependenciesList',
	async ({ data, entityCode }: { data: Partial<IDependenciesList>; entityCode: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.createOrUpdateDependencies(data, entityCode);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteDependenciesList = createAsyncThunk(
	'crm/dependencies/deleteDependenciesList',
	async ({ id, entityCode }: { id: number; entityCode: string }, thunkAPI) => {
		try {
			return await uspacySdk.crmEntitiesService.deleteDependenciesLists(entityCode, id);
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const updateDependenciesLists = createAsyncThunk(
	'crm/dependencies/updateDependenciesLists',
	async ({ data, entityCode }: { data: IDependenciesList; entityCode: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.createOrUpdateDependencies(data, entityCode);
			return res?.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);
