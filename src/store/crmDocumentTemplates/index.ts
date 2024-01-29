import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	documentsGeneratorTypes,
	IDocumentTemplate,
	IDocumentTemplateFields,
	IDocumentTemplates,
} from '@uspacy/sdk/lib/models/crm-document-template';
import { IErrors } from '@uspacy/sdk/lib/models/crm-errors';
import { IDocumentTemplateFieldFilters, IDocumentTemplateFilters } from '@uspacy/sdk/lib/models/crm-filters';

import { createTemplate, deleteArrayTemplates, deleteTemplate, fetchDocumentTemplates, fetchDocumentTemplatesFields, updateTemplate } from './action';
import { IState } from './types';

export const defaultTemplate: Partial<IDocumentTemplate> = {
	name: '',
	is_active: true,
	binding_entities: [],
	access: {
		departments: [],
		users: [],
	},
	file: null,
	numerator_id: 0,
};

const initialState = {
	documentTemplates: {
		data: [],
		meta: {},
		total_templates_count: 0,
	},
	documentTemplatesFilters: {
		page: 1,
		list: 20,
		binding_entities_template: [],
		updated_at: [],
		created_at: [],
		createdAtCertainDateOrPeriod: [],
		updatedAtCertainDateOrPeriod: [],
		search: '',
		create_between: [],
		is_active: [],
		update_between: [],
	},
	template: defaultTemplate,
	documentTemplatesFields: {
		data: [],
		meta: {},
	},
	documentTemplatesFieldsFilters: {
		page: 1,
		list: 20,
		binding_entities: [],
		search: '',
	},
	loadingDocumentTemplate: false,
	loadingDocumentTemplates: false,
	loadingDocumentTemplatesFields: false,
	error: null,
} as IState;

const documentTemplatesReducer = createSlice({
	name: 'documentTemplates',
	initialState,
	reducers: {
		changeFilterByType: (
			state,
			action: PayloadAction<{
				type: documentsGeneratorTypes;
				key: keyof (IDocumentTemplateFilters & IDocumentTemplateFieldFilters);
				value: (IDocumentTemplateFilters & IDocumentTemplateFieldFilters)[keyof (IDocumentTemplateFilters & IDocumentTemplateFieldFilters)];
			}>,
		) => {
			state[`${action.payload.type}Filters`][action.payload.key] = action.payload.value;
		},
		changeFiltersByType: (
			state,
			action: PayloadAction<{ type: documentsGeneratorTypes; filters: IDocumentTemplateFilters & IDocumentTemplateFieldFilters }>,
		) => {
			state[`${action.payload.type}Filters`] = action.payload.filters;
		},
		clearFilterByType: (state, action: PayloadAction<{ type: documentsGeneratorTypes }>) => {
			state[`${action.payload.type}Filters`] = initialState[`${action.payload.type}Filters`];
		},
		fillTemplate: (state, action: PayloadAction<{ item: Partial<IDocumentTemplate> }>) => {
			state.template = action.payload.item;
		},
		changeTemplate: (state, action: PayloadAction<{ item: Partial<IDocumentTemplate> }>) => {
			state.template = { ...state.template, ...action.payload.item };
		},
		toDefaultTemplate: (state) => {
			state.template = defaultTemplate;
		},
		changeFilesTemplate: (state, action: PayloadAction<{ items: IDocumentTemplate[] }>) => {
			state.documentTemplates.data = action.payload.items;
		},
	},
	extraReducers: {
		[fetchDocumentTemplates.fulfilled.type]: (state, action: PayloadAction<IDocumentTemplates>) => {
			state.loadingDocumentTemplates = false;
			state.error = null;
			state.documentTemplates = action.payload;
		},
		[fetchDocumentTemplates.pending.type]: (state) => {
			state.loadingDocumentTemplates = true;
			state.error = null;
		},
		[fetchDocumentTemplates.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingDocumentTemplates = false;
			state.error = action.payload;
		},
		[fetchDocumentTemplatesFields.fulfilled.type]: (state, action: PayloadAction<IDocumentTemplateFields>) => {
			state.loadingDocumentTemplatesFields = false;
			state.error = null;
			state.documentTemplatesFields = action.payload;
		},
		[fetchDocumentTemplatesFields.pending.type]: (state) => {
			state.loadingDocumentTemplatesFields = true;
			state.error = null;
		},
		[fetchDocumentTemplatesFields.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingDocumentTemplatesFields = false;
			state.error = action.payload;
		},
		[createTemplate.fulfilled.type]: (state, action: PayloadAction<IDocumentTemplate>) => {
			state.loadingDocumentTemplate = false;
			state.error = null;
			state.documentTemplates = {
				meta: { ...state.documentTemplates.meta, total: state.documentTemplates.meta.total + 1 },
				data: [action.payload, ...state.documentTemplates.data],
				total_templates_count: state.documentTemplates.total_templates_count + 1,
			};
			state.template = defaultTemplate;
		},
		[createTemplate.pending.type]: (state) => {
			state.loadingDocumentTemplate = true;
			state.error = null;
		},
		[createTemplate.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingDocumentTemplate = false;
			state.error = action.payload;
		},
		[updateTemplate.fulfilled.type]: (state, action: PayloadAction<IDocumentTemplate>) => {
			state.loadingDocumentTemplate = false;
			state.error = null;
			state.documentTemplates = {
				meta: state.documentTemplates.meta,
				data: state.documentTemplates.data.map((it) => (it.id === action.payload.id ? action.payload : it)),
				total_templates_count: state.documentTemplates.total_templates_count,
			};
			state.template = defaultTemplate;
		},
		[updateTemplate.pending.type]: (state) => {
			state.loadingDocumentTemplate = true;
			state.error = null;
		},
		[updateTemplate.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingDocumentTemplate = false;
			state.error = action.payload;
		},
		[deleteTemplate.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loadingDocumentTemplate = false;
			state.error = null;
			state.documentTemplates = {
				meta: { ...state.documentTemplates.meta, total: state.documentTemplates.meta.total - 1 },
				data: state.documentTemplates.data.filter((it) => it.id !== action.payload),
				total_templates_count: state.documentTemplates.total_templates_count - 1,
			};
			state.template = defaultTemplate;
		},
		[deleteTemplate.pending.type]: (state) => {
			state.loadingDocumentTemplate = true;
			state.error = null;
		},
		[deleteTemplate.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingDocumentTemplate = false;
			state.error = action.payload;
		},
		[deleteArrayTemplates.fulfilled.type]: (state, action: PayloadAction<number[]>) => {
			state.loadingDocumentTemplate = false;
			state.error = null;
			state.documentTemplates = {
				meta: { ...state.documentTemplates.meta, total: state.documentTemplates.meta.total - action.payload.length },
				data: state.documentTemplates.data.filter((it) => !action.payload.includes(it.id)),
				total_templates_count: state.documentTemplates.total_templates_count + action.payload.length,
			};
			state.template = defaultTemplate;
		},
		[deleteArrayTemplates.pending.type]: (state) => {
			state.loadingDocumentTemplate = true;
			state.error = null;
		},
		[deleteArrayTemplates.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingDocumentTemplate = false;
			state.error = action.payload;
		},
	},
});

export const { clearFilterByType, changeFiltersByType, changeFilterByType, fillTemplate, changeTemplate, toDefaultTemplate, changeFilesTemplate } =
	documentTemplatesReducer.actions;
export default documentTemplatesReducer.reducer;
