import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IField } from '@uspacy/sdk/lib/models/field';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

import { fieldForCalls, fieldsForTasks, idColumnField, requisiteField, stageField, taskField } from '../../../const';
import { defaultDataColumns, normalizeProductFields } from '../../../helpers/normalizeProduct';
import { createField, deleteField, deleteListValue, fetchFields, updateField, updateListValues } from './actions';
import { EntityFields, IState } from './types';

const initialState: IState = {};

const feildsReducer = createSlice({
	name: 'crm/fields',
	initialState,
	reducers: {
		clearEntityFields: (state, action: PayloadAction<string>) => {
			state[action.payload] = undefined;
		},
	},
	extraReducers: {
		[fetchFields.fulfilled.type]: (state, action: PayloadAction<IResponseWithMeta<IField>, string, { arg: string }>) => {
			const entityCode = action.meta.arg;
			state[entityCode].loading = false;
			let data = action.payload.data;
			data.splice(0, 0, idColumnField);
			if (entityCode === 'deals') {
				data.splice(0, 0, taskField);
			}
			if (entityCode === 'calls') {
				data.splice(0, 0, ...fieldForCalls);
			} else if (!['contacts', 'companies'].includes(entityCode)) {
				data.splice(2, 0, stageField);
			}
			if (entityCode === 'products') {
				data = normalizeProductFields(action.payload, defaultDataColumns);
			}
			if (['companies', 'contacts'].includes(entityCode)) {
				data.splice(3, 0, requisiteField);
			}
			if (entityCode === 'tasks') {
				data = fieldsForTasks;
			}
			// TODO wait api
			// data.splice(0, 0, dealsField);
			state[entityCode].data = data.map((field) => {
				field.values?.sort((a, b) => a.sort - b.sort);
				return field;
			});
			state[entityCode].meta = action.payload.meta;
		},
		[fetchFields.pending.type]: (state, action: PayloadAction<unknown, string, { arg: string }>) => {
			const entityCode = action.meta.arg;
			state[entityCode] ??= { loading: true, data: [] } as EntityFields;
			state[entityCode].loading = true;
			state[entityCode].errorMessage = null;
		},
		[fetchFields.rejected.type]: (state, action: PayloadAction<string, string, { arg: string }>) => {
			state[action.meta.arg].loading = false;
			state[action.meta.arg].errorMessage = action.payload;
		},

		[createField.pending.type]: (state, action: PayloadAction<IField, string, { arg: { entityCode: string; data: IField } }>) => {
			const entityCode = action.meta.arg.entityCode;
			state[entityCode] ??= { loading: true, data: [] } as EntityFields;
			state[entityCode].data.push(action.meta.arg.data);
		},

		[updateField.pending.type]: (state, action: PayloadAction<string, string, { arg: { entityCode: string; data: IField } }>) => {
			const entityCode = action.meta.arg.entityCode;
			state[entityCode].data = state[entityCode].data.map((field) => {
				if (field.code === action.meta.arg.data.code) {
					return { ...field, ...action.meta.arg.data };
				}
				return field;
			});
		},

		[deleteField.pending.type]: (state, action: PayloadAction<string, string, { arg: { entityCode: string; fieldCode: string } }>) => {
			state[action.meta.arg.entityCode].data = state[action.meta.arg.entityCode].data.filter(
				(field) => field.code !== action.meta.arg.fieldCode,
			);
		},

		[updateListValues.pending.type]: (
			state,
			action: PayloadAction<string, string, { arg: { entityCode: string; data: Pick<IField, 'code' | 'values'> } }>,
		) => {
			const entityCode = action.meta.arg.entityCode;
			state[entityCode].data = state[entityCode].data.map((field) => {
				if (field.code === action.meta.arg.data.code) {
					return { ...field, ...action.meta.arg.data };
				}
				return field;
			});
		},

		[deleteListValue.pending.type]: (
			state,
			action: PayloadAction<string, string, { arg: { entityCode: string; fieldCode: string; value: string } }>,
		) => {
			const entityCode = action.meta.arg.entityCode;
			state[entityCode].data = state[entityCode].data.map((field) => {
				if (field.code === action.meta.arg.fieldCode) {
					return { ...field, values: field.values.filter(({ value }) => value !== action.meta.arg.value) };
				}
				return field;
			});
		},
	},
});
export const { clearEntityFields } = feildsReducer.actions;
export default feildsReducer.reducer;
