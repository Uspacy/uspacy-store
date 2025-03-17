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
}

export type RequireOnlyOne<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;
