import { IField } from '@uspacy/sdk/lib/models/field';

export const API_PREFIX_FILES = '/files/v1';

export const idColumn: IField = {
	name: 'number_',
	code: 'id_column',
	required: false,
	editable: false,
	show: false,
	hidden: true,
	multiple: false,
	type: 'id_column',
	field_section_id: '',
	system_field: true,
	sort: '',
	default_value: '',
};

export const dealsField: IField = {
	name: 'deals',
	code: 'deals',
	required: false,
	editable: false,
	show: false,
	hidden: true,
	multiple: false,
	type: 'deals_filter',
	field_section_id: '',
	system_field: true,
	sort: '',
	default_value: '',
};

export const taskField: IField = {
	name: 'tasks',
	code: 'tasks',
	required: false,
	editable: false,
	show: false,
	hidden: true,
	multiple: false,
	type: 'tasks_filter',
	field_section_id: '',
	system_field: true,
	sort: '',
	default_value: '',
};

export const OTHER_DEFAULT_FIELDS = {
	openDatePicker: false,
	search: '',
	page: 0,
	perPage: 0,
	boolean_operator: 'AND',
	table_fields: [],
};

export enum EntityIds {
	leads = '1',
	deals = '2',
	contacts = '3',
	companies = '4',
}

export const defaultProductFieldKeys = [
	'owner',
	'id',
	'title',
	'product_category_id',
	'type',
	'article',
	'prices',
	'measurement_unit_id',
	'comment',
	'currency',
	'tax',
	'link',
	'availability',
	'is_active',
	'description',
	'quantity',
	'reserved_quantity',
	'remainder',
	'preview_image_id',
	'file_ids',
	'files',
];

export enum FieldType {
	STAGE = 'stage',
	STRING = 'string',
	TEXTAREA = 'textarea',
	INTEGER = 'integer',
	FLOAT = 'float',
	LIST = 'list',
	DATETIME = 'datetime',
	MONEY = 'money',
	LABEL = 'label',
	PHONE = 'phone',
	EMAIL = 'email',
	SOCIAL = 'social',
	LINK = 'link',
	BOOLEAN = 'boolean',
	USER_ID = 'user_id',
	PHOTO = 'photo',
	FILE = 'file',
	ADDRESS = 'address',
	LEGAL_DETAILS = 'legal_details',
	ENTITY_REFERENCE = 'entity_reference',
	UTM = 'utm',
	CUSTOM_LINK = 'customLink',
	DEALS_FILTER = 'deals_filter',
	TASKS_FILTER = 'tasks_filter',
	ID_COLUMN = 'id_column',
	REQUISITE = 'requisite',
}
