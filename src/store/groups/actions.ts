import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';

export const fetchGroup = createAsyncThunk('groups/fetchGroup', async (id: string, thunkAPI) => {
	try {
		const res = await uspacySdk.groupsService.getGroup(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const fetchGroupForTask = createAsyncThunk('groups/fetchGroupForTask', async (id: string, thunkAPI) => {
	try {
		const res = await uspacySdk.groupsService.getGroupForTask(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const fetchGroups = createAsyncThunk(
	'groups/fetchGroups',
	async ({ page, list, userId, search }: { page?: number; list?: number; userId?: number; search?: string }, thunkAPI) => {
		try {
			return await uspacySdk.groupsService.getGroups(page, list || 12, userId, search).then((res) => res.data);
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const createGroup = createAsyncThunk(
	'groups/createGroup',
	async (
		{
			name,
			groupType,
			description,
			groupTheme,
			ownerId,
			logo,
			moderatorsIds,
			usersIds,
		}: {
			name: string;
			groupType: string;
			description?: string;
			groupTheme?: string;
			ownerId?: string;
			logo?: File;
			moderatorsIds?: string[];
			usersIds?: string[];
		},
		thunkAPI,
	) => {
		try {
			return await uspacySdk.groupsService
				.createGroup({ name, groupType, description, groupTheme, ownerId, logo, moderatorsIds, usersIds })
				.then((res) => res.data);
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const editGroup = createAsyncThunk(
	'groups/editGroup',
	async (
		{
			groupId,
			name,
			groupType,
			description,
			groupTheme,
			ownerId,
			moderatorsIds,
			usersIds,
			archived,
		}: {
			groupId: string;
			name: string;
			groupType: string;
			description?: string;
			groupTheme?: string;
			ownerId?: string;
			moderatorsIds?: string[];
			usersIds?: string[];
			archived?: number;
		},
		thunkAPI,
	) => {
		try {
			return await uspacySdk.groupsService
				.editGroup({
					groupId,
					name,
					groupType,
					description,
					groupTheme,
					ownerId,
					moderatorsIds,
					usersIds,
					archived,
				})
				.then((res) => res.data);
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteGroup = createAsyncThunk('groups/deleteGroup', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.groupsService.deleteGroup(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const inviteUsersInGroup = createAsyncThunk(
	'groups/inviteUsersInGroup',
	async ({ groupId, userIds }: { groupId: string; userIds: string[] }, thunkAPI) => {
		try {
			return await uspacySdk.groupsService.inviteUsersInGroup({ groupId: groupId, userIds: userIds });
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const leaveGroup = createAsyncThunk('groups/leaveGroup', async (groupId: string, thunkAPI) => {
	try {
		const res = await uspacySdk.groupsService.leaveGroup(groupId);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const joinGroup = createAsyncThunk('groups/joinGroup', async (groupId: string, thunkAPI) => {
	try {
		const res = await uspacySdk.groupsService.joinGroup(groupId);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const getUsersRequestedForJoing = createAsyncThunk('groups/getUsersRequestedForJoing', async (groupId: string, thunkAPI) => {
	try {
		const res = await uspacySdk.groupsService.getUsersRequestedForJoing(groupId);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const acceptUserInviteRequest = createAsyncThunk(
	'groups/acceptUserInviteRequest',
	async ({ groupId, userId }: { groupId: string; userId: number }, thunkAPI) => {
		try {
			return await uspacySdk.groupsService.acceptUserInviteRequest(groupId, userId);
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const rejectUserInviteRequest = createAsyncThunk(
	'groups/acceptUserInviteRequest',
	async ({ groupId, userId }: { groupId: string; userId: number }, thunkAPI) => {
		try {
			return await uspacySdk.groupsService.rejectUserInviteRequest(groupId, userId);
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const uploadLogo = createAsyncThunk(
	'groups/uploadLogo',
	async (
		{
			groupId,
			logo,
		}: {
			groupId: string;
			logo?: File;
		},
		thunkAPI,
	) => {
		try {
			const res = await uspacySdk.groupsService.uploadLogo(groupId, logo);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const userApplyToJoinGroup = createAsyncThunk('groups/userApplyToJoinGroup', async (groupId: string, thunkAPI) => {
	try {
		return await uspacySdk.groupsService.userApplyToJoinGroup(groupId);
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const checkIfUserSendJoinRequest = createAsyncThunk(
	'groups/checkIfUserSendJoinRequest',
	async ({ groupId, userId }: { groupId: string; userId: number }, thunkAPI) => {
		try {
			const res = await uspacySdk.groupsService.checkIfUserSendJoinRequest(groupId, userId);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);
