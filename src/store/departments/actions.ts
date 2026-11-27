import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { EMentionType } from '@uspacy/sdk/lib/models/mentions';
import { MainRoles } from '@uspacy/sdk/lib/models/user';

import { setEntityMention } from '../mentions/actions';

export const fetchDepartments = createAsyncThunk('departments/fetchDepartments', async (_, thunkAPI) => {
	try {
		const roles = (await uspacySdk.tokensService.getUserRoles().catch(() => undefined)) || [];
		const show = uspacySdk.usersService.hasRole(roles, [MainRoles.ADMIN, MainRoles.OWNER]) ? 'all' : undefined;
		const res = await uspacySdk.departmentsService.getDepartments(undefined, 'all', show);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createDepartment = createAsyncThunk(
	'departments/createDepartment',
	async (
		{
			name,
			headId,
			description,
			usersIds,
			parentDepartmentId,
			generalDepartmentId,
		}: {
			name: string;
			headId: string;
			description: string;
			usersIds: string[];
			parentDepartmentId?: string;
			generalDepartmentId: number;
		},
		thunkAPI,
	) => {
		try {
			const res = await uspacySdk.departmentsService.createDepartment({
				name,
				headId,
				description,
				usersIds,
				parentDepartmentId: parentDepartmentId || generalDepartmentId.toString(),
			});
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const editDepartment = createAsyncThunk(
	'departments/editDepartment',
	async (
		{
			id,
			name,
			headId,
			description,
			usersIds,
			parentDepartmentId,
		}: {
			id: number;
			name: string;
			headId: string;
			description: string;
			usersIds: string[];
			parentDepartmentId?: string;
		},
		thunkAPI,
	) => {
		try {
			const res = await uspacySdk.departmentsService.updateDepartment(id, {
				name,
				headId,
				description,
				parentDepartmentId: parentDepartmentId,
				usersIds,
			});
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteDepartment = createAsyncThunk('departments/deleteDepartment', async (id: string, thunkAPI) => {
	// TODO change the error handling once API is ready
	try {
		const request = uspacySdk.departmentsService.deleteDepartment(id);
		// messenger-backend is not notified about deleted departments, so the department mention is removed here.
		request.then(() => thunkAPI.dispatch(setEntityMention({ type: EMentionType.DEPARTMENT, entityId: +id, name: null }))).catch(() => undefined);
		return request;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	} finally {
		return id;
	}
});

export const addUsersToDepartment = createAsyncThunk(
	'departments/addUsersToDepartment',
	async (
		{
			departmentId,
			usersIds,
		}: {
			departmentId: number;
			usersIds: string[];
		},
		thunkAPI,
	) => {
		try {
			return uspacySdk.departmentsService.addUsersToDepartment(String(departmentId), usersIds);
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const removeUsersFromDepartment = createAsyncThunk(
	'departments/removeUsersFromDepartment',
	async (
		{
			departmentId,
			usersIds,
		}: {
			departmentId: number;
			usersIds: string[];
		},
		thunkAPI,
	) => {
		try {
			return uspacySdk.departmentsService.deleteUsersFromDepartment(String(departmentId), usersIds);
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);
