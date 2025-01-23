import { IFormField, IFormOther } from '@uspacy/forms/lib/forms/models';

export interface IState {
	formFields: {
		fields: IFormField[];
		other: IFormOther[];
	};
}
