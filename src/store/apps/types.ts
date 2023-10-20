import { IApp } from '@uspacy/sdk/lib/models/app';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IMeta } from '@uspacy/sdk/lib/models/response';

export interface IState {
	data: IApp[];
	meta?: IMeta;
	allApps: IApp[];
	app: IApp;
	loading: boolean;
	error: IErrorsAxiosResponse;
}
