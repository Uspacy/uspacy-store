import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IReindexJob } from '@uspacy/sdk/lib/models/reindex';

export interface IState {
	reindexJobs: IReindexJob[];
	loadingReindexJobs: boolean;
	loadingCreateReindexJob: boolean;
	loadingDeleteReindexJob: boolean;
	loadingRetryReindexJob: boolean;
	errorLoadingReindexJobs: IErrorsAxiosResponse;
	errorCreatingReindexJob: IErrorsAxiosResponse;
	errorDeletingReindexJob: IErrorsAxiosResponse;
	errorRetryingReindexJob: IErrorsAxiosResponse;
}
