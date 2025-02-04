/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// import { FormFieldCode, IFormField, IFormOther } from '@uspacy/forms/lib/forms/models';
import { IForm, IState, RequireOnlyOne } from './types';

const testForm = {
	id: 'fcf4d645-5af7-4bf4-a3c9-fc78163ec8d3',
	name: 'форма для тестування',
	active: true,
	crmEntity: 'contact',
	config: {
		fields: [
			{
				order: 4,
				fieldCode: 'first_name',
				type: 'formTextData',
				label: 'Імя',
				hint: 'Імя',
				secondHintText: '',
				required: true,
				selected: true,
				field: {
					name: 'First name',
					code: 'first_name',
					entity_reference_id: '',
					type: 'string',
					required: false,
					editable: true,
					show: true,
					hidden: false,
					multiple: false,
					system_field: true,
					base_field: true,
					sort: '',
					default_value: '',
					tooltip: '',
					display_in_tabs: false,
					entity: 'contact',
				},
			},
			{
				order: 9,
				fieldCode: 'email',
				type: 'email',
				label: 'Електронна пошта',
				hint: 'Електронна пошта',
				secondHintText: '',
				required: true,
				selected: true,
				field: {
					name: 'Email',
					code: 'email',
					entity_reference_id: '',
					type: 'email',
					required: false,
					editable: true,
					show: true,
					hidden: false,
					multiple: true,
					system_field: true,
					base_field: true,
					sort: '',
					default_value: '',
					tooltip: '',
					display_in_tabs: false,
					entity: 'contact',
				},
			},
		],
		other: [
			{
				order: 0,
				fieldCode: 'logo',
				ico: {
					type: {},
					key: null,
					ref: null,
					props: {},
					_owner: null,
					_store: {},
				},
				previewTitle: 'Логотип',
				selected: true,
			},
			{
				order: 2,
				fieldCode: 'subheader',
				value: '<p class="PlaygroundEditorTheme__paragraph" style="text-align: center;"><span style="font-size: 14px; white-space: pre-wrap;">Заповніть форму, і ми з вами звʼяжемось</span></p>',
				ico: {
					type: {},
					key: null,
					ref: null,
					props: {},
					_owner: null,
					_store: {},
				},
				previewTitle: 'Підзаголовок',
				selected: true,
			},
			{
				fieldCode: 'privacyPolicy',
				ico: {
					type: {},
					key: null,
					ref: null,
					props: {},
					_owner: null,
					_store: {},
				},
				previewTitle: 'Згода на обробку даних',
				selected: true,
				order: 14,
			},
			{
				fieldCode: 'submitButton',
				previewTitle: '',
				order: 15,
			},
		],
	},
};
const testForm1 = {
	id: 'fcf4d645-5af7-4bf4-a3c9-fc78163ec8d3111111',
	name: 'форма для тестування1111',
	active: false,
	crmEntity: 'lead',
	config: {
		fields: [
			{
				order: 8,
				fieldCode: 'phone',
				type: 'phone',
				label: 'Телефон',
				hint: 'Телефон',
				secondHintText: '',
				required: true,
				selected: true,
				field: {
					name: 'Phone',
					code: 'phone',
					entity_reference_id: '',
					type: 'phone',
					required: false,
					editable: true,
					show: true,
					hidden: false,
					multiple: true,
					system_field: true,
					base_field: true,
					sort: '',
					default_value: '',
					tooltip: '',
					display_in_tabs: false,
					entity: 'contact',
				},
			},
		],
		other: [
			{
				order: 0,
				fieldCode: 'logo',
				ico: {
					type: {},
					key: null,
					ref: null,
					props: {},
					_owner: null,
					_store: {},
				},
				previewTitle: 'Логотип',
				selected: true,
			},
			{
				order: 1,
				fieldCode: 'header',
				value: '<p class="PlaygroundEditorTheme__paragraph" style="text-align: center;"><b><strong class="PlaygroundEditorTheme__textBold" style="font-size: 18px; white-space: pre-wrap;">Звʼяжіться з нами</strong></b></p>',
				ico: {
					type: {},
					key: null,
					ref: null,
					props: {},
					_owner: null,
					_store: {},
				},
				previewTitle: 'Заголовок',
				selected: true,
			},
			{
				fieldCode: 'privacyPolicy',
				ico: {
					type: {},
					key: null,
					ref: null,
					props: {},
					_owner: null,
					_store: {},
				},
				previewTitle: 'Згода на обробку даних',
				selected: true,
				order: 14,
			},
			{
				fieldCode: 'submitButton',
				previewTitle: '',
				order: 15,
			},
		],
	},
};

const initialFormState: IState['form'] = {
	name: '',
	active: true,
	crmEntity: 'lead',
	config: {
		fields: [],
		other: [],
	},
};

const initialState: IState = {
	formFields: {
		fields: [],
		other: [],
	},
	form: initialFormState,
	// formsList: [],
	formsList: [testForm, testForm1 as any],
	showSaveButton: false,
};

const formsReducer = createSlice({
	name: 'filesReducer',
	initialState,
	reducers: {
		setFormFields: (state, action: PayloadAction<IState['formFields']>) => {
			state.formFields = action.payload;
		},
		// toggleSelected: (state, action: PayloadAction<{ isOther: boolean; fieldCode: FormFieldCode; isRemove?: boolean }>) => {
		toggleSelected: (state, action: PayloadAction<{ isOther: boolean; fieldCode: any; isRemove?: boolean }>) => {
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
						// state.form.config.fields.push(fields[fieldIndex] as IFormField);
						state.form.config.fields.push(fields[fieldIndex] as any);
					} else {
						state.form.config.fields = state.form.config.fields.filter((field) => field.fieldCode !== fieldCode);
					}
				}
			}
		},
		// addFormConfigFields: (state, action: PayloadAction<IFormField>) => {
		addFormConfigFields: (state, action: PayloadAction<any>) => {
			state.form.config.fields.push(action.payload);
		},
		clearForm: (state) => {
			state.form = initialFormState;
		},
		clearFormConfigFields: (state) => {
			state.form.config.fields = [];
		},
		// setFormConfigOther: (state, action: PayloadAction<IFormOther[]>) => {
		setFormConfigOther: (state, action: PayloadAction<any[]>) => {
			state.form.config.other = action.payload;
		},
		// updateFieldSettings: (state, action: PayloadAction<RequireOnlyOne<IFormField, 'fieldCode'>>) => {
		updateFieldSettings: (state, action: PayloadAction<RequireOnlyOne<any, 'fieldCode'>>) => {
			const fieldIndex = state.form.config.fields.findIndex((field) => field.fieldCode === action.payload.fieldCode);
			if (fieldIndex > -1) {
				state.form.config.fields[fieldIndex] = { ...state.form.config.fields[fieldIndex], ...action.payload };
			}
		},
		// updateFieldOtherSettings: (state, action: PayloadAction<RequireOnlyOne<IFormOther, 'fieldCode'>>) => {
		updateFieldOtherSettings: (state, action: PayloadAction<RequireOnlyOne<any, 'fieldCode'>>) => {
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
} = formsReducer.actions;
export default formsReducer.reducer;
