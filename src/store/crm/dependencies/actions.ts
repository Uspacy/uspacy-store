import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IDependenciesList } from '@uspacy/sdk/lib/models/dependencies-list';

export const fetchDependenciesLists = createAsyncThunk('crm/dependenciesList/fetchDependenciesLists', async (code: string, thunkAPI) => {
	try {
		const res = await uspacySdk.crmEntitiesService.getDependenciesLists(code);
		return res;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createDependenciesList = createAsyncThunk(
	'crm/dependenciesList/createDependenciesList',
	async ({ data, entityCode }: { data: Partial<IDependenciesList>; entityCode: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.createOrUpdateDependencies(data, entityCode);
			return res;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteDependenciesList = createAsyncThunk(
	'crm/dependenciesList/deleteDependenciesList',
	async ({ id, entityCode }: { id: number; entityCode: string }, thunkAPI) => {
		try {
			await uspacySdk.crmEntitiesService.deleteDependenciesLists(entityCode, id);
			return id;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const updateDependenciesLists = createAsyncThunk(
	'crm/dependenciesList/updateDependenciesLists',
	async ({ data, entityCode }: { data: IDependenciesList; entityCode: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.crmEntitiesService.createOrUpdateDependencies(data, entityCode);
			return res;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);
