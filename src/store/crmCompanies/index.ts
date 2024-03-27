import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICardBlock } from '@uspacy/sdk/lib/models/crm-card-blocks';
import { IEntity, IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { IFilterPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { ICompanyFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { IField, IFields } from '@uspacy/sdk/lib/models/field';

import { idColumn, OTHER_DEFAULT_FIELDS } from './../../const';
import { getField } from './../../helpers/filterFieldsArrs';
import {
	createCompany,
	createCompanyField,
	deleteCompany,
	deleteCompanyField,
	deleteCompanyListValues,
	fetchCompanies,
	fetchCompaniesWithFilters,
	fetchFieldsForCompany,
	massCompaniesDeletion,
	massCompaniesEditing,
	updateCompany,
	updateCompanyField,
	updateCompanyListValues,
} from './actions';
import { IState } from './types';

const initialCompaniesFilterPreset = {
	isNewPreset: false,
	currentPreset: {},
	standardPreset: {},
	filterPresets: [],
};

const initialCompanies = {
	data: [],
	meta: {
		total: 0,
		from: 0,
		per_page: 0,
		list: 0,
	},
	aborted: false,
};

export const initialCompaniesFilter: ICompanyFilters = {
	company_label: [],
	source: [],
	period: [],
	time_label: [],
	certainDateOrPeriod: [],
	owner: [],
	deals: [],
	openDatePicker: false,
	search: '',
	page: 0,
	perPage: 0,
	boolean_operator: '',
	table_fields: [],
};

const initialState = {
	companies: initialCompanies,
	company: {},
	companyFields: {
		data: [],
	},
	companyFilters: {},
	companyFiltersPreset: initialCompaniesFilterPreset,
	errorMessage: '',
	loading: false,
	loadingCompanyList: true,
	loadingCompanyFields: true,
	cardBlocks: [],
} as IState;

const requisite = {
	name: 'requisite',
	code: 'requisites',
	required: false,
	editable: false,
	show: true,
	hidden: false,
	multiple: false,
	type: 'requisite',
	fieldSectionId: '',
	system_field: true,
	base_field: true,
	sort: '',
	defaultValue: '',
};

export const companiesReducer = createSlice({
	name: 'companies',
	initialState,
	reducers: {
		changeFilterCompany: (state, action: PayloadAction<{ key: string; value: ICompanyFilters[keyof ICompanyFilters] }>) => {
			state.companyFilters[action.payload.key] = action.payload.value;
		},
		changeItemsFilterCompany: (state, action: PayloadAction<ICompanyFilters>) => {
			state.companyFilters = action.payload;
		},
		clearCompanies: (state) => {
			state.companies = initialCompanies;
			state.loadingCompanyList = true;
		},
		clearCompanyFilters: (state) => {
			if (!!Object.keys(state.companyFields.data)?.length) {
				state.companyFilters = {
					...state.companyFields.data.reduce((acc, it) => ({ ...acc, ...getField(it) }), {}),
					...OTHER_DEFAULT_FIELDS,
					table_fields: state?.companyFilters?.table_fields || [],
					page: 1,
					perPage: 20,
				};
			}
		},
		setIsNewPreset: (state, action: PayloadAction<boolean>) => {
			state.companyFiltersPreset.isNewPreset = action.payload;
		},
		setCurrentPreset: (state, action: PayloadAction<IFilterPreset>) => {
			state.companyFiltersPreset.currentPreset = action.payload;
		},
		setStandardPreset: (state, action: PayloadAction<IFilterPreset>) => {
			state.companyFiltersPreset.standardPreset = action.payload;
		},
		setFilterPresets: (state, action: PayloadAction<IFilterPreset[]>) => {
			state.companyFiltersPreset.filterPresets = action.payload;
		},
		setCardBlocks: (state, action: PayloadAction<ICardBlock[]>) => {
			state.cardBlocks = action.payload;
		},
	},
	extraReducers: {
		[fetchCompanies.fulfilled.type]: (state, action: PayloadAction<IEntity>) => {
			state.loadingCompanyList = false;
			state.errorMessage = '';
			state.companies = action.payload;
		},
		[fetchCompanies.pending.type]: (state) => {
			state.loadingCompanyList = true;
			state.errorMessage = '';
		},
		[fetchCompanies.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingCompanyList = false;
			state.errorMessage = action.payload;
		},
		[createCompany.fulfilled.type]: (state, action: PayloadAction<IEntityData>) => {
			state.loading = false;
			state.errorMessage = '';
			state.companies.data.unshift(action.payload);
			state.companies.meta.total = ++state.companies.meta.total;
		},
		[createCompany.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createCompany.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[updateCompany.fulfilled.type]: (state, action: PayloadAction<IEntityData>) => {
			state.loading = false;
			state.errorMessage = '';
			state.companies.data = state.companies.data.map((company) => {
				if (company.id === action.payload.id) {
					return action.payload;
				}
				return company;
			});
		},
		[updateCompany.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[updateCompany.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteCompany.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loading = false;
			state.errorMessage = '';
			state.companies.data = state.companies.data.filter((company) => company.id !== action.payload);
		},
		[deleteCompany.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteCompany.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[massCompaniesDeletion.fulfilled.type]: (state, action: PayloadAction<IMassActions>) => {
			state.loading = false;
			state.loadingCompanyList = false;
			state.errorMessage = '';
			state.companies.data = state.companies.data.filter((item) => !action.payload.entityIds.includes(item?.id));

			if (action.payload.all) {
				state.companies.meta.total = 0;
			} else if (action.payload.all && action.payload.exceptIds.length) {
				state.companies.meta.total = action.payload.exceptIds.length;
			} else {
				state.companies.meta.total = state.companies.meta.total - action.payload.entityIds.length;
			}
		},
		[massCompaniesDeletion.pending.type]: (state) => {
			state.loading = true;
			state.loadingCompanyList = true;
			state.errorMessage = '';
		},
		[massCompaniesDeletion.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingCompanyList = false;
			state.errorMessage = action.payload;
		},
		[massCompaniesEditing.fulfilled.type]: (state) => {
			state.loading = false;
			state.errorMessage = '';
		},
		[massCompaniesEditing.pending.type]: (state) => {
			state.loading = true;
			state.loadingCompanyList = true;
			state.errorMessage = '';
		},
		[massCompaniesEditing.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingCompanyList = false;
			state.errorMessage = action.payload;
		},
		[fetchCompaniesWithFilters.fulfilled.type]: (state, action: PayloadAction<IEntity>) => {
			state.loadingCompanyList = action.payload.aborted;
			state.errorMessage = '';
			state.companies = action.payload.aborted ? state.companies : action.payload;
		},
		[fetchCompaniesWithFilters.pending.type]: (state) => {
			state.loadingCompanyList = true;
			state.errorMessage = '';
		},
		[fetchCompaniesWithFilters.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingCompanyList = false;
			state.errorMessage = action.payload;
		},
		[fetchFieldsForCompany.fulfilled.type]: (state, action: PayloadAction<IFields>) => {
			state.loading = false;
			state.loadingCompanyFields = false;
			state.errorMessage = '';
			state.companyFields = action.payload;
			state.companyFields.data.forEach((field) => {
				field?.values?.sort((a, b) => a.sort - b.sort);
			});
			// @ts-ignore
			state.companyFields.data.splice(2, 0, requisite);
			state.companyFields.data.splice(0, 0, idColumn);
			// TODO wait api
			// state.companyFields.data.splice(0, 0, dealsField);
			if (!Object.keys(state.companyFilters)?.length) {
				state.companyFilters = {
					...state.companyFields.data.reduce((acc, it) => ({ ...acc, ...getField(it) }), {}),
					...OTHER_DEFAULT_FIELDS,
				};
			}
		},
		[fetchFieldsForCompany.pending.type]: (state) => {
			state.loading = true;
			state.loadingCompanyFields = true;
			state.errorMessage = '';
		},
		[fetchFieldsForCompany.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingCompanyFields = false;
			state.errorMessage = action.payload;
		},
		[updateCompanyField.fulfilled.type]: (state, action: PayloadAction<IField>) => {
			state.loading = false;
			state.errorMessage = '';
			state.companyFields.data = state.companyFields.data.map((field) => {
				if (field.code === action.payload.code) {
					return { ...action.payload, values: action?.payload?.values || field?.values };
				}
				return field;
			});
		},
		[updateCompanyField.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[updateCompanyField.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[updateCompanyListValues.fulfilled.type]: (state, action: PayloadAction<IField>) => {
			state.loading = false;
			state.errorMessage = '';
			state.companyFields.data = state.companyFields.data.map((field) => {
				if (field.code === action.payload.code) {
					field = action.payload;
					field.values.sort((a, b) => a.sort - b.sort);
				}
				return field;
			});
		},
		[updateCompanyListValues.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[updateCompanyListValues.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createCompanyField.fulfilled.type]: (state, action: PayloadAction<IField>) => {
			state.loading = false;
			state.errorMessage = '';
			state.companyFields.data.push(action.payload);
		},
		[createCompanyField.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createCompanyField.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteCompanyListValues.fulfilled.type]: (state, action: PayloadAction<{ fieldCode: string; value: string }>) => {
			state.loading = false;
			state.errorMessage = '';
			state.companyFields.data = state.companyFields.data.map((field) => {
				if (field.code === action.payload.fieldCode) {
					field.values = field.values.filter((value) => value.value !== action.payload.value);
				}
				return field;
			});
		},
		[deleteCompanyListValues.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteCompanyListValues.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteCompanyField.fulfilled.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = '';
			state.companyFields.data = state.companyFields.data.filter((field) => field.code !== action.payload);
		},
		[deleteCompanyField.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteCompanyField.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
	},
});

export const {
	changeFilterCompany,
	changeItemsFilterCompany,
	clearCompanies,
	clearCompanyFilters,
	setIsNewPreset,
	setCurrentPreset,
	setStandardPreset,
	setFilterPresets,
	setCardBlocks,
} = companiesReducer.actions;

export default companiesReducer.reducer;
