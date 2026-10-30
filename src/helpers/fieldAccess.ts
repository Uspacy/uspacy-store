import { IField, IFieldAccess } from '@uspacy/sdk/lib/models/field';

interface ITableFieldsParams {
	tableFields: string[];
	fields: IField[];
}

export const isFieldWithAccess = (field: IField) => field?.type === 'user_id' && !!(field?.access as IFieldAccess)?.enabled;

export const withFieldAccessTableFields = ({ tableFields, fields }: ITableFieldsParams) => {
	const accessFieldCodes = (fields || [])?.filter(isFieldWithAccess)?.map((field) => field.code);

	if (!tableFields?.length || !accessFieldCodes?.length) return tableFields;

	return [...tableFields, ...[...accessFieldCodes, 'kanban_stage_id']?.filter((code) => !tableFields.includes(code))];
};
