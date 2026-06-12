export const getFormFieldByCode = (fields, fieldCode) => {
	return fields.find((field) => field.fieldCode === fieldCode);
};

export const updateFieldsOrderHelp = (fields, fieldsSortedArr, byId = false) =>
	fields.map((field) => {
		const fieldKey = byId ? field.id : field.fieldCode;
		if (!fieldsSortedArr.includes(fieldKey)) return field;

		const fieldIndex = fieldsSortedArr.findIndex((key) => key === fieldKey);
		return {
			...field,
			order: fieldIndex,
		};
	});
