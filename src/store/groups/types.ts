import { IGroup } from '@uspacy/sdk/lib/models/groups';

export interface IState {
	group: IGroup;
	loadingGroup: boolean;
	errorLoadingGroup: string;
}
