import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormFieldCode, IFormField, IPredefinedField } from '@uspacy/sdk/lib/models/forms';
import { ETimeFormShow, ICreateWidgetData } from '@uspacy/sdk/lib/models/messenger';
import { IMeta } from '@uspacy/sdk/lib/models/tasks';

import { updateFieldsOrderHelp } from '../../helpers/forms';
import { RequireOnlyOne } from '../forms/types';
import { createWidget, deleteWidget, getWidgets, updateWidget } from './actions';
import { IState } from './types';

const initialState: IState = {
	widgetData: {
		name: '',
		nameExternalLine: '',
		settings: {
			icon: null,
			welcomeMessage: '',
			iconColor: '',
			backgroundColor: '',
			operatorName: '',
			operatorAvatar: '',
		},
		config: {
			crmEntity: 'lead',
			fields: [],
			predefinedFields: [],
			showForm: false,
			timeShowForm: ETimeFormShow.FIRST_TIME,
			formWelcomeMessage: '',
		},
	},
	fields: [],
	widgetsList: [],
	meta: {
		currentPage: 1,
		from: 0,
		lastPage: 1,
		perPage: 0,
		to: 0,
		total: 0,
	},
	loading: false,
	showSaveButton: false,
};

export const widgetsSlice = createSlice({
	name: 'widgets',
	initialState,
	reducers: {
		setWidgetData: (state, action: PayloadAction<ICreateWidgetData>) => {
			state.widgetData = { ...state.widgetData, ...action.payload };
		},
		updateWidgetData: (
			state,
			action: PayloadAction<{ type: 'body' | 'settings'; data: Partial<ICreateWidgetData>['settings'] | Partial<ICreateWidgetData> }>,
		) => {
			const { type, data } = action.payload;
			if (type === 'body') {
				state.widgetData = { ...state.widgetData, ...data };
			} else if (type === 'settings') {
				state.widgetData.settings = { ...state.widgetData.settings, ...data };
			}
		},
		setWidgetFields: (state, action: PayloadAction<IState['fields']>) => {
			state.fields = action.payload;
		},
		setShowSaveButton: (state, action: PayloadAction<boolean>) => {
			state.showSaveButton = action.payload;
		},
		clearWidgetConfigFields: (state) => {
			state.widgetData.config.fields = [];
		},
		toggleSelected: (state, action: PayloadAction<{ fieldCode: FormFieldCode; isRemove?: boolean }>) => {
			const { fieldCode, isRemove } = action.payload;
			const fieldIndex = state.fields.findIndex((field) => field.fieldCode === fieldCode);

			if (fieldIndex > -1) {
				const fieldData = state.fields[fieldIndex];
				const nextSelectedStatus = !fieldData.selected;
				fieldData.selected = isRemove ? false : nextSelectedStatus;

				if (nextSelectedStatus && !isRemove) {
					let maxFieldOrder = Math.max(...state.widgetData.config.fields.map((field) => field.order), -1);
					state.widgetData.config.fields.push({ ...fieldData, order: ++maxFieldOrder } as IFormField);
				} else {
					state.widgetData.config.fields = state.widgetData.config.fields.filter((field) => field.fieldCode !== fieldCode);
				}
			}
		},
		addLocalWidgetField: (state, action: PayloadAction<IFormField>) => {
			let maxFieldOrder = Math.max(...state.widgetData.config.fields.map((field) => field.order), -1);
			state.widgetData.config.fields.push({ ...action.payload, order: ++maxFieldOrder } as IFormField);
		},
		removeLocalWidgetField: (state, action: PayloadAction<FormFieldCode>) => {
			state.widgetData.config.fields = state.widgetData.config.fields.filter((field) => field.fieldCode !== action.payload);
		},
		updateWidgetSettings: (state, action: PayloadAction<RequireOnlyOne<IFormField, 'fieldCode'>>) => {
			const fieldIndex = state.widgetData.config.fields.findIndex((field) => field.fieldCode === action.payload.fieldCode);
			if (fieldIndex > -1) {
				state.widgetData.config.fields[fieldIndex] = { ...state.widgetData.config.fields[fieldIndex], ...action.payload };
			}
		},
		updateWidgetFieldsOrder: (state, action: PayloadAction<{ sortedArr: string[] }>) => {
			const { sortedArr } = action.payload;

			state.widgetData.config.fields = updateFieldsOrderHelp(state.widgetData.config.fields, sortedArr);
		},
		setPredefinedWidgetFields: (state, action: PayloadAction<IPredefinedField>) => {
			const findIndex = state.widgetData.config.predefinedFields.findIndex((field) => field.type === action.payload.type);
			if (findIndex !== -1) {
				state.widgetData.config.predefinedFields[findIndex] = action.payload;
			} else {
				state.widgetData.config.predefinedFields.push(action.payload);
			}
		},
		addPredefinedWidgetField: (state, action: PayloadAction<IPredefinedField>) => {
			state.widgetData.config.predefinedFields.push(action.payload);
		},
		removePredefinedWidgetField: (state, action: PayloadAction<IPredefinedField['type']>) => {
			state.widgetData.config.predefinedFields = state.widgetData.config.predefinedFields.filter((field) => field.type !== action.payload);
		},
		updateConfigShowForm: (state, action: PayloadAction<ICreateWidgetData['config']['showForm']>) => {
			state.widgetData.config.showForm = action.payload;
		},
		updateConfigTimeShowForm: (state, action: PayloadAction<ICreateWidgetData['config']['timeShowForm']>) => {
			state.widgetData.config.timeShowForm = action.payload;
		},
		updateConfigFormWelcomeMessage: (state, action: PayloadAction<ICreateWidgetData['config']['formWelcomeMessage']>) => {
			state.widgetData.config.formWelcomeMessage = action.payload;
		},
		updateCrmEntity: (state, action: PayloadAction<ICreateWidgetData['config']['crmEntity']>) => {
			state.widgetData.config.crmEntity = action.payload;
		},
	},
	extraReducers: {
		[createWidget.pending.type]: (state) => {
			state.loading = true;
		},
		[createWidget.rejected.type]: (state) => {
			state.loading = false;
		},
		[createWidget.fulfilled.type]: (state, action: PayloadAction<ICreateWidgetData>) => {
			state.widgetsList = [...state.widgetsList, action.payload];
			state.meta.total = state.meta.total + 1;
			state.loading = false;
		},
		[getWidgets.pending.type]: (state) => {
			state.loading = true;
		},
		[getWidgets.rejected.type]: (state) => {
			state.loading = false;
		},
		[getWidgets.fulfilled.type]: (state, action: PayloadAction<{ data: ICreateWidgetData[]; meta: IMeta }>) => {
			state.widgetsList = action.payload.data;
			state.meta = action.payload.meta;
			state.loading = false;
		},
		[deleteWidget.fulfilled.type]: (state, action: PayloadAction<ICreateWidgetData>) => {
			state.widgetsList = state.widgetsList.filter((it) => it.id !== action.payload.id);
		},
		[updateWidget.fulfilled.type]: (state, action: PayloadAction<ICreateWidgetData>) => {
			state.widgetsList = state.widgetsList.map((it) => {
				if (it.id === action.payload.id) return action.payload;
				return it;
			});
		},
	},
});

export const {
	setWidgetData,
	updateWidgetData,
	setWidgetFields,
	toggleSelected,
	setShowSaveButton,
	clearWidgetConfigFields,
	updateWidgetSettings,
	updateWidgetFieldsOrder,
	setPredefinedWidgetFields,
	addPredefinedWidgetField,
	removePredefinedWidgetField,
	updateConfigShowForm,
	updateConfigTimeShowForm,
	updateConfigFormWelcomeMessage,
	addLocalWidgetField,
	removeLocalWidgetField,
	updateCrmEntity,
} = widgetsSlice.actions;

export default widgetsSlice.reducer;
