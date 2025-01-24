import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormFieldCode, IFormField } from '@uspacy/forms/lib/forms/models';

import { IState } from './types';

const initialState = {
	formFields: {
		fields: [],
		other: [],
	},
	form: {
		name: '',
		active: true,
		config: {
			fields: [],
			other: [],
		},
	},
} as IState;

const formsReducer = createSlice({
	name: 'filesReducer',
	initialState,
	reducers: {
		setFormFields: (state, action: PayloadAction<IState['formFields']>) => {
			state.formFields = action.payload;
		},
		toggleSelected: (state, action: PayloadAction<{ isOther: boolean; fieldCode: FormFieldCode; isRemove?: boolean }>) => {
			const { isOther, fieldCode, isRemove } = action.payload;
			const fields = isOther ? state.formFields.other : state.formFields.fields;
			const fieldIndex = fields.findIndex((field) => field.fieldCode === fieldCode);

			if (fieldIndex > -1) {
				const nextSelectedStatus = !fields[fieldIndex].selected;
				fields[fieldIndex].selected = isRemove ? false : nextSelectedStatus;

				if (isOther) {
					if (nextSelectedStatus && !isRemove) {
						state.form.config.other.push(fields[fieldIndex]);
					} else {
						state.form.config.other = state.form.config.other.filter((field) => field.fieldCode !== fieldCode);
					}
				} else {
					if (nextSelectedStatus && !isRemove) {
						state.form.config.fields.push(fields[fieldIndex] as IFormField);
					} else {
						state.form.config.fields = state.form.config.fields.filter((field) => field.fieldCode !== fieldCode);
					}
				}
			}
		},
		setFormConfigFields: (state, action: PayloadAction<IState['form']['config']['fields']>) => {
			state.form.config.fields = action.payload;
		},
		setFormConfigOther: (state, action: PayloadAction<IState['form']['config']['other']>) => {
			state.form.config.other = action.payload;
		},
	},
});

export const { setFormFields, toggleSelected, setFormConfigFields, setFormConfigOther } = formsReducer.actions;
export default formsReducer.reducer;
