/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IBankRequisiteCreate, IBankUpdateData, IRequisite } from '@uspacy/sdk/lib/models/crm-requisite';

import { getSeparateCardId } from './../../helpers/requisites';

export const fetchTemplates = createAsyncThunk('requisite/fetchTemplates', async (data: { page: number; list: number }, thunkAPI) => {
	try {
		const res = await uspacySdk?.crmRequisitesService?.getTemplates(data);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const fetchCardRequisites = createAsyncThunk(
	'requisite/fetchCardRequisites',
	async (data: { cardId: string; refContext: boolean }, thunkAPI) => {
		const { cardId, refContext } = data;
		const [cardType, id] = getSeparateCardId(cardId);
		try {
			const params = {
				entity_type: cardType,
				entity_id: id,
				...(refContext && { is_reference_context: true }),
			};
			const res = await uspacySdk?.crmRequisitesService?.getCardRequisites(params);
			const resData = res?.data;
			return { cardId, requisites: resData?.data };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const createCardRequisites = createAsyncThunk(
	'requisite/createCardRequisites',
	async (data: { cardId: string; requisite: IRequisite; isProfile: boolean }, thunkAPI) => {
		const { cardId, requisite: req, isProfile } = data;
		try {
			const [cardType, id] = getSeparateCardId(cardId);
			const params = {
				...(!isProfile ? { entity_type: cardType, entity_id: id } : {}),
			};
			const res = await uspacySdk?.crmRequisitesService?.createCardRequisites(req as any, params);
			return { cardId, requisite: res?.data };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const updateCardRequisites = createAsyncThunk(
	'requisite/updateCardRequisites',
	async (data: { cardId: string; requisite: IRequisite }, thunkAPI) => {
		const { cardId, requisite: req } = data;
		const { template_id: tempalteId, ...body } = req;
		try {
			const result = { ...body, ...(tempalteId && { template_id: tempalteId }) };
			const res = await uspacySdk?.crmRequisitesService?.updateCardRequisites(req.id, result as any);

			return { cardId, requisite: res?.data };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const attachCardRequisites = createAsyncThunk(
	'requisite/attachCardRequisites',
	async (data: { cardId: string; mainCardId: string; requisiteId: number }, thunkAPI) => {
		const { cardId, mainCardId, requisiteId: reqId } = data;
		try {
			const [cardType, id] = getSeparateCardId(cardId);
			const [mainType, mainId] = getSeparateCardId(mainCardId);
			const queryParams = {
				entity_type: mainType,
				entity_id: mainId,
				entity_reference_type: cardType,
				entity_reference_id: id,
				requisite_id: reqId,
			};
			await uspacySdk.crmRequisitesService.attachCardRequisites(queryParams);

			return { cardId, requisiteId: reqId, entityId: +mainId };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteCardRequisites = createAsyncThunk(
	'requisite/detachCardRequisites',
	async (data: { cardId: string; requisiteId: number }, thunkAPI) => {
		const { cardId, requisiteId } = data;
		try {
			await uspacySdk.crmRequisitesService.deleteCardRequisites(requisiteId);
			return { cardId, requisiteId };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const createBankRequisites = createAsyncThunk('requisite/createBankRequisites', async (data: IBankUpdateData, thunkAPI) => {
	const { cardId, requisiteId, bankRequisites } = data;
	const bankRequisitesBody = bankRequisites.map((it) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, isCreate, ...body } = it;
		return {
			...body,
			fields: {
				values: body.fields.values,
				list: body.fields.list.map((field) => {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { required, value, ...mainField } = field;
					return { ...mainField, is_show_default: Number(required) };
				}),
			},
		};
	});
	try {
		const res = await uspacySdk?.crmRequisitesService?.createBankRequisites(requisiteId, bankRequisitesBody as any);

		return { cardId, requisiteId, res: res?.data };
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateBankRequisites = createAsyncThunk(
	'requisite/updateBankRequisites',
	async (data: { cardId: string; requisiteId: number; bankRequisite: IBankRequisiteCreate }, thunkAPI) => {
		const { cardId, requisiteId, bankRequisite: bankReq } = data;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, isCreate, ...body } = bankReq;
		const bankRequisiteBody = {
			...body,
			fields: {
				values: body.fields.values,
				list: body.fields.list.map((field) => {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { required, value, ...mainField } = field;
					return { ...mainField, is_show_default: Number(required) };
				}),
			},
		};
		try {
			const res = await uspacySdk?.crmRequisitesService?.updateBankRequisites(requisiteId, bankReq.id, bankRequisiteBody as any);
			return { cardId, requisiteId, bankRequisite: res?.data };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteBankRequisites = createAsyncThunk(
	'requisite/deleteBankRequisites',
	async (data: { cardId: string; requisiteId: number; bankRequisiteId: number }, thunkAPI) => {
		const { cardId, requisiteId, bankRequisiteId } = data;
		try {
			await uspacySdk.crmRequisitesService.deleteBankRequisites(requisiteId, bankRequisiteId);
			return { cardId, requisiteId, bankRequisiteId };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const attachBankRequisites = createAsyncThunk(
	'requisite/attachBankRequisites',
	async (data: { cardId: string; mainCardId: string; requisiteId: number; bankRequisiteId: number }, thunkAPI) => {
		const { cardId, mainCardId, requisiteId: reqId, bankRequisiteId } = data;
		try {
			const [cardType, id] = getSeparateCardId(cardId);
			const [mainType, mainId] = getSeparateCardId(mainCardId);
			const queryParams = {
				entity_type: mainType,
				entity_id: mainId,
				entity_reference_type: cardType,
				entity_reference_id: id,
				bank_requisite_id: bankRequisiteId,
			};
			await uspacySdk.crmRequisitesService.attachBankRequisites(reqId, queryParams);

			return { cardId, requisiteId: reqId, bankRequisiteId, entityId: +mainId };
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);
