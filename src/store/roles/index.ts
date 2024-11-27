import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IPermissions, IRole } from '@uspacy/sdk/lib/models/roles';
import { IUpdateRolePermissionsFunnels } from '@uspacy/sdk/lib/services/RolesService/create-update-role-dto';

import { disabledPermissions } from '../../helpers/disabledPermissions';
import {
	createRole,
	deleteRole,
	fetchPermissions,
	fetchRole,
	fetchRoles,
	getPermissionsFunnels,
	updateRole,
	updateRolePermisionsFunnels,
} from './actions';
import { idsForDisableDeleting } from './disableDeleting.enum';
import { PermissionsControllerViewEnums } from './role.enums';
import { IState } from './types';

const initialState = {
	roles: [],
	loadingRoles: false,
	permissions: {
		create: [],
		edit: [],
		view: [],
		delete: [],
	},
	createPermissions: {
		create: [...disabledPermissions.create],
		edit: [...disabledPermissions.edit],
		view: [...disabledPermissions.view],
		delete: [...disabledPermissions.delete],
	},
	createPermissionsModal: {
		create: [],
		edit: [],
		view: [],
		delete: [],
	},
	modalActiveType: '',
	permissionsControllerView: PermissionsControllerViewEnums,
	filterCounter: 0,
	errorLoadingRoles: null,
	roleData: {},
	activeRole: null,
	permissionsFunnels: {},
} as IState;

const rolesReducer = createSlice({
	name: 'rolesReducer',
	initialState,
	reducers: {
		getNextVal(state, action) {
			const { tabName, categoryName, colName, targetVal, storeKey } = action.payload;

			const filteredCurrColName = colName === 'view' ? 'edit' : 'delete';
			const currStoreData = current(state[storeKey][filteredCurrColName]);

			const findNextVal = currStoreData
				.find((item) => item.split('.').splice(0, 3).join('.') === `${tabName}.${categoryName}.${filteredCurrColName}`)
				?.split('.')
				?.splice(-1)[0];

			const filterArr = currStoreData.filter(
				(item) => item.split('.').splice(0, 3).join('.') !== `${tabName}.${categoryName}.${filteredCurrColName}`,
			);

			switch (colName) {
				case 'view':
				case 'edit':
					switch (targetVal) {
						case 'mine':
						case 'disabled':
							if (findNextVal === 'allowed' || findNextVal === 'mine') {
								state[storeKey][filteredCurrColName] = [
									...filterArr,
									`${tabName}.${categoryName}.${filteredCurrColName}.${targetVal}`,
								];
							}
							return;

						default:
							return;
					}

				default:
					return;
			}
		},
		selectedRole(state, action) {
			state.roleData = action.payload;
			if (state.activeRole === '') {
				state.roleData.name = '';
				state.roleData.userList = [];
			}
		},
		addUserFromTable(state, action) {
			state.roles = state.roles.filter((role) => {
				if (role.title === action.payload.roleName && role.userList.map((user) => user.id) != action.payload.user.id) {
					return role.userList.push(action.payload.user);
				} else {
					return role;
				}
			});
		},
		resetCounter(state) {
			state.filterCounter = 0;
			state.activeRole = '';
		},
		resetTable(state, action) {
			state[action.payload.permissionsType] = {
				create: [],
				edit: [],
				view: [],
				delete: [],
			};
		},
		setActiveRole(state, action) {
			if (state.activeRole === action.payload) {
				state.activeRole = '';
				state.filterCounter = 0;
			} else {
				state.activeRole = action.payload;
				state.filterCounter = 1;
			}
		},
		updatePermission(state, action) {
			const currPoint = state[action.payload.permissionsType][action.payload.key];
			const keyForClean = action.payload.value.split('.').slice(0, -1).join('.');
			const typeOfCleanItem = action.payload.value.split('.').pop();

			const filterArr = currPoint.filter((item) => {
				const prettierItem = item.split('.').slice(0, -1).join('.');
				if (prettierItem !== keyForClean) {
					return item;
				}
			});

			state[action.payload.permissionsType][action.payload.key] = [
				...filterArr,
				typeOfCleanItem === 'disabled' ? '' : action.payload.value,
			].filter((item) => item !== '');
		},
		setActiveModalType(state, action) {
			state.modalActiveType = action.payload;
		},
		allowAllPermissions(state, action: PayloadAction<{ currPermission; type }>) {
			const permissionsType = action.payload.type;
			const permissions = {
				create: [],
				edit: [],
				view: [],
				delete: [],
			};
			const keys = Object.keys(state.permissions);
			keys.forEach((key) => {
				permissions[key] = [...permissions[key], state.permissions[key].filter((value) => value.split('.').pop() === 'disabled-any')];
			});
			permissions.create = [...permissions.create, action.payload.currPermission.create].flat();
			permissions.view = [...permissions.view, action.payload.currPermission.view].flat();
			permissions.edit = [...permissions.edit, action.payload.currPermission.edit].flat();
			permissions.delete = [...permissions.delete, action.payload.currPermission.delete].flat();
			if (permissionsType === 'create') {
				state.createPermissions = permissions;
			} else {
				state.permissions = permissions;
			}
		},
		addPermissionsForColAction(state, action) {
			const goalForClean = action.payload.categoryName;
			const permissionsType = action.payload.permissionsType;
			const permissionState = permissionsType === 'create' ? state.createPermissions : state.permissions;

			const newPermissions = {
				create: permissionState.create.filter((item) => !item.includes(goalForClean)),
				edit: permissionState.edit.filter((item) => !item.includes(goalForClean)),
				view: permissionState.view.filter((item) => !item.includes(goalForClean)),
				delete: permissionState.delete.filter((item) => !item.includes(goalForClean)),
			};
			newPermissions.create.push(`${goalForClean}.create.mine.disabled-any`);
			newPermissions.create = [...newPermissions.create, `${goalForClean}.create.${action.payload.permissionKey}`].filter(
				(item) => item !== `${goalForClean}.create.mine`,
			);
			newPermissions.edit = [...newPermissions.edit, `${goalForClean}.edit.${action.payload.permissionKey}`];
			newPermissions.view = [...newPermissions.view, `${goalForClean}.view.${action.payload.permissionKey}`];
			newPermissions.delete = [...newPermissions.delete, `${goalForClean}.delete.${action.payload.permissionKey}`];
			if (permissionsType === 'create') {
				state.createPermissions = newPermissions;
			} else {
				state.permissions = newPermissions;
			}
		},
	},
	extraReducers: {
		[fetchPermissions.fulfilled.type]: (state, action: PayloadAction<IPermissions>) => {
			state.permissions = action.payload;
		},
		[fetchPermissions.pending.type]: (state) => {
			state.loadingRoles = true;
			state.errorLoadingRoles = null;
		},
		[fetchPermissions.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingRoles = false;
			state.errorLoadingRoles = action.payload;
		},
		[fetchRoles.fulfilled.type]: (state, action: PayloadAction<IRole[]>) => {
			state.loadingRoles = false;
			state.errorLoadingRoles = null;
			const sortedRoles = action.payload;
			const headRoleIndex = sortedRoles.findIndex((item) => item.code === 'Head');
			if (headRoleIndex !== -1) {
				const headRole = sortedRoles.splice(headRoleIndex, 1)[0];
				sortedRoles.splice(1, 0, headRole);
			}
			state.roles = sortedRoles.filter((role) => role.code !== idsForDisableDeleting.noAccessRole);

			state.permissions = {
				create: [],
				edit: [],
				view: [],
				delete: [],
			};
		},
		[fetchRoles.pending.type]: (state) => {
			state.loadingRoles = true;
			state.errorLoadingRoles = null;
		},
		[fetchRoles.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingRoles = false;
			state.errorLoadingRoles = action.payload;
		},
		[createRole.fulfilled.type]: (state, action: PayloadAction<IRole>) => {
			state.loadingRoles = false;
			state.errorLoadingRoles = null;
			state.roles = [...state.roles, action.payload];
		},
		[createRole.pending.type]: (state) => {
			state.loadingRoles = true;
			state.errorLoadingRoles = null;
		},
		[createRole.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingRoles = false;
			state.errorLoadingRoles = action.payload;
		},
		[updateRole.fulfilled.type]: (state, action: PayloadAction<IRole>) => {
			state.loadingRoles = false;
			state.errorLoadingRoles = null;
			state.roles = state.roles.map((role) => {
				if (role.id === action.payload.id) {
					return action.payload;
				}
				return role;
			});
		},
		[updateRole.pending.type]: (state) => {
			state.loadingRoles = true;
			state.errorLoadingRoles = null;
		},
		[updateRole.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingRoles = false;
			state.errorLoadingRoles = action.payload;
		},
		[deleteRole.fulfilled.type]: (state, action: PayloadAction<string>) => {
			state.loadingRoles = false;
			state.errorLoadingRoles = null;
			state.roles = state.roles.filter((role) => role.id !== action.payload);
			// TODO
		},
		[deleteRole.pending.type]: (state) => {
			state.loadingRoles = true;
			state.errorLoadingRoles = null;
		},
		[deleteRole.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingRoles = false;
			state.errorLoadingRoles = action.payload;
		},
		[fetchRole.fulfilled.type]: (state, action: PayloadAction<IRole>) => {
			// FIX Backend
			const permCheck = (key) => {
				if (key) {
					return key;
				} else {
					return [];
				}
			};
			state.loadingRoles = false;
			state.permissions = {
				create: [...disabledPermissions.create, ...permCheck(action.payload.permissions.create)],
				edit: [...disabledPermissions.edit, ...permCheck(action.payload.permissions.edit)],
				view: [...disabledPermissions.view, ...permCheck(action.payload.permissions.view)],
				delete: [...disabledPermissions.delete, ...permCheck(action.payload.permissions.delete)],
			};
		},
		[fetchRole.pending.type]: (state) => {
			state.loadingRoles = true;
			state.errorLoadingRoles = null;
		},
		[fetchRole.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingRoles = false;
			state.errorLoadingRoles = action.payload;
		},
		[getPermissionsFunnels.fulfilled.type]: (state, action: PayloadAction<IUpdateRolePermissionsFunnels>) => {
			state.loadingRoles = false;
			state.errorLoadingRoles = null;
			state.permissionsFunnels = action.payload;
		},
		[getPermissionsFunnels.pending.type]: (state) => {
			state.loadingRoles = true;
			state.errorLoadingRoles = null;
		},
		[getPermissionsFunnels.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingRoles = false;
			state.errorLoadingRoles = action.payload;
		},
		[updateRolePermisionsFunnels.fulfilled.type]: (state) => {
			state.loadingRoles = false;
			state.errorLoadingRoles = null;
		},
		[updateRolePermisionsFunnels.pending.type]: (state) => {
			state.loadingRoles = true;
			state.errorLoadingRoles = null;
		},
		[updateRolePermisionsFunnels.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingRoles = false;
			state.errorLoadingRoles = action.payload;
		},
	},
});

export const {
	getNextVal,
	selectedRole,
	addUserFromTable,
	resetCounter,
	resetTable,
	setActiveRole,
	updatePermission,
	setActiveModalType,
	allowAllPermissions,
	addPermissionsForColAction,
} = rolesReducer.actions;

export default rolesReducer.reducer;
