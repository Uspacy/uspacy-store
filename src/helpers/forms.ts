export const getFormFieldByCode = (fields, fieldCode) => {
	return fields.find((field) => field.fieldCode === fieldCode);
};
