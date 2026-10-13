import { IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { FieldAccessLevel, IField } from '@uspacy/sdk/lib/models/field';

interface IFieldLevelParams {
	field: IField;
	stageId?: number;
}

interface IUserInFieldParams {
	field: IField;
	item: IEntityData;
	userId: number;
}

interface ITableFieldsParams {
	tableFields: string[];
	fields: IField[];
}

interface IFieldAccessLevelsParams {
	fields: IField[];
	item: IEntityData;
	userId: number;
	stageId?: number;
}

export const isFieldWithAccess = (field: IField) => field?.type === 'user_id' && !!field?.access?.enabled;

const getLevelByStage = ({ field, stageId }: IFieldLevelParams): FieldAccessLevel[] => {
	const access = field?.access;

	if (!access?.funnels?.length) return access?.level || [];

	return access.funnels?.find((it) => it?.stage_id?.includes(stageId))?.level || [];
};

const isUserInField = ({ field, item, userId }: IUserInFieldParams) => {
	const value = item?.[field?.code];

	if (!userId) return false;
	if (Array.isArray(value)) return value?.some((it) => +it === userId);

	return !!value && +value === userId;
};

export const withFieldAccessTableFields = ({ tableFields, fields }: ITableFieldsParams) => {
	const accessFieldCodes = (fields || [])?.filter(isFieldWithAccess)?.map((field) => field.code);

	if (!tableFields?.length || !accessFieldCodes?.length) return tableFields;

	return [...tableFields, ...[...accessFieldCodes, 'kanban_stage_id']?.filter((code) => !tableFields.includes(code))];
};

export const getFieldAccessLevels = ({ fields, item, userId, stageId }: IFieldAccessLevelsParams): FieldAccessLevel[] =>
	(fields || [])?.reduce<FieldAccessLevel[]>((acc, field) => {
		if (!isFieldWithAccess(field) || !isUserInField({ field, item, userId })) return acc;

		return [...acc, ...getLevelByStage({ field, stageId })?.filter((level) => !acc.includes(level))];
	}, []);
