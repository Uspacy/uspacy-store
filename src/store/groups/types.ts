import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IGroup } from '@uspacy/sdk/lib/models/groups';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

export interface IState {
	groups: IResponseWithMeta<IGroup>;
	group: IGroup;
	groupForTask: IGroup;
	loadingGroup: boolean;
	loadingGroupForTask: boolean;
	errorLoadingGroup: IErrorsAxiosResponse;
	errorLoadingGroupForTask: IErrorsAxiosResponse;
	loadingGroups: boolean;
	isLoaded: boolean;
	isChatOpened: boolean;
	errorLoadingGroups: IErrorsAxiosResponse;
	allGroups: IGroup[];
	isNewGroupCreate: boolean;
	modalOpened: { create: boolean; edit: boolean; confirm: boolean; invite: boolean };
	action: { archive: boolean; delete: boolean; chat: boolean; id: number };
	search: string;
	usersWhoSendRequest: number[];
	loadingRequest: boolean;
	inviteAccepted: boolean;
	userSendRequestError: string;
	isUserLeavedGroup: boolean;
	errorInviteUsers: boolean;
}
