import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IGroup, IGroups } from '@uspacy/sdk/lib/models/groups';

export interface IState {
	groups: IGroups;
	group: IGroup;
	loadingGroup: boolean;
	errorLoadingGroup: IErrorsAxiosResponse;
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
}
