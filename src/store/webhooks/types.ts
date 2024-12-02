import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IWebhook, IWebhooksResponse } from '@uspacy/sdk/lib/models/webhooks';

export interface IState {
	webhooks: IWebhooksResponse;
	webhook: IWebhook;
	modalModes: IMode;
	isModalOpen: boolean;
	loadingWebhooks: boolean;
	errorLoadingErrors: IErrorsAxiosResponse;
}

export interface IMode {
	create: boolean;
	edit: boolean;
	copy: boolean;
	view: boolean;
	isIncoming: boolean;
}
