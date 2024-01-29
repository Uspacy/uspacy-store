import { IField } from '@uspacy/sdk/lib/models/field';

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
