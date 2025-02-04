/* eslint-disable @typescript-eslint/no-explicit-any */
// import { IFormField, IFormOther } from '@uspacy/forms/lib/forms/models';

export interface IForm {
	id?: string;
	name: string;
	active: boolean;
	crmEntity: 'lead' | 'contact';
	config: {
		// потім повернути
		// fields: IFormField[];
		// other: IFormOther[];
		fields: any[];
		other: any[];
	};
}

export interface IState {
	formFields: {
		// потім повернути
		// fields: IFormField[];
		// other: IFormOther[];
		fields: any[];
		other: any[];
	};
	form: IForm;
	formsList: IForm[];
	showSaveButton: boolean;
}

export type RequireOnlyOne<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;
