import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IUser } from '@uspacy/sdk/lib/models/user';

import {
	activateUser,
	deactivateUser,
	deleteInvitation,
	fetchUsers,
	repeatInvitation,
	sendUserInvites,
	updateUser,
	updateUserPosition,
	updateUserRoles,
	uploadAvatar,
} from './actions';
import { IState } from './types';

const initialState: IState = {
	data: [],
	loading: true,
	loadingUpdatingUser: false,
	errorLoadingUpdatingUser: null,
};

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		addUserRoleFromTable(state, action) {
			state.data = state.data.filter((item) => {
				if (item.id === action.payload.id) {
					return item.roles.push(action.payload.role);
				} else {
					return item;
				}
			});
			// UsersCache.setData(state.data);
		},
		deleteUserRoleFromTable(state, action) {
			state.data = state.data.filter((item) => {
				if (item.id === action.payload.id) {
					const filterData = item.roles.filter((role) => role !== action.payload.role);
					item.roles = filterData;
					return item;
				} else {
					return item;
				}
			});
			// UsersCache.setData(state.data);
		},
		addDepartmentToUsers(state, action: PayloadAction<{ data: number[]; departmentId: string }>) {
			state.data = state.data.map((it) =>
				action.payload.data.includes(it.id) ? { ...it, departmentsIds: [...(it?.departmentsIds || []), action.payload.departmentId] } : it,
			);
		},
		removeDepartmentFromUsers(state, action: PayloadAction<{ data: number[]; departmentId: string }>) {
			state.data = state.data.map((it) =>
				action.payload.data.includes(it.id)
					? { ...it, departmentsIds: it.departmentsIds.filter((departmentId) => departmentId !== action.payload.departmentId) }
					: it,
			);
		},
	},
	extraReducers: {
		[fetchUsers.fulfilled.type]: (state, action: PayloadAction<IUser[]>) => {
			state.loading = false;
			state.data = action.payload.filter((user) => !!user.authUserId);
		},
		[fetchUsers.pending.type]: (state) => {
			state.loading = true;
			state.errorLoading = '';
		},
		[fetchUsers.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorLoading = action.payload;
		},
		[updateUser.fulfilled.type]: (state, action: PayloadAction<IUser>) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = null;
			state.data = state.data.map((user) => (user.id === action.payload.id ? action.payload : user));
			// UsersCache.setData(state.data);
		},
		[updateUser.pending.type]: (state) => {
			state.loadingUpdatingUser = true;
			state.errorLoadingUpdatingUser = null;
		},
		[updateUser.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = action.payload;
		},
		[updateUserPosition.fulfilled.type]: (state, action: PayloadAction<IUser>) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = null;
			state.data = state.data.map((user) => (user.id === action.payload.id ? action.payload : user));
			// UsersCache.setData(state.data);
		},
		[updateUserPosition.pending.type]: (state) => {
			state.loadingUpdatingUser = true;
			state.errorLoadingUpdatingUser = null;
		},
		[updateUserPosition.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = action.payload;
		},
		[updateUserRoles.fulfilled.type]: (state, action: PayloadAction<IUser>) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = null;
			state.data = state.data.map((user) => (user.id === action.payload.id ? action.payload : user));
			// UsersCache.setData(state.data);
		},
		[updateUserRoles.pending.type]: (state) => {
			state.loadingUpdatingUser = true;
			state.errorLoadingUpdatingUser = null;
		},
		[updateUserRoles.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = action.payload;
		},
		[deactivateUser.fulfilled.type]: (state, action: PayloadAction<IUser>) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = null;
			state.data = state.data.map((user) => (user.id === action.payload.id ? action.payload : user));
			// UsersCache.setData(state.data);
		},
		[deactivateUser.pending.type]: (state) => {
			state.loadingUpdatingUser = true;
			state.errorLoadingUpdatingUser = null;
		},
		[deactivateUser.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = action.payload;
		},
		[activateUser.fulfilled.type]: (state, action: PayloadAction<IUser>) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = null;
			state.data = state.data.map((user) => (user.id === action.payload.id ? action.payload : user));
			// UsersCache.setData(state.data);
		},
		[activateUser.pending.type]: (state) => {
			state.loadingUpdatingUser = true;
			state.errorLoadingUpdatingUser = null;
		},
		[activateUser.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = action.payload;
		},
		[sendUserInvites.fulfilled.type]: (state) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = null;
		},
		[sendUserInvites.pending.type]: (state) => {
			state.loadingUpdatingUser = true;
			state.errorLoadingUpdatingUser = null;
		},
		[sendUserInvites.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = action.payload;
		},
		[repeatInvitation.fulfilled.type]: (state, action: PayloadAction<string>) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = null;
			state.data = state.data.map((user) =>
				user.id.toString() === action.payload.toString() ? { ...user, dateOfInvitation: new Date().getTime() / 1000 } : user,
			);
			// UsersCache.setData(state.data);
		},
		[repeatInvitation.pending.type]: (state) => {
			state.loadingUpdatingUser = true;
			state.errorLoadingUpdatingUser = null;
		},
		[repeatInvitation.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = action.payload;
		},
		[deleteInvitation.fulfilled.type]: (state, action: PayloadAction<string>) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = null;
			state.data = state.data.filter((user) => user.id.toString() !== action.payload.toString());
			// UsersCache.setData(state.data);
		},
		[deleteInvitation.pending.type]: (state) => {
			state.loadingUpdatingUser = true;
			state.errorLoadingUpdatingUser = null;
		},
		[deleteInvitation.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = action.payload;
		},
		[uploadAvatar.fulfilled.type]: (state, action: PayloadAction<IUser>) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = null;
			state.data = state.data.map((user) => (user.id === action.payload.id ? action.payload : user));
			// UsersCache.setData(state.data);
		},
		[uploadAvatar.pending.type]: (state) => {
			state.loadingUpdatingUser = true;
			state.errorLoadingUpdatingUser = null;
		},
		[uploadAvatar.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdatingUser = false;
			state.errorLoadingUpdatingUser = action.payload;
		},
	},
});

export const { addUserRoleFromTable, addDepartmentToUsers, removeDepartmentFromUsers, deleteUserRoleFromTable } = usersSlice.actions;

export default usersSlice.reducer;
