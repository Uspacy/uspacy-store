import { IFilterField } from '@uspacy/sdk/lib/models/crm-filter-field';
import { IFilter } from '@uspacy/sdk/lib/models/crm-filters';
import { IField, IFields } from '@uspacy/sdk/lib/models/field';
import isArray from 'lodash/isArray';
import isNull from 'lodash/isNull';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

import { FieldType } from './../const';

export const getDefaultFastFields = (entityType: string) => {
	switch (entityType) {
		case 'lead':
			return ['kanban_status', 'kanban_stage_id', 'source', 'created_at', 'owner'];
		case 'deal':
			return ['kanban_status', 'kanban_stage_id', 'tasks', 'created_at', 'owner'];
		case 'company':
			return ['company_label', 'source', 'created_at', 'owner', 'updated_at'];
		case 'contact':
			return ['contact_label', 'source', 'created_at', 'owner', 'updated_at'];
		case 'task':
			return ['kanban_status', 'kanban_stage_id', 'source', 'created_at', 'owner', 'contact_label', 'deals', 'company_label'];
		case 'product':
			return ['kanban_status', 'kanban_stage_id', 'source', 'created_at', 'owner', 'contact_label', 'deals', 'company_label'];
		case 'calls':
			return ['ended_call_status', 'call_type', 'duration', 'responsible_id', 'begin_time'];
		default:
			return ['created_at', 'updated_at', 'owner', 'created_by', 'changed_by', 'created_at_custom', 'updated_at_custom'];
	}
};

export const getFilterField = (fields: IFields, entityType: string): IFilterField[] => {
	const isDefaultCode = ['lead', 'deal', 'contact', 'product', 'company', 'task'];
	if (!fields?.data?.length) return [];
	const result = [];
	const firstFilterField = fields?.data?.find((field) =>
		isDefaultCode.includes(entityType)
			? field.code === getDefaultFastFields(entityType)[0]
			: field.code.includes(getDefaultFastFields(entityType)[0]),
	);
	const secondFilterField = fields?.data?.find((field) =>
		isDefaultCode.includes(entityType)
			? field.code === getDefaultFastFields(entityType)[1]
			: field.code.includes(getDefaultFastFields(entityType)[1]),
	);
	const thirdFilterField = fields?.data?.find((field) => field.code === getDefaultFastFields(entityType)[2]);
	const fourthFilterField = fields?.data?.find((field) => field.code === getDefaultFastFields(entityType)[3]);
	const fifthFilterField = fields?.data.find((field) => field.code === getDefaultFastFields(entityType)[4]);
	if (!!firstFilterField?.code) {
		result.push(firstFilterField);
	}
	if (!!secondFilterField?.code) {
		result.push(secondFilterField);
	}
	if (!!thirdFilterField?.code) {
		result.push(thirdFilterField);
	}
	if (!!fourthFilterField?.code) {
		result.push(fourthFilterField);
	}
	if (!!fifthFilterField?.code) {
		result.push(fifthFilterField);
	}
	const sortFields = [...result, ...fields.data.filter((it) => !getDefaultFastFields(entityType).includes(it.code))];
	return sortFields.map((it, idx) => ({
		id: idx,
		title: it.name,
		code: it.code,
		sort: (idx + 1) * 10,
		checked: getDefaultFastFields(entityType).includes(it.code),
		fast: getDefaultFastFields(entityType).includes(it.code),
	}));
};

export const updateFieldsInPresets = (filterFieldsArr: IFilterField[], fields: IFields) => {
	const preparedArr = filterFieldsArr
		.filter((it) => [...fields?.data.map((el) => el.code), 'select', 'search'].includes(it.code))
		.map((field) => ({ ...field }));

	fields.data.forEach((field, idx) => {
		const fieldExists = preparedArr.some((it) => it.code === field.code);
		if (!fieldExists) {
			preparedArr.push({
				id: idx + 1,
				title: field.name,
				code: field.code,
				sort: (preparedArr.length + 1) * 10,
				checked: false,
				fast: false,
			});
		}
	});

	return preparedArr;
};

export const getField = (field: IField) => {
	if ([FieldType.DATETIME, FieldType.TASKS_FILTER].includes(field.type as FieldType)) {
		return {
			[`certainDateOrPeriod_${field?.code}`]: [],
			[`time_label_${field?.code}`]: [],
			[`${field?.code}`]: [],
		};
	}
	if ([FieldType.INTEGER, FieldType.FLOAT].includes(field.type as FieldType)) {
		if (field.code === 'kanban_reason_id') {
			return { [`${field?.code}`]: [] };
		}
		return {
			[`to_${field?.code}`]: null,
			[`from_${field?.code}`]: null,
		};
	}
	if (field.type === FieldType.MONEY) {
		return {
			[`to_${field?.code}`]: null,
			[`from_${field?.code}`]: null,
			[`currency_${field?.code}`]: '',
		};
	}
	if (
		[
			FieldType.TEXTAREA,
			FieldType.UTM,
			FieldType.ADDRESS,
			FieldType.PHONE,
			FieldType.LINK,
			FieldType.SOCIAL,
			FieldType.EMAIL,
			FieldType.STRING,
			FieldType.FLOAT,
			FieldType.INTEGER,
		].includes(field.type as FieldType)
	) {
		if (field?.code === 'kanban_status') return { [`${field?.code}`]: [] };
		return { [`${field?.code}`]: '' };
	}
	return { [`${field?.code}`]: [] };
};

export const getFilterParams = (filters: IFilter, fields: IField[], isKanban = false) => {
	return Object?.entries(filters)
		?.filter(([key, value]) => {
			if (key === 'time_label_start_time' && value.includes('expiredtask')) {
				return true;
			}
			if (
				key?.includes('certainDateOrPeriod_') ||
				key?.includes('time_label_') ||
				key?.includes('openDatePicker') ||
				key?.includes('View') ||
				key?.includes('entityCode')
			) {
				return false;
			}
			if (isKanban && ['select', 'page', 'perPage', 'table_fields', 'entityCode', 'sortModel'].includes(key)) {
				return false;
			}
			if (key?.includes('select')) {
				return value > 0;
			}

			if (isArray(value)) {
				return value?.length > 0;
			}
			if (isString(value)) {
				return !!value;
			}
			if (isNumber(value)) {
				return !isNaN(value);
			}
			return true;
		})
		.reduce((acc, [key, value]) => {
			const findField = fields?.find((it) => it?.code === key);
			if (key === 'search') {
				return { ...acc, q: value };
			}
			if (key === 'perPage') {
				return { ...acc, list: value };
			}
			if (key === 'time_label_start_time' && value?.includes('expiredtask')) {
				return { ...acc, expired: Math.floor(new Date().getTime() / 1000) };
			}
			if (key === 'select') {
				return { ...acc, ['funnel_id']: value };
			}
			if (key === 'deals' && findField?.type !== 'customLink') {
				return { ...acc, deals: value?.filter((el) => el !== 'NO_DEALS') };
			}
			if (findField?.type === 'customLink') {
				const checkCompany = key === 'company' ? 'companies' : key;
				return { ...acc, [`${checkCompany}[title]`]: value };
			}
			if (['kanban_status', 'kanban_reason_id'].includes(key)) {
				return { ...acc, [key]: isArray(value) ? value : [value] };
			}
			if (['tasks'].includes(key)) {
				return { ...acc, [key]: value?.filter((el) => el !== 0) };
			}

			if (['owner'].includes(key)) {
				return { ...acc, [key]: value == 0 ? null : value?.filter((el) => el !== 0) };
			}

			if (['sortModel'].includes(key)) {
				const array = isArray(value) ? value : [value];
				if (array.length === 0) return acc;
				const [field, sort] = Object?.entries(array[0])[0];
				const checkField = field === 'id_column' ? 'id' : field;
				return { ...acc, [`sort_by[${checkField}]`]: sort };
			}

			if (key?.startsWith('from_') || key?.startsWith('to_') || key?.startsWith('currency_')) {
				const fieldCode = key.replace(/^(from_|to_|currency_)/, '');
				const fieldType = key.split('_')[0];
				if (isNull(value)) {
					return acc;
				}

				return {
					...acc,
					[`${fieldCode}[${fieldType}]`]: value,
				};
			}

			if ([FieldType.SOCIAL].includes(findField?.type as FieldType) && (value?.startsWith('@') || value?.startsWith('+'))) {
				return { ...acc, [key]: value.substring(1) };
			}

			if ([FieldType.STAGE, FieldType.LIST, FieldType.LABEL, FieldType.PRIORITY].includes(findField?.type as FieldType)) {
				return { ...acc, [key]: isArray(value) ? value : [value] };
			}

			return { ...acc, [key]: value };
		}, {});
};

export const getDealsParams = (filters: object, params: object) => {
	const tasksArray = (Array.isArray(filters?.['time_label_tasks']) ? filters?.['time_label_tasks'] : [filters['time_label_task']]).filter(Boolean);
	const noTasks = typeof filters?.['time_label_tasks'] !== 'undefined' && tasksArray?.includes('noBusiness');
	const dealsParams = {
		...params,
		...(noTasks ? { tasks: '' } : {}),
	};

	return dealsParams;
};
