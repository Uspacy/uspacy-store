import { ICardRequisites, ITemplate } from '@uspacy/sdk/lib/models/crm-requisite';

export interface IState {
	cardRequisites: ICardRequisites[];
	templates: ITemplate[];
	errorMessage: string;
	loading: {
		load: boolean;
		cardLoading: boolean;
		templateLoading: boolean;
		cardUpdateLoading: boolean;
		cardCreateLoading: boolean;
		cardDeleteLoading: boolean;
		cardAttachLoading: boolean;
	};
}
