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
	inviteUsersInGroup,
	joinGroup,
	leaveGroup,
	uploadLogo,
	userApplyToJoinGroup,
} from './actions';
import { IState } from './types';

const initialState = {
	groups: {
		data: [],
	},
	group: {},
	groupForTask: {},
	loadingGroup: false,
	loadingGroupForTask: false,
	errorLoadingGroup: null,
	errorLoadingGroupForTask: null,
	isLoaded: false,
	isChatOpened: false,
	loadingGroups: true,
	errorLoadingGroups: null,
	allGroups: [],
	isNewGroupCreate: false,
	modalOpened: { create: false, edit: false, confirm: false, invite: false, inviteSended: false, about: false },
	action: { archive: false, delete: false, chat: false, id: null },
	search: '',
	usersWhoSendRequest: [],
	loadingRequest: false,
	inviteAccepted: false,
	userSendRequestError: '',
	isUserLeavedGroup: false,
	errorInviteUsers: null,
	loadingInvite: false,
	loadingApplyToJoin: false,
	errorLoadingApplyToJoinGrroup: false,
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
		clearGroups: (state) => {
			state.allGroups = initialState.allGroups;
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
			state.groups.data = state.groups.data.map((el) => (el.id.toString() === editedGroup.id.toString() ? editedGroup : el));
		},
		userJoinGroup: (state, action: PayloadAction<{ id: string; groupId: string }>) => {
			const editedGroup = state.allGroups.find((grp) => grp.id.toString() === action.payload.groupId);
			const addUser = editedGroup.usersIds.concat(action.payload.id);
			editedGroup.usersIds = addUser;
			state.allGroups = state.allGroups.map((el) => (el.id.toString() === editedGroup.id.toString() ? editedGroup : el));
			state.groups.data = state.groups.data.map((el) => (el.id.toString() === editedGroup.id.toString() ? editedGroup : el));
		},
		resetInviteError: (state) => {
			state.errorInviteUsers = false;
		},
		addGroupToEndTable: (state, action: PayloadAction<IGroup>) => {
			state.allGroups.push(action.payload);
		},
		deleteLastElementTable: (state) => {
			state.allGroups = state.allGroups.slice(0, -1);
		},
	},
	extraReducers: {
		[fetchGroups.fulfilled.type]: (state, action: PayloadAction<IResponseWithMeta<IGroup>>) => {
			state.loadingGroups = false;
			state.errorLoadingGroups = null;
			state.groups.data = action.payload.data;
			state.groups.meta = action.payload.meta;
			const includedGroup = state.allGroups.find((el) => action.payload.data.some((grp) => grp.name === el.name));
			const filteredGroups = !!includedGroup ? state.allGroups.filter((el) => el.name !== includedGroup.name) : state.allGroups;
			state.allGroups = !!state.allGroups.length ? filteredGroups.concat(action.payload.data) : state.allGroups.concat(action.payload.data);
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
			state.loadingGroupForTask = false;
			state.errorLoadingGroupForTask = null;
			state.groupForTask = action.payload;
		},
		[fetchGroupForTask.pending.type]: (state) => {
			state.loadingGroupForTask = true;
			state.errorLoadingGroupForTask = null;
		},
		[fetchGroupForTask.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingGroupForTask = false;
			state.errorLoadingGroupForTask = action.payload;
		},
		[createGroup.fulfilled.type]: (state, action: PayloadAction<IGroup>) => {
			state.loadingGroups = false;
			state.errorLoadingGroups = null;
			state.allGroups.unshift(action.payload);
			state.isLoaded = false;
			state.groups.meta.total = state.groups.meta.total + 1;
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
			state.groups.meta.total = state.groups.meta.total - 1;
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
			state.group.logo = action.payload.logo;
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
		[inviteUsersInGroup.fulfilled.type]: (state) => {
			state.loadingInvite = false;
			state.errorInviteUsers = false;
			state.modalOpened.invite = false;
			state.modalOpened.inviteSended = true;
		},
		[inviteUsersInGroup.pending.type]: (state) => {
			state.loadingInvite = true;
			state.errorInviteUsers = false;
		},
		[inviteUsersInGroup.rejected.type]: (state) => {
			state.loadingInvite = false;
			state.errorInviteUsers = true;
		},

		[joinGroup.fulfilled.type]: (state) => {
			state.loadingGroups = false;
			state.errorLoadingGroups = null;
			state.isUserLeavedGroup = true;
		},
		[joinGroup.pending.type]: (state) => {
			state.loadingGroups = true;
			state.errorLoadingGroups = null;
		},
		[joinGroup.rejected.type]: (state) => {
			state.loadingGroups = false;
		},
		[userApplyToJoinGroup.fulfilled.type]: (state) => {
			state.loadingApplyToJoin = false;
			state.errorLoadingApplyToJoinGrroup = false;
		},
		[userApplyToJoinGroup.pending.type]: (state) => {
			state.loadingApplyToJoin = true;
			state.errorLoadingApplyToJoinGrroup = false;
		},
		[userApplyToJoinGroup.rejected.type]: (state) => {
			state.loadingApplyToJoin = false;
			state.errorLoadingApplyToJoinGrroup = true;
		},
	},
});

export const {
	setGroup,
	setGroupForTask,
	clearGroupReducer,
	chatOpened,
	changeNewGroupStatus,
	setModalOpened,
	setAction,
	clearGroups,
	clearRequests,
	addGroupMember,
	userLeavedGroup,
	resetInviteError,
	userJoinGroup,
	addGroupToEndTable,
	deleteLastElementTable,
} = groupsReducer.actions;
export default groupsReducer.reducer;
