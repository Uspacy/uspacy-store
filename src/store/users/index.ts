import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilterField, IFilterPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { IFilter } from '@uspacy/sdk/lib/models/crm-filters';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';
import { IUser } from '@uspacy/sdk/lib/models/user';

import {
	activateUser,
	deactivateUser,
	deleteInvitation,
	fetchUsers,
	fetchUsersByFilters,
	repeatInvitation,
	sendUserInvites,
	updateUser,
	updateUserPosition,
	updateUserRoles,
	uploadAvatar,
} from './actions';
import { IState } from './types';

export const sortPresets = (presets: IFilterPreset[]) => {
	return presets.sort((a, b) => {
		if (a.pinned) return -1;
		if (b.pinned) return 1;
		return 0;
	});
};

const initialState: IState = {
	data: [],
	usersFiltersData: {
		data: [],
		meta: null,
	},
	loading: true,
	loadingUsersByFilter: true,
	loadingUpdatingUser: false,
	errorLoadingUpdatingUser: null,
	userFilter: null,
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
		setFilterPresets: (
			state,
			action: PayloadAction<{
				data: IFilterPreset[];
				filters: Partial<IFilter>;
				filterFields: Partial<IFilterField[]>;
			}>,
		) => {
			if (!state.userFilter) state.userFilter = { presets: [] };
			const presets = sortPresets(action.payload.data);
			const currentPreset = presets.find((item) => item.current);
			state.userFilter = {
				presets,
				filters: {
					...currentPreset?.filters,
					...action.payload.filters,
				},
				filterFields: action.payload.filterFields,
			};
		},
		createFilterPreset: (state, action: PayloadAction<{ data: IFilterPreset }>) => {
			const presets = sortPresets([
				...state.userFilter.presets.map((it) => ({
					...it,
					current: false,
					pinned: false,
				})),
				action.payload.data,
			]);
			const currentPreset = presets.find((item) => item.current);
			state.userFilter = {
				presets,
				filters: currentPreset?.filters,
				filterFields: currentPreset?.filterFields,
			};
		},
		deleteFilterPreset: (state, action: PayloadAction<{ presetId: IFilterPreset['id'] }>) => {
			let newItems = state.userFilter?.presets.filter((item) => item.id !== action.payload.presetId || item.default);
			let needChangeFilter = false;
			const pinnedItem = newItems?.find((item) => item.pinned);
			if (!pinnedItem) {
				newItems = newItems.map((item) => {
					if (item.default) {
						needChangeFilter = true;
						return {
							...item,
							pinned: true,
							current: true,
						};
					}
					return item;
				});
			}
			state.userFilter.presets = newItems;
			if (needChangeFilter) {
				const currentPreset = newItems.find((item) => item.current);
				state.userFilter.filters = currentPreset?.filters;
			}
		},
		updateFilterPreset: (state, action: PayloadAction<{ data: Partial<IFilterPreset> }>) => {
			state.userFilter.presets = state.userFilter.presets?.map((item) => {
				if (item.id === action.payload.data.id)
					return {
						...item,
						...action.payload.data,
					};
				return item;
			});
		},
		pinFilterPreset: (state, action: PayloadAction<{ presetId: IFilterPreset['id'] }>) => {
			let needChangeFilter = false;
			const newItems = state.userFilter.presets?.map((item) => {
				if (item.id === action.payload.presetId && !item.pinned) {
					needChangeFilter = true;
					return {
						...item,
						pinned: true,
						current: true,
					};
				}
				return {
					...item,
					pinned: false,
				};
			});
			state.userFilter.presets = sortPresets(newItems);
			if (needChangeFilter) {
				const currentPreset = newItems.find((item) => item.current);
				state.userFilter.filters = currentPreset?.filters;
			}
		},
		unpinFilterPreset: (state, action: PayloadAction<{ presetId: IFilterPreset['id'] }>) => {
			const newItems = state.userFilter.presets?.map((item) => {
				if (item.id === action.payload.presetId && item.pinned)
					return {
						...item,
						pinned: false,
					};
				if (item.default && !item.pinned) {
					return {
						...item,
						pinned: true,
						current: true,
					};
				}
				return item;
			});
			state.userFilter.presets = sortPresets(newItems);
			const currentPreset = newItems.find((item) => item.current);
			state.userFilter.filters = currentPreset?.filters;
		},
		setCurrentFilterPreset: (state, action: PayloadAction<{ presetId: IFilterPreset['id'] }>) => {
			let needChangeFilter = false;
			const newItems = state.userFilter.presets?.map((item) => {
				if (item.id === action.payload.presetId) {
					needChangeFilter = true;
					return {
						...item,
						current: true,
					};
				}
				return {
					...item,
					current: false,
				};
			});
			state.userFilter.presets = newItems;
			if (needChangeFilter) {
				const currentPreset = newItems.find((item) => item.current);
				state.userFilter.filters = currentPreset?.filters;
			}
		},
		updateCurrentPresetFilters: (state, action: PayloadAction<{ filters: Partial<IFilter> }>) => {
			state.userFilter.presets = state.userFilter.presets?.map((item) => {
				if (item.current) {
					const it = { ...item, filters: { ...item.filters, ...action.payload.filters } };
					return it;
				}
				return item;
			});
			state.userFilter.filters = { ...state.userFilter?.filters, ...action.payload.filters };
		},
		updateCurrentFilters: (state, action: PayloadAction<{ filters: Partial<IFilter> }>) => {
			state.userFilter.filters = { ...state.userFilter?.filters, ...action.payload.filters };
		},
		updateCurrentFilterFields: (state, action: PayloadAction<{ filterFields: Partial<IFilterField[]> }>) => {
			state.userFilter.filterFields = action.payload.filterFields;
		},
		clearItems: (state: IState) => {
			state.usersFiltersData = initialState.usersFiltersData;
		},
	},
	extraReducers: {
		[fetchUsersByFilters.fulfilled.type]: (state, action: PayloadAction<IResponseWithMeta<IUser>>) => {
			state.loadingUsersByFilter = false;
			state.usersFiltersData = !!action.payload.aborted ? state.usersFiltersData : action.payload;
		},
		[fetchUsersByFilters.pending.type]: (state) => {
			state.loadingUsersByFilter = true;
			state.errorLoading = '';
		},
		[fetchUsersByFilters.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingUsersByFilter = false;
			state.errorLoading = action.payload;
		},
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

export const {
	addUserRoleFromTable,
	addDepartmentToUsers,
	removeDepartmentFromUsers,
	deleteUserRoleFromTable,
	setFilterPresets,
	createFilterPreset,
	deleteFilterPreset,
	updateFilterPreset,
	updateCurrentPresetFilters,
	updateCurrentFilters,
	pinFilterPreset,
	unpinFilterPreset,
	setCurrentFilterPreset,
	updateCurrentFilterFields,
} = usersSlice.actions;

export default usersSlice.reducer;
