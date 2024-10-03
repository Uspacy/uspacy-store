import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IHistoryResponse } from '@uspacy/sdk/lib/models/history';

export interface IState {
	history: IHistoryResponse;
	loadingHistory: boolean;
	errorLoadingErrors: IErrorsAxiosResponse;
}
