import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

import { IDepartment } from './types';

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.rolesService.getRoles();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const fetchPermissions = createAsyncThunk('roles/fetchPermissions', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.rolesService.getPermissions();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const fetchRole = createAsyncThunk('roles/fetchRole', async (id: string, thunkAPI) => {
	try {
		const res = await uspacySdk.rolesService.getRole(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateRole = createAsyncThunk(
	'roles/updateRole',
	async (
		{
			id,
			title,
			usersIds,
			departmentList,
			permissions,
		}: { id: string; title?: string; usersIds?: string[]; departmentList?: IDepartment[]; permissions?: string[] },
		thunkAPI,
	) => {
		try {
			const res = await uspacySdk.rolesService.updateRole({ id, title, usersIds, departmentList, permissions });
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const createRole = createAsyncThunk('roles/createRole', async ({ title, permissions }: { title: string; permissions: string[] }, thunkAPI) => {
	try {
		const res = await uspacySdk.rolesService.createRole({ title, permissions });
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const deleteRole = createAsyncThunk('roles/deleteRole', async (id: string, thunkAPI) => {
	try {
		await uspacySdk.rolesService.deleteRole(id);

		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
