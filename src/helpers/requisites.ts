import { ICardRequisite } from '@uspacy/sdk/lib/models/crm-requisite';

export const getFieldsWithValue = (list, values) => {
	const valuesArray = Object.entries(values);
	return valuesArray.map(([valueCode, value]) => {
		const fieldByCode = list.find((field) => field.code === valueCode);
		return { ...fieldByCode, value };
	});
};

export const getPluralType = (cardType: string) => {
	switch (cardType) {
		case 'company':
			return 'companies';
		default:
			return `${cardType}s`;
	}
};

export const normalizeDynamicFields = (fieldsWithValue: { value: string; code: string }[]) => {
	return fieldsWithValue.reduce((acc, field) => ({ ...acc, [field.code]: field.value || '' }), {});
};

export const normalizeRequisiteCreation = (newRequisite: ICardRequisite) => (oldRequisite) => {
	if (oldRequisite.cardId === newRequisite.cardId) {
		const clearBase = (requisites) => {
			if (!newRequisite.requisite?.is_basic) return requisites;
			return requisites.map((req) => ({ ...req, is_basic: false }));
		};
		return {
			...oldRequisite,
			requisites: [...clearBase(oldRequisite.requisites), newRequisite.requisite],
		};
	}
	return oldRequisite;
};

export const getSeparateCardId = (cardId) => cardId?.split('_') || [];
