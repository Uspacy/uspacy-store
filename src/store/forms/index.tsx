import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormFieldCode } from '@uspacy/forms/lib/forms/models';
import { IForm, IFormField, IFormOther, IPredefinedField } from '@uspacy/sdk/lib/models/forms';

import { getForms } from './actions';
import { IState, RequireOnlyOne } from './types';

const initialFormState: IState['form'] = {
	name: '',
	active: true,
	config: {
		crmEntity: 'lead',
		fields: [],
		other: [],
		predefinedFields: [],
	},
};

const initialState: IState = {
	formFields: {
		fields: [],
		other: [],
	},
	form: initialFormState,
	formsList: [],
	loadFormsList: false,
	showSaveButton: false,
};

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
		clearForm: (state) => {
			state.form = initialFormState;
		},
		clearFormConfigFields: (state) => {
			state.form.config.fields = [];
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
			state.formsList.unshift(action.payload);
		},
		removeForm: (state, action: PayloadAction<IForm['id']>) => {
			state.formsList = state.formsList.filter((form) => form.id !== action.payload);
		},
		updateFormData: (state, action: PayloadAction<Partial<IForm>>) => {
			state.form = { ...state.form, ...action.payload };
		},
		setShowSaveButton: (state, action: PayloadAction<boolean>) => {
			state.showSaveButton = action.payload;
		},
		updateFormInList: (state, action: PayloadAction<IForm>) => {
			const formIndex = state.formsList.findIndex((it) => it.id === action.payload.id);
			state.formsList[formIndex] = action.payload;
		},
		setPredefinedFields: (state, action: PayloadAction<IPredefinedField>) => {
			const findIndex = state.form.config.predefinedFields.findIndex((field) => field.type === action.payload.type);
			if (findIndex !== -1) {
				state.form.config.predefinedFields[findIndex] = action.payload;
			} else {
				state.form.config.predefinedFields.push(action.payload);
			}
		},
	},
	extraReducers: {
		[getForms.fulfilled.type]: (state, action: PayloadAction<IForm[]>) => {
			state.loadFormsList = false;
			state.formsList = action.payload;
		},
		[getForms.pending.type]: (state) => {
			state.loadFormsList = true;
		},
		[getForms.rejected.type]: (state) => {
			state.loadFormsList = false;
		},
	},
});

export const {
	setFormFields,
	toggleSelected,
	addFormConfigFields,
	clearFormConfigFields,
	setFormConfigOther,
	updateFieldSettings,
	updateFieldOtherSettings,
	updateFormData,
	clearForm,
	addForm,
	removeForm,
	setShowSaveButton,
	updateFormInList,
	setPredefinedFields,
} = formsReducer.actions;
export default formsReducer.reducer;
