import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormFieldCode, IFormField, IFormOther } from '@uspacy/forms/lib/forms/models';

import { IForm, IState, RequireOnlyOne } from './types';

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
		addFormConfigFields: (state, action: PayloadAction<IFormField>) => {
			state.form.config.fields.push(action.payload);
		},
		setFormConfigOther: (state, action: PayloadAction<IFormOther[]>) => {
			state.form.config.other = action.payload;
		},
		updateFieldSettings: (state, action: PayloadAction<RequireOnlyOne<IFormField, 'fieldCode'>>) => {
			const fieldIndex = state.form.config.fields.findIndex((field) => field.fieldCode === action.payload.fieldCode);
			if (fieldIndex > -1) {
				state.form.config.fields[fieldIndex] = { ...state.form.config.fields[fieldIndex], ...action.payload };
			}
		},
		updateFieldOtherSettings: (state, action: PayloadAction<RequireOnlyOne<IFormOther, 'fieldCode'>>) => {
			const fieldIndex = state.form.config.other.findIndex((field) => field.fieldCode === action.payload.fieldCode);
			if (fieldIndex > -1) {
				state.form.config.other[fieldIndex] = { ...state.form.config.other[fieldIndex], ...action.payload };
			}
		},
		addForm: (state, action: PayloadAction<IForm>) => {
			state.formsList.push(action.payload);
		},
		removeForm: (state, action: PayloadAction<IForm['id']>) => {
			state.formsList = state.formsList.filter((form) => form.id !== action.payload);
		},
		updateFormData: (state, action: PayloadAction<RequireOnlyOne<IForm, 'id'>>) => {
			state.form = { ...state.form, ...action.payload };
		},
	},
});

export const { setFormFields, toggleSelected, addFormConfigFields, setFormConfigOther, updateFieldSettings, updateFieldOtherSettings } =
	formsReducer.actions;
export default formsReducer.reducer;
