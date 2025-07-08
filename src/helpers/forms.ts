export const getFormFieldByCode = (fields, fieldCode) => {
	return fields.find((field) => field.fieldCode === fieldCode);
};

export const updateFieldsOrderHelp = (fields, fieldsSortedArr) =>
	fields.map((field) => {
		if (!fieldsSortedArr.includes(field.fieldCode)) return field;

		const fieldIndex = fieldsSortedArr.findIndex((fieldCode) => fieldCode === field.fieldCode);
		return {
			...field,
			order: fieldIndex,
		};
	});
