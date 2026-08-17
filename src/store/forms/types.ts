import { IForm, IFormField, IFormOther } from '@uspacy/sdk/lib/models/forms';

export interface IState {
	formFields: {
		fields: IFormField[];
		other: IFormOther[];
	};
	form: IForm;
	formsList: IForm[];
	loadFormsList: boolean;
	showSaveButton: boolean;
	meta: IFormsMeta;
}

export type RequireOnlyOne<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;

export interface IFormsMeta {
	currentPage: number;
	total: number;
	totalActiveByPortal: number;
	totalActiveForUser: number;
	totalPages: number;
}
