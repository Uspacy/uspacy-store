import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { IErrors } from '@uspacy/sdk/lib/models/crm-errors';
import { IEntityFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { IProduct } from '@uspacy/sdk/lib/models/crm-products';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

import { normalizeProducts } from '../../../helpers/normalizeProduct';
import {
	createEntityItem,
	deleteEntityItem,
	fetchEntityItems,
	fetchEntityItemsByStage,
	massItemsDeletion,
	massItemsEditing,
	massItemsStageEditing,
	moveItemFromStageToStage,
	updateEntityItem,
} from './actions';
import { EntityItems, IMoveCardsData, IState } from './types';

const initialState: IState = {};

const initialData = {
	loading: true,
	data: [],
	errorMessage: null,
	meta: undefined,
};

const itemsReducer = createSlice({
	name: 'crm/items',
	initialState,
	reducers: {
		changeReason: (state: IState, action: PayloadAction<{ id: number; reasonId: number | string; entityCode: string }>) => {
			state[action.payload.entityCode].data = state[action.payload.entityCode].data.map((item) => {
				if (item.id === action.payload.id) {
					return {
						...item,
						kanban_reason_id: action.payload.reasonId || '',
					};
				}
				return item;
			});
		},
		clearItems: (state: IState, action: PayloadAction<{ entityCode: string; stageId?: number }>) => {
			const { entityCode, stageId } = action.payload;
			if (state[entityCode]) {
				state[entityCode].data = [];
				state[entityCode].loading = true;
				state[entityCode].errorMessage = null;
				state[entityCode].meta = undefined;
			}

			if (Array.isArray(state[entityCode]?.stages?.[stageId]?.data)) {
				state[entityCode].stages[stageId] = {
					data: [],
					loading: true,
					errorMessage: null,
					meta: undefined,
				};
			}
		},
		setViewModalOpen: (state: IState, action: PayloadAction<{ entityCode: string; value: boolean }>) => {
			const { entityCode, value } = action.payload;
			state[entityCode].viewModalOpen = value;
		},
		setCreateModalOpen: (state: IState, action: PayloadAction<{ entityCode: string; value: boolean }>) => {
			const { entityCode, value } = action.payload;
			state[entityCode].createModalOpen = value;
		},
		setCompleteModalOpen: (state: IState, action: PayloadAction<{ entityCode: string; value: boolean }>) => {
			const { entityCode, value } = action.payload;
			state[entityCode].completeModalOpen = value;
		},
	},
	extraReducers: {
		[fetchEntityItems.fulfilled.type]: (
			state,
			action: PayloadAction<IResponseWithMeta<IEntityData>, string, { arg: { entityCode: string } }>,
		) => {
			const { entityCode } = action.meta.arg;
			state[entityCode].loading = false;
			state[entityCode].errorMessage = null;
			if (entityCode === 'products') {
				state[entityCode].data = normalizeProducts(action.payload.data as unknown as IProduct[]);
			} else {
				state[entityCode].data = action.payload.data;
			}
			state[entityCode].meta = action.payload.meta;
		},
		[fetchEntityItems.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string } }>) => {
			const { entityCode } = action.meta.arg;
			if (!state[entityCode]) {
				state[entityCode] = {
					...initialData,
					stages: {},
				};
			}
			state[entityCode].loading = true;
			state[entityCode].errorMessage = null;
		},
		[fetchEntityItems.rejected.type]: (state, action: PayloadAction<IErrors, string, { arg: { entityCode: string } }>) => {
			const { entityCode } = action.meta.arg;
			state[entityCode].loading = false;
			state[entityCode].errorMessage = action.payload;
			state[entityCode].meta = { total: 0, page: 1, list: 20 };
		},

		[fetchEntityItemsByStage.fulfilled.type]: (
			state,
			action: PayloadAction<IResponseWithMeta<IEntityData>, string, { arg: { entityCode: string; stageId: number } }>,
		) => {
			const { entityCode, stageId } = action.meta.arg;
			state[entityCode].stages[stageId].data = [...state[entityCode].stages[stageId].data, ...action.payload.data];
			state[entityCode].stages[stageId].loading = false;
			state[entityCode].stages[stageId].meta = action.payload.meta;
		},
		[fetchEntityItemsByStage.pending.type]: (
			state,
			action: PayloadAction<
				unknown,
				string,
				{ arg: { entityCode: string; stageId?: number; filters: Omit<IEntityFilters, 'openDatePicker'> } }
			>,
		) => {
			const { entityCode, stageId, filters } = action.meta.arg;
			if (!state[entityCode]) {
				state[entityCode] = {
					...initialData,
					stages: {},
				};
			}
			state[entityCode].stages[stageId] = {
				...initialData,
				...state[entityCode].stages[stageId],
				// page 1 means that we are fetching data for the first time and we need to clear the data
				...(filters.page === 1 && {
					data: [],
					meta: undefined,
				}),
				loading: true,
				errorMessage: null,
			};
		},
		[fetchEntityItemsByStage.rejected.type]: (
			state,
			action: PayloadAction<IErrors, string, { arg: { entityCode: string; stageId: number } }>,
		) => {
			const { entityCode, stageId } = action.meta.arg;
			state[entityCode].stages[stageId].loading = false;
		},

		[updateEntityItem.fulfilled.type]: (
			state,
			action: PayloadAction<IEntityData, string, { arg: { data: IEntityData; entityCode: string; stageId?: number } }>,
		) => {
			const { entityCode } = action.meta.arg;
			const stageId = action.meta.arg.stageId || String(action.meta.arg.data.kanban_stage_id);
			if (Array.isArray(state[entityCode]?.data)) {
				state[entityCode].errorMessage = null;
				state[entityCode].data = state[entityCode].data.map((item) => {
					if (item.id === action.payload.id) {
						return {
							...item,
							...action.payload,
						};
					}
					return item;
				});
			}

			if (Array.isArray(state[entityCode]?.stages?.[stageId]?.data)) {
				state[entityCode].stages[stageId].loading = false;
				state[entityCode].stages[stageId].errorMessage = null;
				state[entityCode].stages[stageId].data = state[entityCode].stages[stageId].data.map((item) => {
					if (item.id === action.payload.id) {
						return {
							...item,
							...action.payload,
						};
					}
					return item;
				});
			}
		},
		[updateEntityItem.pending.type]: (
			state,
			action: PayloadAction<IEntityData, string, { arg: { entityCode: string; data: IEntityData; stageId?: number } }>,
		) => {
			const { entityCode } = action.meta.arg;
			const stageId = action.meta.arg.stageId || String(action.meta.arg.data.kanban_stage_id);
			if (Array.isArray(state[entityCode]?.data)) {
				state[entityCode].errorMessage = null;
			}
			if (Array.isArray(state[entityCode]?.stages?.[stageId]?.data)) {
				state[entityCode].stages[stageId].loading = true;
				state[entityCode].stages[stageId].errorMessage = null;
			}
		},
		[updateEntityItem.rejected.type]: (
			state,
			action: PayloadAction<IErrors, string, { arg: { entityCode: string; data: IEntityData; stageId?: number } }>,
		) => {
			const { entityCode } = action.meta.arg;
			const stageId = action.meta.arg.stageId || String(action.meta.arg.data.kanban_stage_id);
			if (Array.isArray(state[entityCode]?.data)) {
				state[entityCode].errorMessage = action.payload;
			}
			if (Array.isArray(state[entityCode]?.stages?.[stageId]?.data)) {
				state[entityCode].stages[stageId].loading = false;
				state[entityCode].stages[stageId].errorMessage = action.payload;
			}
		},

		[createEntityItem.fulfilled.type]: (
			state,
			action: PayloadAction<IEntityData, string, { arg: { entityCode: string; data: IEntityData; stageId?: number } }>,
		) => {
			const { entityCode } = action.meta.arg;
			const stageId = action.meta.arg.stageId || action.meta.arg.data.kanban_stage_id;
			if (Array.isArray(state[entityCode]?.data)) {
				state[entityCode].loading = false;
				state[entityCode].errorMessage = null;
				state[entityCode].data = [action.payload, ...state[entityCode].data];
				state[entityCode].meta.total = (state[entityCode]?.meta?.total || 0) + 1;
			}
			if (Array.isArray(state[entityCode]?.stages?.[stageId]?.data)) {
				state[entityCode].stages[stageId].data = [action.payload, ...state[entityCode].stages[stageId].data];
				state[entityCode].meta.total = (state[entityCode]?.meta?.total || 0) + 1;
				state[entityCode].stages[stageId].loading = false;
				state[entityCode].stages[stageId].errorMessage = null;
			}
		},
		[createEntityItem.pending.type]: (
			state,
			action: PayloadAction<unknown, string, { arg: { entityCode: string; data: IEntityData; stageId?: number } }>,
		) => {
			const { entityCode } = action.meta.arg;
			const stageId = action.meta.arg.stageId || action.meta.arg.data.kanban_stage_id;
			if (Array.isArray(state[entityCode]?.data)) {
				state[entityCode].loading = true;
				state[entityCode].errorMessage = null;
			}
			if (Array.isArray(state[entityCode]?.stages?.[stageId]?.data)) {
				state[entityCode].stages[stageId].loading = true;
				state[entityCode].stages[stageId].errorMessage = null;
			}
		},
		[createEntityItem.rejected.type]: (
			state,
			action: PayloadAction<IErrors, string, { arg: { entityCode: string; data: IEntityData; stageId?: number } }>,
		) => {
			const { entityCode } = action.meta.arg;
			const stageId = action.meta.arg.stageId || action.meta.arg.data.kanban_stage_id;
			state[entityCode].loading = false;
			state[entityCode].errorMessage = action.payload;
			if (Array.isArray(state[entityCode]?.stages?.[stageId]?.data)) {
				state[entityCode].stages[stageId].loading = false;
				state[entityCode].stages[stageId].errorMessage = action.payload;
			}
		},

		[deleteEntityItem.pending.type]: (
			state,
			action: PayloadAction<unknown, string, { arg: { id: Number; entityCode: string; stageId?: number } }>,
		) => {
			const { entityCode, stageId, id } = action.meta.arg;
			if (Array.isArray(state[entityCode]?.data)) {
				state[entityCode].data = state[entityCode].data.filter((item) => item.id !== id);
				state[entityCode].meta.total--;
			}
			if (Array.isArray(state[entityCode]?.stages?.[stageId]?.data)) {
				state[entityCode].stages[stageId].data = state[entityCode].stages[stageId].data.filter((item) => item.id !== id);
				state[entityCode].stages[stageId].meta.total--;
			}
		},

		[moveItemFromStageToStage.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: IMoveCardsData }>) => {
			const { entityCode } = action.meta.arg;
			state[entityCode].movingCard = false;
			state[entityCode].errorMessage = null;
		},
		[moveItemFromStageToStage.pending.type]: (state, action: PayloadAction<unknown, string, { arg: IMoveCardsData }>) => {
			const { entityCode, stageId, destinationIndex, entityId } = action.meta.arg;
			if (!state[entityCode]) {
				state[entityCode] = { loading: true } as EntityItems;
			}
			state[entityCode].movingCard = true;
			state[entityCode].errorMessage = null;
			if (state[entityCode]?.stages) {
				// TODO move to fulfilled after backend optimization
				state[entityCode].data = state[entityCode].data.map((item) => {
					if (item.id === action.meta.arg.entityId) {
						return {
							...item,
							kanban_stage_id: stageId,
							updated_at: Math.floor(new Date().valueOf() / 1000),
							kanban_reason_id: action.meta.arg.reason_id,
							changed_by: action.meta.arg.profileId,
							...(action.meta.arg.isFinishedStage && {
								first_closed_at: item?.first_closed_at || Math.floor(new Date().valueOf() / 1000),
								closed_at: Math.floor(new Date().valueOf() / 1000),
								first_closed_by: item?.first_closed_by || action.meta.arg.profileId,
								closed_by: action.meta.arg.profileId,
							}),
						};
					}
					return item;
				});
				let foundEntityItem;
				for (const stage of Object.values(state[entityCode].stages)) {
					foundEntityItem = stage.data.find((item) => item.id === action.meta.arg.entityId);
					if (foundEntityItem) {
						break;
					}
				}
				if (!foundEntityItem) {
					return;
				}
				state[entityCode].stages = Object.fromEntries(
					Object.entries(state[entityCode].stages).map(([key, value]) => {
						if (+key === stageId) {
							const data = value.data;
							data.splice(destinationIndex || 0, 0, {
								...foundEntityItem,
								...(action.meta.arg.isFinishedStage && {
									first_closed_at: foundEntityItem?.first_closed_at || Math.floor(new Date().valueOf() / 1000),
									closed_at: Math.floor(new Date().valueOf() / 1000),
									first_closed_by: foundEntityItem?.first_closed_by || action.meta.arg.profileId,
									closed_by: action.meta.arg.profileId,
								}),
							});
							return [
								key,
								{
									...value,
									data,
									meta: { ...value.meta, total: (value?.meta?.total || 0) + 1 },
								},
							];
						}
						const filteredData = value.data.filter((item) => item.id !== entityId);
						const total = filteredData.length === value.data.length ? value.meta?.total : value.meta?.total - 1;
						return [key, { ...value, data: filteredData, meta: { ...value.meta, total: total || 0 } }];
					}),
				);
			}
		},
		[moveItemFromStageToStage.rejected.type]: (state, action: PayloadAction<IErrors, string, { arg: IMoveCardsData }>) => {
			const { entityCode } = action.meta.arg;
			if (!state[entityCode]) {
				state[entityCode] = { loading: true } as EntityItems;
			}
			state[entityCode].movingCard = false;
			state[entityCode].errorMessage = action.payload;
		},

		[massItemsEditing.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: IMassActions & { entityCode: string } }>) => {
			const { entityCode } = action.meta.arg;
			if (!state?.[entityCode]) return;
			state[entityCode].loading = false;
			state[entityCode].errorMessage = null;
		},
		[massItemsEditing.pending.type]: (state, action: PayloadAction<unknown, string, { arg: IMassActions & { entityCode: string } }>) => {
			const { entityCode } = action.meta.arg;
			if (!state?.[entityCode]) return;
			state[entityCode].loading = true;
			state[entityCode].errorMessage = null;
		},
		[massItemsEditing.rejected.type]: (state, action: PayloadAction<IErrors, string, { arg: IMassActions & { entityCode: string } }>) => {
			const { entityCode } = action.meta.arg;
			if (!state?.[entityCode]) return;
			state[entityCode].loading = false;
			state[entityCode].errorMessage = action.payload;
		},

		[massItemsStageEditing.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: IMassActions & { entityCode: string } }>) => {
			const { entityCode } = action.meta.arg;
			state[entityCode].loading = false;
			state[entityCode].errorMessage = null;
		},
		[massItemsStageEditing.pending.type]: (state, action: PayloadAction<unknown, string, { arg: IMassActions & { entityCode: string } }>) => {
			const { entityCode } = action.meta.arg;
			state[entityCode].loading = true;
			state[entityCode].errorMessage = null;
		},
		[massItemsStageEditing.rejected.type]: (state, action: PayloadAction<IErrors, string, { arg: IMassActions & { entityCode: string } }>) => {
			const { entityCode } = action.meta.arg;
			state[entityCode].loading = false;
			state[entityCode].errorMessage = action.payload;
		},

		[massItemsDeletion.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: IMassActions & { entityCode: string } }>) => {
			const { entityCode } = action.meta.arg;
			if (!state?.[entityCode]) return;
			const hasKandban = Array.isArray(Object.keys(state[entityCode]?.stages || {}));
			state[entityCode].loading = false;
			state[entityCode].errorMessage = null;
			state[entityCode].data = state[entityCode].data.filter((item) => !action.meta.arg.entityIds.map(Number).includes(item.id));

			if (hasKandban) {
				Object.keys(state[entityCode].stages).forEach((stageId) => {
					state[entityCode].stages[stageId].data = state[entityCode].stages[stageId].data.filter(
						(item) => !action.meta.arg.exceptIds.map(Number).includes(item.id),
					);
				});
			}
			if (action.meta.arg.all) {
				if (hasKandban) {
					Object.keys(state[entityCode].stages).forEach((stageId) => {
						state[entityCode].stages[stageId].meta.total = 0;
					});
				}
				state[entityCode].meta.total = 0;
			} else if (action.meta.arg.all && action.meta.arg.exceptIds.length) {
				state[entityCode].meta.total = action.meta.arg.exceptIds.length;
				if (hasKandban) {
					Object.keys(state[entityCode].stages).forEach((stageId) => {
						state[entityCode].stages[stageId].meta.total = action.meta.arg.exceptIds.length;
					});
				}
			} else {
				state[entityCode].meta.total -= action.meta.arg.entityIds.length;
				if (hasKandban) {
					Object.keys(state[entityCode].stages).forEach((stageId) => {
						state[entityCode].stages[stageId].meta.total -= action.meta.arg.exceptIds.length;
					});
				}
			}
		},
		[massItemsDeletion.pending.type]: (state, action: PayloadAction<unknown, string, { arg: IMassActions & { entityCode: string } }>) => {
			const { entityCode } = action.meta.arg;
			if (!state?.[entityCode]) return;
			state[entityCode].loading = true;
			state[entityCode].errorMessage = null;
		},
		[massItemsDeletion.rejected.type]: (state, action: PayloadAction<IErrors, string, { arg: IMassActions & { entityCode: string } }>) => {
			const { entityCode } = action.meta.arg;
			if (!state?.[entityCode]) return;
			state[entityCode].loading = false;
			state[entityCode].errorMessage = action.payload;
		},
	},
});
export const { changeReason, clearItems, setViewModalOpen, setCreateModalOpen, setCompleteModalOpen } = itemsReducer.actions;
export default itemsReducer.reducer;
