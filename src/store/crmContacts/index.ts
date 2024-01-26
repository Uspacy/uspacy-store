import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICardBlock } from '@uspacy/sdk/lib/models/crm-card-blocks';
import { IEntity, IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { IContactFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { IField, IFields } from '@uspacy/sdk/lib/models/field';

import { idColumn } from './../../const';
import {
	createContact,
	createContactField,
	deleteContact,
	deleteContactField,
	deleteContactListValues,
	fetchContacts,
	fetchContactsWithFilters,
	fetchFieldsForContact,
	massContactsDeletion,
	massContactsEditing,
	updateContact,
	updateContactField,
	updateContactListValues,
} from './actions';
import { IState } from './types';

const initialContacts = {
	data: [],
	meta: {
		total: 0,
		from: 0,
		per_page: 0,
		list: 0,
	},
	aborted: false,
};

const initialContactsFilters = {
	contact_label: [],
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
	table_fields: [],
};

const initialState = {
	contacts: initialContacts,
	contact: {},
	contactFields: {
		data: [],
	},
	contactFilters: initialContactsFilters,
	errorMessage: '',
	loading: false,
	loadingContactList: true,
	loadingsContactFields: true,
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

export const contactsReducer = createSlice({
	name: 'contacts',
	initialState,
	reducers: {
		changeFilterContact: (state, action: PayloadAction<{ key: string; value: IContactFilters[keyof IContactFilters] }>) => {
			state.contactFilters[action.payload.key] = action.payload.value;
		},
		changeItemsFilterContact: (state, action: PayloadAction<IContactFilters>) => {
			state.contactFilters = action.payload;
		},
		clearContacts: (state) => {
			state.contacts = initialContacts;
			state.loadingContactList = true;
		},
		clearContactFilters: (state) => {
			state.createdAt = [];
			state.contactFilters = { ...initialContactsFilters, page: 1, perPage: 20 };
		},
		setCardBlocks: (state, action: PayloadAction<ICardBlock[]>) => {
			state.cardBlocks = action.payload;
		},
	},
	extraReducers: {
		[fetchContacts.fulfilled.type]: (state, action: PayloadAction<IEntity>) => {
			state.loadingContactList = false;
			state.errorMessage = '';
			state.contacts = action.payload;
		},
		[fetchContacts.pending.type]: (state) => {
			state.loadingContactList = true;
			state.errorMessage = '';
		},
		[fetchContacts.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingContactList = false;
			state.errorMessage = action.payload;
		},
		[createContact.fulfilled.type]: (state, action: PayloadAction<IEntityData>) => {
			state.loading = false;
			state.errorMessage = '';
			state.contacts.data.unshift(action.payload);
			state.contacts.meta.total = ++state.contacts.meta.total;
		},
		[createContact.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createContact.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[updateContact.fulfilled.type]: (state, action: PayloadAction<IEntityData>) => {
			state.loading = false;
			state.errorMessage = '';
			state.contacts.data = state.contacts.data.map((contact) => {
				if (contact.id === action.payload.id) {
					return action.payload;
				}
				return contact;
			});
		},
		[updateContact.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[updateContact.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteContact.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loading = false;
			state.errorMessage = '';
			state.contacts.data = state.contacts.data.filter((contact) => contact.id !== action.payload);
		},
		[deleteContact.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteContact.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[massContactsDeletion.fulfilled.type]: (state, action: PayloadAction<IMassActions>) => {
			state.loading = false;
			state.loadingContactList = false;
			state.errorMessage = '';
			state.contacts.data = state.contacts.data.filter((item) => !action.payload.entityIds.includes(item?.id));

			if (action.payload.all) {
				state.contacts.meta.total = 0;
			} else if (action.payload.all && action.payload.exceptIds.length) {
				state.contacts.meta.total = action.payload.exceptIds.length;
			} else {
				state.contacts.meta.total = state.contacts.meta.total - action.payload.entityIds.length;
			}
		},
		[massContactsDeletion.pending.type]: (state) => {
			state.loading = true;
			state.loadingContactList = true;
			state.errorMessage = '';
		},
		[massContactsDeletion.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingContactList = false;
			state.errorMessage = action.payload;
		},
		[massContactsEditing.fulfilled.type]: (state) => {
			state.loading = false;
			state.errorMessage = '';
		},
		[massContactsEditing.pending.type]: (state) => {
			state.loading = true;
			state.loadingContactList = true;
			state.errorMessage = '';
		},
		[massContactsEditing.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingContactList = false;
			state.errorMessage = action.payload;
		},
		[fetchContactsWithFilters.fulfilled.type]: (state, action: PayloadAction<IEntity>) => {
			state.loadingContactList = action.payload.aborted;
			state.errorMessage = '';
			state.contacts = action.payload.aborted ? state.contacts : action.payload;
		},
		[fetchContactsWithFilters.pending.type]: (state) => {
			state.loadingContactList = true;
			state.errorMessage = '';
		},
		[fetchContactsWithFilters.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingContactList = false;
			state.errorMessage = action.payload;
		},
		[fetchFieldsForContact.fulfilled.type]: (state, action: PayloadAction<IFields>) => {
			state.loading = false;
			state.loadingsContactFields = false;
			state.errorMessage = '';
			state.contactFields = action.payload;
			// @ts-ignore
			state.contactFields.data.splice(2, 0, requisite);
			state.contactFields.data.forEach((field) => {
				field?.values?.sort((a, b) => a.sort - b.sort);
			});
			// @ts-ignore
			state.contactFields.data.splice(0, 0, idColumn);
		},
		[fetchFieldsForContact.pending.type]: (state) => {
			state.loading = true;
			state.loadingsContactFields = true;
			state.errorMessage = '';
		},
		[fetchFieldsForContact.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingsContactFields = false;
			state.errorMessage = action.payload;
		},
		[updateContactField.fulfilled.type]: (state, action: PayloadAction<IField>) => {
			state.loading = false;
			state.errorMessage = '';
			state.contactFields.data = state.contactFields.data.map((field) => {
				if (field.code === action.payload.code) {
					return { ...action.payload, values: action?.payload?.values || field?.values };
				}
				return field;
			});
		},
		[updateContactField.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[updateContactField.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[updateContactListValues.fulfilled.type]: (state, action: PayloadAction<IField>) => {
			state.loading = false;
			state.errorMessage = '';
			state.contactFields.data = state.contactFields.data.map((field) => {
				if (field.code === action.payload.code) {
					field = action.payload;
					field.values.sort((a, b) => a.sort - b.sort);
				}
				return field;
			});
		},
		[updateContactListValues.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[updateContactListValues.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createContactField.fulfilled.type]: (state, action: PayloadAction<IField>) => {
			state.loading = false;
			state.errorMessage = '';
			state.contactFields.data.push(action.payload);
		},
		[createContactField.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createContactField.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteContactListValues.fulfilled.type]: (state, action: PayloadAction<{ fieldCode: string; value: string }>) => {
			state.loading = false;
			state.errorMessage = '';
			state.contactFields.data = state.contactFields.data.map((field) => {
				if (field.code === action.payload.fieldCode) {
					field.values = field.values.filter((value) => value.value !== action.payload.value);
				}
				return field;
			});
		},
		[deleteContactListValues.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteContactListValues.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteContactField.fulfilled.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = '';
			state.contactFields.data = state.contactFields.data.filter((field) => field.code !== action.payload);
		},
		[deleteContactField.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteContactField.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
	},
});

export const { changeFilterContact, changeItemsFilterContact, clearContacts, clearContactFilters, setCardBlocks } = contactsReducer.actions;

export default contactsReducer.reducer;
