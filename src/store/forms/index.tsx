import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormFieldCode, IForm, IFormDesign, IFormField, IFormOther, IPredefinedField } from '@uspacy/sdk/lib/models/forms';

import { updateFieldsOrderHelp } from '../../helpers/forms';
import { getForms } from './actions';
import { IState, RequireOnlyOne } from './types';

export const initialDesignState: IFormDesign = {
	generalColors: {
		pageBg: '#9155FD0A',
		formBg: '',
	},
	button: {
		style: 'contained',
		borderRadius: 6,
		size: 'medium',
		textSize: 16,
		textLetterSpacing: 'standard',
	},
	fields: {
		style: 'outlined',
		borderRadius: 6,
		size: 'small',
		textSize: 14,
		hideFieldLabel: false,
	},
	additional: {
		formPosition: 'center',
		showUspacyBrand: true,
	},
	otherSettings: {
		logoIsInTheFormHeader: false,
	},
};

const initialFormState: IState['form'] = {
	name: '',
	active: true,
	config: {
		crmEntity: 'lead',
		fields: [],
		other: [],
		predefinedFields: [],
		after: {
			showMessage: true,
			fields: [],
			redirectUrl: null,
			timeBeforeRedirect: null,
		},
		design: initialDesignState,
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
						const maxFieldOrder = Math.max(...state.form.config.fields.map((field) => field.order), -1);
						const addFieldButtonOrder = state.form.config.other.find((it) => it.fieldCode === 'addFieldButton')?.order - 1 || 0;
						let orderSeparatorCount = maxFieldOrder < 0 ? addFieldButtonOrder : maxFieldOrder;
						state.form.config.fields.push({ ...fields[fieldIndex], order: ++orderSeparatorCount } as IFormField);
						state.form.config.other = state.form.config.other.map((it) => {
							if (it.order >= orderSeparatorCount) {
								return { ...it, order: ++orderSeparatorCount };
							}
							return it;
						});
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
		addPredefinedField: (state, action: PayloadAction<IPredefinedField>) => {
			state.form.config.predefinedFields.push(action.payload);
		},
		removePredefinedField: (state, action: PayloadAction<IPredefinedField['type']>) => {
			state.form.config.predefinedFields = state.form.config.predefinedFields.filter((field) => field.type !== action.payload);
		},
		updateFieldsOrder: (state, action: PayloadAction<{ sortedArr: string[]; isScreenAfterSend?: boolean; isOutsideSort?: boolean }>) => {
			const { sortedArr, isScreenAfterSend, isOutsideSort } = action.payload;

			if (isScreenAfterSend) {
				state.form.config.after.fields = updateFieldsOrderHelp(state.form.config.after.fields, sortedArr);
			} else {
				state.form.config.other = updateFieldsOrderHelp(state.form.config.other, sortedArr);
				if (!isOutsideSort) state.form.config.fields = updateFieldsOrderHelp(state.form.config.fields, sortedArr);
			}
		},
		updateAfterScreenSettings: (state, action: PayloadAction<Partial<IForm['config']['after']>>) => {
			state.form.config.after = { ...state.form.config.after, ...action.payload };
		},
		updateAfterScreenField: (state, action: PayloadAction<RequireOnlyOne<IFormOther, 'fieldCode'>>) => {
			const fieldIndex = state.form.config.after.fields.findIndex((field) => field.fieldCode === action.payload.fieldCode);
			if (fieldIndex === -1) {
				state.form.config.after.fields.push(action.payload);
			} else {
				state.form.config.after.fields[fieldIndex] = { ...state.form.config.after.fields[fieldIndex], ...action.payload };
			}
		},
		removeAfterScreenField: (state, action: PayloadAction<IFormOther['fieldCode']>) => {
			state.form.config.after.fields = state.form.config.after.fields.filter((field) => field.fieldCode !== action.payload);
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		updateDesignSettings: (state, action: PayloadAction<{ groupKey: keyof IForm['config']['design']; value: any }>) => {
			const { groupKey, value } = action.payload;

			state.form.config.design[groupKey] = { ...state.form.config.design[groupKey], ...value };
		},
	},
	extraReducers: {
		[getForms.fulfilled.type]: (state, action: PayloadAction<IForm[]>) => {
			state.loadFormsList = false;
			state.formsList = Array.isArray(action.payload) ? action.payload : [];
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
	updateFieldsOrder,
	updateAfterScreenSettings,
	updateAfterScreenField,
	removeAfterScreenField,
	updateDesignSettings,
	removePredefinedField,
	addPredefinedField,
} = formsReducer.actions;
export default formsReducer.reducer;
