import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IUser, MainRoles } from '@uspacy/sdk/lib/models/user';

import { IInvite, IUploadAvatar } from './types';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, thunkAPI) => {
	try {
		const roles = (await uspacySdk.tokensService.getUserRoles().catch(() => undefined)) || [];
		if (uspacySdk.usersService.hasRole(roles, [MainRoles.ADMIN, MainRoles.OWNER])) {
			const res = await uspacySdk.usersService.getUsers(undefined, 'all');
			return res.data;
		}
		const res = await uspacySdk.usersService.getUsers(undefined, 999);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure load users');
	}
});

export const updateUser = createAsyncThunk('users/updateUser', async (user: IUser, thunkAPI) => {
	try {
		const { id, ...clone } = user;
		const response = await uspacySdk.usersService.updateUser(id, clone);
		if (!user.active && !user.registered) {
			response.data.dateOfInvitation = user.dateOfInvitation;
		}
		return response.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateUserPosition = createAsyncThunk('users/updateUserPosition', async (user: IUser, thunkAPI) => {
	try {
		const response = await uspacySdk.usersService.updatePosition(user.id, user.position);
		return response.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateUserRoles = createAsyncThunk('users/updateUserRoles', async (user: IUser, thunkAPI) => {
	try {
		const response = await uspacySdk.usersService.updateRoles(user.id, user.roles);
		return response.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deactivateUser = createAsyncThunk('users/deactivateUser', async (id: number, thunkAPI) => {
	try {
		return uspacySdk.usersService.deactivateUser(id);
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const activateUser = createAsyncThunk('users/activateUser', async (id: number, thunkAPI) => {
	try {
		return uspacySdk.usersService.activateUser(id);
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const sendUserInvites = createAsyncThunk(
	'users/sendUserInvites',
	async ({ invites, type }: { invites: IInvite[]; type: 'single' | 'multi' }, thunkAPI) => {
		try {
			if (type === 'single') {
				return uspacySdk.invatesService.createInvates(
					invites.reduce(
						(acc, curr) =>
							curr.email.length > 0
								? [
										...acc,
										{
											email: curr.email,
											firstName: curr.firstName,
											lastName: curr.lastName,
										},
								  ]
								: acc,
						[],
					),
				);
			}
			return uspacySdk.invatesService.createInvatesBatch(
				invites.reduce((acc, curr) => (curr.email.length > 0 ? [...acc, curr.email] : acc), []),
			);
			// await fetch<IUser>(`${API_PREFIX}/invites/email${type === 'multi' ? '/batch' : ''}`, {
			// 	method: 'POST',
			// 	body: JSON.stringify(
			// 		type === 'single'
			// 			? invites.reduce(
			// 					(acc, curr) =>
			// 						curr.email.length > 0
			// 							? [
			// 									...acc,
			// 									{
			// 										email: curr.email,
			// 										firstName: curr.firstName,
			// 										lastName: curr.lastName,
			// 									},
			// 							  ]
			// 							: acc,
			// 					[],
			// 			  )
			// 			: invites.reduce((acc, curr) => (curr.email.length > 0 ? [...acc, curr.email] : acc), []),
			// 	),
			// });
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		} finally {
			return thunkAPI.dispatch(fetchUsers());
		}
	},
);

export const repeatInvitation = createAsyncThunk('users/repeatInvitation', async (userId: number, thunkAPI) => {
	try {
		await uspacySdk.invatesService.resendInvateByUserId(userId);
		return userId;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteInvitation = createAsyncThunk('users/deleteInvitation', async (userId: number, thunkAPI) => {
	try {
		return uspacySdk.invatesService.deleteInvateByUserId(userId);
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	} finally {
		return userId;
	}
});

export const uploadAvatar = createAsyncThunk(
	'users/uploadAvatar',
	async ({ file, userId, adminRole, profileId }: IUploadAvatar, { rejectWithValue }) => {
		try {
			const response = await uspacySdk.usersService.uploadAvatar({
				file,
				userId: adminRole && userId !== profileId ? userId : profileId,
			});

			return response.data;
		} catch (e) {
			return rejectWithValue('Failure');
		}
	},
);
