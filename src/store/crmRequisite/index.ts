/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBankRequisite, IBankRequisiteCreate, ICardRequisite, IRequisite, ITemplateResponse } from '@uspacy/sdk/lib/models/crm-requisite';

import { normalizeRequisiteCreation } from './../../helpers/requisites';
import {
	attachBankRequisites,
	attachCardRequisites,
	createBankRequisites,
	createCardRequisites,
	deleteBankRequisites,
	deleteCardRequisites,
	fetchCardRequisites,
	fetchTemplates,
	updateBankRequisites,
	updateCardRequisites,
} from './actions';
import { IState } from './types';

const initialState = {
	cardRequisites: [],
	templates: [],
	errorMessage: '',
	loading: {
		load: false,
		cardLoading: false,
		cardUpdateLoading: false,
		cardCreateLoading: false,
		cardAttachLoading: false,
		cardDeleteLoading: false,
		templateLoading: true,
	},
} as IState;

const requisiteReducer = createSlice({
	name: 'requisite',
	initialState,
	reducers: {
		clearCardRequisites: (state) => {
			state.cardRequisites = initialState.cardRequisites;
		},
	},
	extraReducers: {
		[fetchTemplates.fulfilled.type]: (state, action: PayloadAction<ITemplateResponse>) => {
			state.loading.templateLoading = false;
			state.loading.load = false;
			state.errorMessage = '';
			state.templates = action.payload.data;
		},
		[fetchTemplates.pending.type]: (state) => {
			state.loading.templateLoading = true;
			state.loading.load = true;
			state.errorMessage = '';
		},
		[fetchTemplates.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading.templateLoading = false;
			state.loading.load = false;
			state.errorMessage = action.payload;
		},
		[fetchCardRequisites.fulfilled.type]: (state, action: PayloadAction<IRequisite[]>) => {
			state.loading.cardLoading = false;
			state.loading.load = false;
			state.errorMessage = '';
			state.cardRequisites = [...state.cardRequisites, action.payload] as any;
		},
		[fetchCardRequisites.pending.type]: (state) => {
			state.loading.cardLoading = true;
			state.loading.load = true;
			state.errorMessage = '';
		},
		[fetchCardRequisites.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading.cardLoading = false;
			state.loading.load = false;
			state.errorMessage = action.payload;
		},
		[createCardRequisites.fulfilled.type]: (state, action: PayloadAction<ICardRequisite>) => {
			const hasCardInStore = state.cardRequisites.find((requisite) => requisite.cardId === action.payload.cardId);
			state.loading.cardCreateLoading = false;
			state.loading.load = false;
			state.errorMessage = '';
			state.cardRequisites = hasCardInStore
				? state.cardRequisites.map(normalizeRequisiteCreation(action.payload))
				: [{ cardId: action.payload.cardId, requisites: [action.payload.requisite] }];
		},
		[createCardRequisites.pending.type]: (state) => {
			state.loading.cardCreateLoading = true;
			state.loading.load = true;
			state.errorMessage = '';
		},
		[createCardRequisites.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading.cardCreateLoading = false;
			state.loading.load = false;
			state.errorMessage = action.payload;
		},
		[updateCardRequisites.fulfilled.type]: (state, action: PayloadAction<{ cardId: string; requisite: IRequisite }>) => {
			state.loading.cardUpdateLoading = false;
			state.loading.load = false;
			state.errorMessage = '';
			state.cardRequisites = state.cardRequisites.map((cardReq) => {
				if (cardReq.cardId === action.payload.cardId)
					return {
						...cardReq,
						requisites: cardReq.requisites.map((req) => {
							const newBase = action.payload.requisite.is_basic;
							if (req?.id === action.payload.requisite.id) return { ...req, ...action.payload.requisite };
							return { ...req, is_basic: newBase ? false : req.is_basic };
						}),
					};
				return cardReq;
			});
		},
		[updateCardRequisites.pending.type]: (state) => {
			state.loading.cardUpdateLoading = true;
			state.loading.load = true;
			state.errorMessage = '';
		},
		[updateCardRequisites.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading.cardUpdateLoading = false;
			state.loading.load = false;
			state.errorMessage = action.payload;
		},
		[attachCardRequisites.fulfilled.type]: (state, action: PayloadAction<{ cardId: string; requisiteId: string; entityId: number }>) => {
			state.loading.cardAttachLoading = false;
			state.loading.load = false;
			state.errorMessage = '';
			state.cardRequisites = state.cardRequisites.map((cardReq) => {
				if (cardReq.cardId === action.payload.cardId)
					return {
						...cardReq,
						requisites: cardReq.requisites.map((req) => {
							if (req?.id?.toString() === action.payload.requisiteId?.toString())
								return { ...req, is_basic: true, references_relations: [action.payload.entityId] };
							return { ...req, is_basic: false, references_relations: [] };
						}),
					};
				return cardReq;
			});
		},
		[attachCardRequisites.pending.type]: (state) => {
			state.loading.cardAttachLoading = true;
			state.loading.load = true;
			state.errorMessage = '';
		},
		[attachCardRequisites.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading.cardAttachLoading = false;
			state.loading.load = false;
			state.errorMessage = action.payload;
		},
		[deleteCardRequisites.fulfilled.type]: (state, action: PayloadAction<{ cardId: string; requisiteId: string }>) => {
			state.loading.cardDeleteLoading = false;
			state.loading.load = false;
			state.errorMessage = '';
			state.cardRequisites = state.cardRequisites.map((cardReq) => {
				if (cardReq.cardId === action.payload.cardId) {
					return {
						...cardReq,
						requisites: cardReq.requisites.filter((req) => req.id?.toString() !== action.payload.requisiteId?.toString()),
					};
				}
				return cardReq;
			});
		},
		[deleteCardRequisites.pending.type]: (state) => {
			state.loading.cardDeleteLoading = true;
			state.loading.load = true;
			state.errorMessage = '';
		},
		[deleteCardRequisites.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading.cardDeleteLoading = false;
			state.loading.load = false;
			state.errorMessage = action.payload;
		},
		[createBankRequisites.fulfilled.type]: (
			state,
			action: PayloadAction<{ cardId: string; requisiteId: number; res: IBankRequisiteCreate[] }>,
		) => {
			state.loading.cardUpdateLoading = false;
			state.loading.load = false;
			state.errorMessage = '';
			state.cardRequisites = state.cardRequisites.map((cardReq) => {
				if (cardReq.cardId === action.payload.cardId)
					return {
						...cardReq,
						requisites: cardReq.requisites.map((req) => {
							if (req?.id === action.payload.requisiteId)
								return {
									...req,
									bank_requisites: action.payload.res,
								};
							return req;
						}),
					};
				return cardReq;
			});
		},
		[createBankRequisites.pending.type]: (state) => {
			state.loading.cardUpdateLoading = true;
			state.loading.load = true;
			state.errorMessage = '';
		},
		[createBankRequisites.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading.cardUpdateLoading = false;
			state.loading.load = false;
			state.errorMessage = action.payload;
		},

		[updateBankRequisites.fulfilled.type]: (
			state,
			action: PayloadAction<{ cardId: string; requisiteId: number; bankRequisite: IBankRequisite }>,
		) => {
			state.loading.cardUpdateLoading = false;
			state.loading.load = false;
			state.errorMessage = '';
			state.cardRequisites = state.cardRequisites.map((cardReq) => {
				if (cardReq.cardId === action.payload.cardId)
					return {
						...cardReq,
						requisites: cardReq.requisites.map((req) => {
							if (req?.id === action.payload.requisiteId) {
								return {
									...req,
									bank_requisites: req.bank_requisites.map((bankReq) => {
										const newBase = action.payload.bankRequisite.is_basic;
										if (bankReq?.id === action.payload.bankRequisite.id) {
											return { ...bankReq, ...action.payload.bankRequisite };
										} else {
											return { ...bankReq, is_basic: newBase ? false : bankReq.is_basic };
										}
									}),
								};
							} else {
								return req;
							}
						}),
					};
				return cardReq;
			});
		},
		[updateBankRequisites.pending.type]: (state) => {
			state.loading.cardUpdateLoading = true;
			state.loading.load = true;
			state.errorMessage = '';
		},
		[updateBankRequisites.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading.cardUpdateLoading = false;
			state.loading.load = false;
			state.errorMessage = action.payload;
		},
		[deleteBankRequisites.fulfilled.type]: (state, action: PayloadAction<{ cardId: string; requisiteId: number; bankRequisiteId: number }>) => {
			state.loading.cardDeleteLoading = false;
			state.loading.load = false;
			state.errorMessage = '';
			state.cardRequisites = state.cardRequisites.map((cardReq) => {
				if (cardReq.cardId === action.payload.cardId) {
					return {
						...cardReq,
						requisites: cardReq.requisites.map((req) => {
							if (req.id === action.payload.requisiteId) {
								return {
									...req,
									bank_requisites: req.bank_requisites.filter((bankReq) => (bankReq as any) !== action.payload.bankRequisiteId),
								};
							}
							return req;
						}),
					};
				}
				return cardReq;
			});
		},
		[deleteBankRequisites.pending.type]: (state) => {
			state.loading.cardDeleteLoading = true;
			state.loading.load = true;
			state.errorMessage = '';
		},
		[deleteBankRequisites.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading.cardDeleteLoading = false;
			state.loading.load = false;
			state.errorMessage = action.payload;
		},
		[attachBankRequisites.fulfilled.type]: (
			state,
			action: PayloadAction<{ cardId: string; requisiteId: string; bankRequisiteId: string; entityId: number }>,
		) => {
			state.loading.cardAttachLoading = false;
			state.loading.load = false;
			state.errorMessage = '';
			state.cardRequisites = state.cardRequisites.map((cardReq) => {
				if (cardReq.cardId === action.payload.cardId)
					return {
						...cardReq,
						requisites: cardReq.requisites.map((req) => {
							if (req?.id?.toString() === action.payload.requisiteId?.toString()) {
								return {
									...req,
									bank_requisites: req.bank_requisites.map((bankReq) => {
										if (bankReq?.id?.toString() === action.payload.bankRequisiteId?.toString()) {
											return { ...bankReq, is_basic: true, references_relations: [action.payload.entityId] };
										} else {
											return { ...bankReq, is_basic: false, references_relations: [] };
										}
									}),
								};
							} else {
								return req;
							}
						}),
					};
				return cardReq;
			});
		},
		[attachBankRequisites.pending.type]: (state) => {
			state.loading.cardAttachLoading = true;
			state.loading.load = true;
			state.errorMessage = '';
		},
		[attachBankRequisites.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading.cardAttachLoading = false;
			state.loading.load = false;
			state.errorMessage = action.payload;
		},
	},
});

export const { clearCardRequisites } = requisiteReducer.actions;
export default requisiteReducer.reducer;
