import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IGroup } from '@uspacy/sdk/lib/models/groups';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

import {
	acceptUserInviteRequest,
	checkIfUserSendJoinRequest,
	createGroup,
	deleteGroup,
	editGroup,
	fetchGroup,
	fetchGroupForTask,
	fetchGroups,
	getUsersRequestedForJoing,
	leaveGroup,
	uploadLogo,
} from './actions';
import { IState } from './types';

const initialState = {
	groups: {
		data: [],
	},
	group: {},
	groupForTask: {},
	loadingGroup: false,
	errorLoadingGroup: null,
	isLoaded: false,
	isChatOpened: false,
	loadingGroups: true,
	errorLoadingGroups: null,
	allGroups: [],
	isNewGroupCreate: false,
	modalOpened: { create: false, edit: false, confirm: false, invite: false },
	action: { archive: false, delete: false, chat: false, id: null },
	search: '',
	usersWhoSendRequest: [],
	loadingRequest: false,
	inviteAccepted: false,
	userSendRequestError: '',
	isUserLeavedGroup: false,
} as IState;

const groupsReducer = createSlice({
	name: 'groupsReducer',
	initialState,
	reducers: {
		setGroup: (state, action: PayloadAction<IGroup>) => {
			state.group = action.payload;
		},
		setGroupForTask: (state, action: PayloadAction<IGroup>) => {
			state.groupForTask = action.payload;
		},
		clearGroupReducer: (state) => {
			state.group = {} as IGroup;
		},
		chatOpened: (state, action) => {
			state.isChatOpened = action.payload;
		},
		addToAllGroups: (state, action: PayloadAction<IGroup[]>) => {
			state.allGroups = action.payload;
		},
		clearGroups: (state) => {
			state.allGroups = [];
		},
		changeNewGroupStatus: (state, action: PayloadAction<boolean>) => {
			state.isNewGroupCreate = action.payload;
		},
		setModalOpened: (state, action) => {
			state.modalOpened = action.payload;
		},
		setAction: (state, action) => {
			state.action = action.payload;
		},
		changeSearch: (stage, action: PayloadAction<string>) => {
			stage.search = action.payload;
		},
		clearRequests: (state) => {
			state.usersWhoSendRequest = [];
		},
		addGroupMember: (state, action: PayloadAction<string>) => {
			state.group?.usersIds?.push(action.payload);
		},
		userLeavedGroup: (state, action: PayloadAction<{ id: string; groupId: string; isModerator: boolean }>) => {
			const moderatorsIds = state.group?.moderatorsIds?.filter((el) => el !== action.payload.id);
			state.group = { ...state.group, moderatorsIds };

			// display actual participantCount if user leave group from card menu in groups page
			const editedGroup = state.allGroups.find((grp) => grp.id.toString() === action.payload.groupId);

			if (action.payload.isModerator) {
				const removeModerator = editedGroup.moderatorsIds.filter((el) => el !== action.payload.id);
				editedGroup.moderatorsIds = removeModerator;
			} else {
				const removeUser = editedGroup.usersIds.filter((el) => el !== action.payload.id);
				editedGroup.usersIds = removeUser;
			}

			state.allGroups = state.allGroups.map((el) => (el.id.toString() === editedGroup.id.toString() ? editedGroup : el));
		},
	},
	extraReducers: {
		[fetchGroups.fulfilled.type]: (state, action: PayloadAction<IResponseWithMeta<IGroup>>) => {
			state.loadingGroups = false;
			state.errorLoadingGroups = null;
			state.groups = action.payload;
		},
		[fetchGroups.pending.type]: (state) => {
			state.loadingGroups = true;
			state.errorLoadingGroups = null;
		},
		[fetchGroups.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingGroups = false;
			state.errorLoadingGroups = action.payload;
		},
		[fetchGroup.fulfilled.type]: (state, action: PayloadAction<IGroup>) => {
			state.loadingGroup = false;
			state.errorLoadingGroup = null;
			state.group = action.payload;
			state.isLoaded = true;
		},
		[fetchGroup.pending.type]: (state) => {
			state.loadingGroup = true;
			state.errorLoadingGroup = null;
			state.isLoaded = false;
		},
		[fetchGroup.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingGroup = false;
			state.errorLoadingGroup = action.payload;
		},
		[fetchGroupForTask.fulfilled.type]: (state, action: PayloadAction<IGroup>) => {
			state.loadingGroup = false;
			state.errorLoadingGroup = null;
			state.groupForTask = action.payload;
			state.isLoaded = true;
		},
		[fetchGroupForTask.pending.type]: (state) => {
			state.loadingGroup = true;
			state.errorLoadingGroup = null;
			state.isLoaded = false;
		},
		[fetchGroupForTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingGroup = false;
			state.errorLoadingGroup = action.payload;
		},
		[createGroup.fulfilled.type]: (state, action: PayloadAction<IGroup>) => {
			state.loadingGroups = false;
			state.errorLoadingGroups = null;
			state.allGroups = state.allGroups.concat(action.payload);
			state.isLoaded = false;
		},
		[createGroup.pending.type]: (state) => {
			state.loadingGroups = true;
			state.errorLoadingGroups = null;
		},
		[createGroup.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingGroups = false;
			state.errorLoadingGroups = action.payload;
		},
		[editGroup.fulfilled.type]: (state, action) => {
			state.loadingGroups = false;
			state.errorLoadingGroups = null;
			state.allGroups = state.allGroups.map((el) => (el.id === action.payload.id ? action.payload : el));
			state.group = action.payload;
		},
		[editGroup.pending.type]: (state) => {
			state.loadingGroups = true;
			state.errorLoadingGroups = null;
		},
		[editGroup.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingGroups = false;
			state.errorLoadingGroups = action.payload;
		},
		[deleteGroup.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loadingGroups = false;
			state.errorLoadingGroups = null;
			state.allGroups = state.allGroups.filter((group) => group?.id?.toString() !== action.payload.toString());
		},
		[deleteGroup.pending.type]: (state) => {
			state.loadingGroups = true;
			state.errorLoadingGroups = null;
		},
		[deleteGroup.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingGroups = false;
			state.errorLoadingGroups = action.payload;
		},
		[getUsersRequestedForJoing.fulfilled.type]: (state, action: PayloadAction<number[]>) => {
			state.loadingGroups = false;
			state.errorLoadingGroups = null;
			state.usersWhoSendRequest = action.payload;
		},
		[getUsersRequestedForJoing.pending.type]: (state) => {
			state.loadingGroups = true;
			state.errorLoadingGroups = null;
		},
		[getUsersRequestedForJoing.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingGroups = false;
			state.errorLoadingGroups = action.payload;
		},
		[acceptUserInviteRequest.fulfilled.type]: (state) => {
			state.loadingRequest = false;
			state.inviteAccepted = true;
			state.errorLoadingGroups = null;
		},
		[acceptUserInviteRequest.pending.type]: (state) => {
			state.loadingRequest = true;
			state.inviteAccepted = false;
			state.errorLoadingGroups = null;
		},
		[acceptUserInviteRequest.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingRequest = false;
			state.errorLoadingGroups = action.payload;
		},
		[uploadLogo.fulfilled.type]: (state, action: PayloadAction<IGroup>) => {
			state.loadingGroups = false;
			state.errorLoadingGroups = null;
			state.allGroups = state.allGroups.map((el) => (el.id === action.payload.id ? action.payload : el));
		},
		[uploadLogo.pending.type]: (state) => {
			state.loadingGroups = true;
			state.errorLoadingGroups = null;
		},
		[uploadLogo.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingGroups = false;
			state.errorLoadingGroups = action.payload;
		},
		[checkIfUserSendJoinRequest.fulfilled.type]: (state) => {
			state.loadingRequest = false;
			state.errorLoadingGroups = null;
		},
		[checkIfUserSendJoinRequest.pending.type]: (state) => {
			state.loadingRequest = true;
			state.errorLoadingGroups = null;
		},
		[checkIfUserSendJoinRequest.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingRequest = false;
			state.userSendRequestError = action.payload;
		},
		[leaveGroup.fulfilled.type]: (state) => {
			state.loadingRequest = false;
			state.errorLoadingGroups = null;
			state.isUserLeavedGroup = true;
		},
		[leaveGroup.pending.type]: (state) => {
			state.loadingRequest = true;
			state.errorLoadingGroups = null;
		},
		[leaveGroup.rejected.type]: (state) => {
			state.loadingRequest = false;
		},
	},
});

export const {
	setGroup,
	setGroupForTask,
	clearGroupReducer,
	chatOpened,
	addToAllGroups,
	changeNewGroupStatus,
	setModalOpened,
	setAction,
	clearGroups,
	clearRequests,
	addGroupMember,
	userLeavedGroup,
} = groupsReducer.actions;
export default groupsReducer.reducer;
