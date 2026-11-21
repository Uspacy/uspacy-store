import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IMention, IMentionQuota } from '@uspacy/sdk/lib/models/mentions';

export interface IState {
	data: IMention[];
	quota: IMentionQuota | null;
	loading: boolean;
	/** true after the first successful load — lets consumers load mentions lazily once */
	loaded: boolean;
	error: IErrorsAxiosResponse | null;
}
