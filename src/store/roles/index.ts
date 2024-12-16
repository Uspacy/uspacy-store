import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IPermissions, IPermissionsFunnelsResponse, IRole } from '@uspacy/sdk/lib/models/roles';

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
			const { categoryName: goalForClean, permissionsType, permissionKey, isFunnel, actionType } = action.payload;
			const permissionState = permissionsType === 'create' ? state.createPermissions : state.permissions;

			const newPermissions = {
				create: [...permissionState.create],
				edit: [...permissionState.edit],
				view: [...permissionState.view],
				delete: [...permissionState.delete],
			};

			if (isFunnel) {
				// Update only the specified permissionsType for goalForClean
				newPermissions[actionType] = newPermissions[actionType]
					.filter((item) => !item.includes(goalForClean))
					.concat(`${goalForClean}.${actionType}.${permissionKey}`);
				if (actionType === 'create') {
					newPermissions.create = newPermissions.create
						.filter((item) => !item.includes(goalForClean))
						.concat(`${goalForClean}.create.mine.disabled-any`, `${goalForClean}.create.${permissionKey}`);
				}
				if (actionType === 'view' && permissionKey === 'disabled') {
					newPermissions.edit = newPermissions.edit
						.filter((item) => !item.includes(goalForClean))
						.concat(`${goalForClean}.edit.disabled-any`);
					newPermissions.delete = newPermissions.delete
						.filter((item) => !item.includes(goalForClean))
						.concat(`${goalForClean}.delete.disabled-any`);
				}
				if (actionType === 'edit' && permissionKey === 'disabled') {
					newPermissions.delete = newPermissions.delete
						.filter((item) => !item.includes(goalForClean))
						.concat(`${goalForClean}.delete.disabled-any`);
				}
			} else {
				// Update all permissions related to goalForClean
				newPermissions.create = [
					...permissionState.create.filter((item) => !item.includes(goalForClean)),
					`${goalForClean}.create.mine.disabled-any`,
					`${goalForClean}.create.${permissionKey}`,
				].filter((item) => item !== `${goalForClean}.create.mine`);

				newPermissions.edit = [
					...permissionState.edit.filter((item) => !item.includes(goalForClean)),
					`${goalForClean}.edit.${permissionKey}`,
				];

				newPermissions.view = [
					...permissionState.view.filter((item) => !item.includes(goalForClean)),
					`${goalForClean}.view.${permissionKey}`,
				];

				newPermissions.delete = [
					...permissionState.delete.filter((item) => !item.includes(goalForClean)),
					`${goalForClean}.delete.${permissionKey}`,
				];
			}

			if (permissionsType === 'create') {
				state.createPermissions = newPermissions;
			} else {
				state.permissions = newPermissions;
			}
		},
		mergeCreatePermissions(state, action) {
			const merged = {
				create: [...state[action.payload.key].create, ...action.payload.universal.create],
				edit: [...state[action.payload.key].edit, ...action.payload.universal.edit],
				view: [...state[action.payload.key].view, ...action.payload.universal.view],
				delete: [...state[action.payload.key].delete, ...action.payload.universal.delete],
			};
			state[action.payload.key] = merged;
		},
		clearPermissionsFunnels(state) {
			state.permissionsFunnels = {};
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
		[getPermissionsFunnels.fulfilled.type]: (state, action: PayloadAction<IPermissionsFunnelsResponse>) => {
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
		[updateRolePermisionsFunnels.fulfilled.type]: (state, action) => {
			state.permissionsFunnels = action.payload;
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
	mergeCreatePermissions,
	clearPermissionsFunnels,
} = rolesReducer.actions;

export default rolesReducer.reducer;
