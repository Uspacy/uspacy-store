import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IReindexJob } from '@uspacy/sdk/lib/models/reindex';

export interface IReindexModalState {
	openReindexJob: boolean;
	openModal: boolean;
	jobId: number | null;
}

export interface IState {
	reindexJobs: IReindexJob[];
	reindexJobsModalsOpen: Record<string, IReindexModalState>;
	loadingReindexJobs: boolean;
	loadingCreateReindexJob: boolean;
	loadingDeleteReindexJob: boolean;
	loadingRetryReindexJob: boolean;
	errorLoadingReindexJobs: IErrorsAxiosResponse;
	errorCreatingReindexJob: IErrorsAxiosResponse;
	errorDeletingReindexJob: IErrorsAxiosResponse;
	errorRetryingReindexJob: IErrorsAxiosResponse;
}
