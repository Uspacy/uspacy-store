import { IApp } from '@uspacy/sdk/lib/models/app';
import { IMeta } from '@uspacy/sdk/lib/models/response';

export interface IState {
	data: IApp[];
	meta?: IMeta;
	loading: boolean;
	errorMessage: string;
}
