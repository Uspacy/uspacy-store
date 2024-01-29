import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { IContactFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { IField } from '@uspacy/sdk/lib/models/field';

export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmContactsService?.getContacts();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createContact = createAsyncThunk('contacts/createContact', async (data: Partial<IEntityData>, thunkAPI) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, ...rest } = data;
		const res = await uspacySdk.crmContactsService.createContact(rest);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const updateContact = createAsyncThunk('contacts/updateContact', async (data: IEntityData, thunkAPI) => {
	try {
		const { id, ...rest } = data;
		const res = await uspacySdk.crmContactsService.updateContact(id, rest);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const deleteContact = createAsyncThunk('contacts/deleteContact', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.crmContactsService.deleteContact(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const massContactsDeletion = createAsyncThunk(
	'contacts/massDeletion',
	async ({ entityIds, exceptIds, all, params }: IMassActions, { rejectWithValue }) => {
		try {
			await uspacySdk.crmContactsService.massContactsDeletion({
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

export const massContactsEditing = createAsyncThunk(
	'contacts/massEditing',
	async ({ entityIds, exceptIds, all, params, payload, settings, profile, admin }: IMassActions, { rejectWithValue }) => {
		try {
			await uspacySdk.crmContactsService.massContactsEditing({
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

export const fetchContactsWithFilters = createAsyncThunk(
	'contacts/fetchContactsWithFilters',
	async (
		data: { params: Omit<IContactFilters, 'openDatePicker'>; signal: AbortSignal; relatedEntityId?: string; relatedEntityType?: string },
		thunkAPI,
	) => {
		try {
			const dealsArray = Array.isArray(data.params.deals) ? data.params.deals : [data.params.deals];
			const noDeals = dealsArray.includes('NO_DEALS');
			const deals = dealsArray.filter((el) => el !== 'NO_DEALS');
			const params = {
				...(data.params.search ? { q: data.params.search } : {}),
				source: data.params.source,
				created_at: data.params.period,
				contact_label: data.params.contact_label,
				owner: data.params.owner,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				deals: noDeals ? (' ' as any) : deals,
				page: data.params.page,
				list: data.params.perPage,
				table_fields: data.params.table_fields,
			};

			const res = await uspacySdk.crmContactsService.getContactsWithFilters(
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

export const fetchFieldsForContact = createAsyncThunk('contacts/fetchFieldsForContact', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.crmContactsService.getContactFields();
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateContactField = createAsyncThunk('contacts/updateContactField', async (data: IField, thunkAPI) => {
	try {
		const res = await uspacySdk.crmContactsService.updateContactField(data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateContactListValues = createAsyncThunk('contacts/updateContactListValues', async (data: IField, thunkAPI) => {
	try {
		const res = await uspacySdk.crmContactsService.updateContactListValues(data);
		return { ...data, values: res?.data };
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const createContactField = createAsyncThunk('contacts/createContactField', async (data: IField, thunkAPI) => {
	try {
		const res = await uspacySdk.crmContactsService.createContactField(data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteContactListValues = createAsyncThunk(
	'contacts/deleteContactListValues',
	async ({ value, fieldCode }: { value: string; fieldCode: string }, thunkAPI) => {
		try {
			await uspacySdk.crmContactsService.deleteContactListValues(value, fieldCode);
			return { value, fieldCode };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteContactField = createAsyncThunk('contacts/deleteContactField', async (code: string, thunkAPI) => {
	try {
		await uspacySdk.crmContactsService.deleteContactField(code);
		return code;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
