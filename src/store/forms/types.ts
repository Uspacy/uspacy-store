import { IFormField, IFormOther } from '@uspacy/forms/lib/forms/models';

export interface IForm {
	id?: string;
	name: string;
	active: boolean;
	crmEntity: 'lead' | 'contact';
	config: {
		fields: IFormField[];
		other: IFormOther[];
	};
}

export interface IState {
	formFields: {
		fields: IFormField[];
		other: IFormOther[];
	};
	form: IForm;
	formsList: IForm[];
}

export type RequireOnlyOne<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;
