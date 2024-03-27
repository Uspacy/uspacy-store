/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { ICompanyFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { IField } from '@uspacy/sdk/lib/models/field';

import { getFilterParams } from './../../helpers/filterFieldsArrs';
import { makeURIParams } from './../../helpers/makeURIParams';

export const fetchCompanies = createAsyncThunk('companies/fetchCompanies', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmCompaniesService?.getCompanies();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createCompany = createAsyncThunk('companies/createCompany', async (data: Partial<IEntityData>, thunkAPI) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, ...rest } = data;
		const res = await uspacySdk.crmCompaniesService.createCompany(rest);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const updateCompany = createAsyncThunk('companies/updateCompany', async (data: IEntityData, thunkAPI) => {
	try {
		const { id, ...rest } = data;
		const res = await uspacySdk.crmCompaniesService.updateCompany(id, rest);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const deleteCompany = createAsyncThunk('companies/deleteCompany', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.crmCompaniesService.deleteCompany(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const massCompaniesDeletion = createAsyncThunk(
	'companies/massCompaniesDeletion',
	async ({ entityIds, exceptIds, all, params }: IMassActions, { rejectWithValue }) => {
		try {
			await uspacySdk.crmCompaniesService.massCompaniesDeletion({
				all,
				entityIds,
				exceptIds,
				params: all && params?.length ? `/?${params}` : '',
			});

			return { entityIds, exceptIds, all };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const massCompaniesEditing = createAsyncThunk(
	'companies/massCompaniesEditing',
	async ({ entityIds, exceptIds, all, params, payload, settings, profile, admin }: IMassActions, { rejectWithValue }) => {
		try {
			await uspacySdk.crmCompaniesService.massCompaniesEditing({
				all,
				entityIds,
				exceptIds,
				params: all && params?.length ? `/?${params}` : '',
				payload,
				settings,
			});

			return { entityIds, exceptIds, all, params, payload, settings, profile, admin };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const fetchCompaniesWithFilters = createAsyncThunk(
	'companies/fetchCompaniesWithFilters',
	async (
		data: {
			params: Omit<ICompanyFilters, 'openDatePicker'>;
			signal: AbortSignal;
			fields?: IField[];
			relatedEntityId?: string;
			relatedEntityType?: string;
		},
		thunkAPI,
	) => {
		try {
			const dealsArray = Array.isArray(data.params.deals) ? data.params.deals : [data.params.deals];
			const noDeals = dealsArray.includes('NO_DEALS');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const filterParam = getFilterParams(data.params as any, data?.fields || []);

			const params = `${makeURIParams(filterParam)}${noDeals ? '&deals=' : ''}`;

			const res = await uspacySdk.crmCompaniesService.getCompaniesWithFilters(
				params,
				data?.signal,
				data?.relatedEntityId,
				data?.relatedEntityType,
			);

			return res?.data;
		} catch (e) {
			if (data.signal.aborted) {
				return {
					aborted: true,
				};
			} else {
				return thunkAPI.rejectWithValue('Failure');
			}
		}
	},
);

export const fetchFieldsForCompany = createAsyncThunk('companies/fetchFieldsForCompany', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.crmCompaniesService.getCompanyFields();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateCompanyField = createAsyncThunk('companies/updateCompanyField', async (data: IField, thunkAPI) => {
	try {
		const res = await uspacySdk.crmCompaniesService.updateCompanyField(data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateCompanyListValues = createAsyncThunk('companies/updateCompanyListValues', async (data: IField, thunkAPI) => {
	try {
		const res = await uspacySdk.crmCompaniesService.updateCompanyListValues(data);
		return { ...data, values: res?.data };
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createCompanyField = createAsyncThunk('companies/createCompanyField', async (data: IField, thunkAPI) => {
	try {
		const res = await uspacySdk.crmCompaniesService.createCompanyField(data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteCompanyListValues = createAsyncThunk(
	'companies/deleteCompanyListValues',
	async ({ value, fieldCode }: { value: string; fieldCode: string }, thunkAPI) => {
		try {
			await uspacySdk.crmCompaniesService.deleteCompanyListValues(value, fieldCode);
			return { value, fieldCode };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteCompanyField = createAsyncThunk('companies/deleteCompanyField', async (code: string, thunkAPI) => {
	try {
		await uspacySdk.crmCompaniesService.deleteCompanyField(code);
		return code;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
