import { createSlice, current, isDraft, PayloadAction } from '@reduxjs/toolkit';
import { IEntityAmount, IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { IErrors } from '@uspacy/sdk/lib/models/crm-errors';
import { IEntityFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IKanbanBoardResponse } from '@uspacy/sdk/lib/models/crm-kanban';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { IProduct } from '@uspacy/sdk/lib/models/crm-products';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

import { normalizeProducts } from '../../../helpers/normalizeProduct';
import {
	createEntityItem,
	deleteEntityItem,
	fetchEntityItems,
	fetchEntityItemsByStage,
	fetchEntityItemsByTimePeriod,
	fetchKanbanBoard,
	getEntitiesCurrenciesAmount,
	massItemsDeletion,
	massItemsEditing,
	massItemsStageEditing,
	moveItemFromStageToStage,
	updateEntityItem,
	uploadEntityItemAvatar,
} from './actions';
import { findItemInStages, insertIntoStage, isStale, moveCardBetweenStages, patchItemInList, removeFromStage } from './stageHelpers';
import { EntityItems, IMoveCardsData, IMoveRollback, IState } from './types';

const snapshot = <T extends object>(value: T): T => (isDraft(value) ? (current(value) as T) : { ...value });

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
		clearItems: (state: IState, action: PayloadAction<{ entityCode: string; stageId?: number; timePeriod?: string }>) => {
			const { entityCode, stageId, timePeriod } = action.payload;
			if (state[entityCode]) {
				state[entityCode].data = [];
				state[entityCode].loading = true;
				state[entityCode].errorMessage = null;
				state[entityCode].meta = undefined;
				state[entityCode].pendingNewItems = [];
			}

			if (Array.isArray(state[entityCode]?.stages?.[stageId]?.data)) {
				state[entityCode].stages[stageId] = {
					data: [],
					loading: true,
					errorMessage: null,
					meta: undefined,
				};
			}

			if (Array.isArray(state[entityCode]?.timePeriods?.[timePeriod]?.data)) {
				state[entityCode].timePeriods[timePeriod] = {
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
		updateEntityItemLocal: (state, action: PayloadAction<{ data: IEntityData; entityCode: string; stageId?: number }>) => {
			const { entityCode, stageId, data } = action.payload;
			const entity = state[entityCode];
			if (!entity || !data?.id) return;

			if (patchItemInList(entity.data, data)) entity.errorMessage = null;

			if (entity.stages) {
				const location = findItemInStages(entity, data.id, stageId ?? data.kanban_stage_id);
				if (location) {
					const stage = entity.stages[location.key];
					const currentItem = stage.data[location.index];
					if (!isStale(data, currentItem)) {
						const targetKey = data.kanban_stage_id ? String(data.kanban_stage_id) : location.key;
						if (targetKey !== location.key) {
							// safety net: the entity is in another stage on the server than on the board
							moveCardBetweenStages(entity, {
								id: data.id,
								targetStageId: targetKey,
								sourceStageId: location.key,
								data,
								removeOnly: !entity.stages[targetKey],
							});
						} else {
							stage.data[location.index] = { ...currentItem, ...data };
							stage.loading = false;
							stage.errorMessage = null;
						}
					}
				}
			}

			patchItemInList(entity.pendingNewItems, data);
		},
		moveItemFromStageToStageLocal: (state, action: PayloadAction<IMoveCardsData>) => {
			const {
				entityCode,
				entityId,
				stageId,
				reason_id: reasonId,
				funnelHasChanged,
				sourceStageId,
				item: payloadItem,
				partial,
			} = action.payload;
			const entity = state[entityCode];
			if (!entity) return;

			const patch = {
				...(payloadItem || {}),
				id: entityId,
				kanban_stage_id: stageId,
				kanban_reason_id: reasonId ?? payloadItem?.kanban_reason_id ?? null,
				updated_at: payloadItem?.updated_at || Math.floor(new Date().valueOf() / 1000),
			} as IEntityData;

			patchItemInList(entity.data, patch);
			patchItemInList(entity.pendingNewItems, patch);

			if (!entity.stages) return;

			const location = findItemInStages(entity, entityId, sourceStageId);
			if (location && isStale(patch, entity.stages[location.key].data[location.index])) return;

			const listItem = Array.isArray(entity.data) ? entity.data.find((it) => it.id === entityId) : undefined;
			moveCardBetweenStages(entity, {
				id: entityId,
				targetStageId: stageId,
				sourceStageId: location?.key ?? sourceStageId,
				data: patch,
				removeOnly: !!funnelHasChanged || !entity.stages[String(stageId)],
				fallbackItem: listItem ? { ...listItem, ...patch } : payloadItem && !partial ? patch : undefined,
			});
		},
		deleteEntityItemLocal: (state, action: PayloadAction<{ id: number; entityCode: string; stageId?: number }>) => {
			const { entityCode, stageId, id } = action.payload;
			if (Array.isArray(state[entityCode]?.data)) {
				state[entityCode].data = state[entityCode].data.filter((item) => item.id !== id);
				if (state[entityCode].meta) state[entityCode].meta.total--;
			}
			if (Array.isArray(state[entityCode]?.stages?.[stageId]?.data)) {
				state[entityCode].stages[stageId].data = state[entityCode].stages[stageId].data.filter((item) => item.id !== id);
				if (state[entityCode].stages[stageId].meta) state[entityCode].stages[stageId].meta.total--;
			}
			if (state[entityCode]?.pendingNewItems?.length) {
				const wasOnlyInPending = !state[entityCode].data.some((item) => item.id === id);
				state[entityCode].pendingNewItems = state[entityCode].pendingNewItems.filter((item) => item.id !== id);
				if (wasOnlyInPending && state[entityCode].meta) {
					state[entityCode].meta.total = Math.max((state[entityCode].meta.total || 1) - 1, 0);
				}
			}
		},
		addEntityItemToStageLocal: (state, action: PayloadAction<{ item: IEntityData; entityCode: string; stageId: number }>) => {
			const { entityCode, stageId, item } = action.payload;
			if (!state[entityCode]?.stages?.[stageId]) return;
			if (!Array.isArray(state[entityCode].stages[stageId].data)) return;
			const alreadyInStage = state[entityCode].stages[stageId].data.some((i) => i.id === item.id);
			if (!alreadyInStage) {
				state[entityCode].stages[stageId].data = [item, ...state[entityCode].stages[stageId].data];
				if (state[entityCode].stages[stageId].meta) {
					state[entityCode].stages[stageId].meta.total++;
				}
			}
		},
		addPendingNewItem: (state, action: PayloadAction<{ entityCode: string; item: IEntityData }>) => {
			const { entityCode, item } = action.payload;
			if (!state[entityCode]) return;
			const alreadyPending = state[entityCode].pendingNewItems?.some((i) => i.id === item.id);
			if (alreadyPending) return;
			state[entityCode].pendingNewItems = [item, ...(state[entityCode].pendingNewItems ?? [])];
			if (state[entityCode].meta) {
				state[entityCode].meta.total++;
			}
		},
		removePendingItem: (state, action: PayloadAction<{ entityCode: string; id: number }>) => {
			const { entityCode, id } = action.payload;
			if (!state[entityCode]?.pendingNewItems?.length) return;
			const wasInPending = state[entityCode].pendingNewItems.some((item) => item.id === id);
			if (!wasInPending) return;
			state[entityCode].pendingNewItems = state[entityCode].pendingNewItems.filter((item) => item.id !== id);
			if (state[entityCode].meta) {
				state[entityCode].meta.total = Math.max((state[entityCode].meta.total || 1) - 1, 0);
			}
		},
		flushPendingNewItems: (state, action: PayloadAction<{ entityCode: string }>) => {
			const { entityCode } = action.payload;
			if (!state[entityCode]) return;
			const pending = state[entityCode].pendingNewItems ?? [];
			if (!pending.length) return;
			const existingIds = new Set(state[entityCode].data.map((i) => i.id));
			const toAdd = pending.filter((i) => !existingIds.has(i.id));
			state[entityCode].data = [...toAdd, ...state[entityCode].data];
			state[entityCode].pendingNewItems = [];
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
			state[entityCode].pendingNewItems = [];
		},
		[fetchEntityItems.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string } }>) => {
			const { entityCode } = action.meta.arg;
			if (!state[entityCode]) {
				state[entityCode] = {
					...initialData,
					stages: {},
					timePeriods: {},
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
			if (state?.[entityCode]?.stages?.[stageId]) {
				state[entityCode].stages[stageId].loading = false;
			}
		},

		[fetchKanbanBoard.fulfilled.type]: (
			state,
			action: PayloadAction<IKanbanBoardResponse, string, { arg: { entityCode: string; stageIds: (string | number)[] } }>,
		) => {
			const { entityCode } = action.meta.arg;
			if (!state[entityCode]) {
				state[entityCode] = { ...initialData, stages: {} };
			}
			Object.entries(action.payload?.stages || {}).forEach(([stageId, stage]) => {
				state[entityCode].stages[stageId] = {
					...initialData,
					...state[entityCode].stages[stageId],
					data: stage.data,
					meta: stage.meta,
					currencyAmount: stage.amount ?? undefined,
					loading: false,
					loadingCurrencyAmount: false,
					errorMessage: null,
				};
			});
		},
		[fetchKanbanBoard.pending.type]: (
			state,
			action: PayloadAction<unknown, string, { arg: { entityCode: string; stageIds: (string | number)[] } }>,
		) => {
			const { entityCode, stageIds } = action.meta.arg;
			if (!state[entityCode]) {
				state[entityCode] = { ...initialData, stages: {} };
			}
			(stageIds || []).forEach((stageId) => {
				state[entityCode].stages[stageId] = {
					...initialData,
					...state[entityCode].stages[stageId],
					// batch replaces the first page — clear stale data so infinite scroll restarts from page 1
					data: [],
					meta: undefined,
					loading: true,
					loadingCurrencyAmount: true,
					errorMessage: null,
				};
			});
		},
		[fetchKanbanBoard.rejected.type]: (
			state,
			action: PayloadAction<IErrors, string, { arg: { entityCode: string; stageIds: (string | number)[] } }>,
		) => {
			const { entityCode, stageIds } = action.meta.arg;
			(stageIds || []).forEach((stageId) => {
				if (state?.[entityCode]?.stages?.[stageId]) {
					state[entityCode].stages[stageId].loading = false;
					state[entityCode].stages[stageId].loadingCurrencyAmount = false;
				}
			});
		},
		[updateEntityItem.fulfilled.type]: (
			state,
			action: PayloadAction<IEntityData, string, { arg: { data: IEntityData; entityCode: string; stageId?: number; timePeriod?: string } }>,
		) => {
			const { entityCode, timePeriod } = action.meta.arg;
			const entity = state[entityCode];
			const server = action.payload;
			const stageId = action.meta.arg.stageId || action.meta.arg.data?.kanban_stage_id;
			if (!entity) return;

			if (Array.isArray(entity.data)) entity.errorMessage = null;
			if (stageId && entity.stages?.[stageId]) {
				entity.stages[stageId].loading = false;
				entity.stages[stageId].errorMessage = null;
			}
			if (!server?.id) return;

			patchItemInList(entity.data, server, false);
			patchItemInList(entity.pendingNewItems, server, false);

			if (entity.stages) {
				const location = findItemInStages(entity, server.id, stageId);
				if (location) {
					const targetKey = server.kanban_stage_id ? String(server.kanban_stage_id) : location.key;
					if (targetKey !== location.key) {
						moveCardBetweenStages(entity, {
							id: server.id,
							targetStageId: targetKey,
							sourceStageId: location.key,
							data: server,
							removeOnly: !entity.stages[targetKey],
						});
					} else {
						const stage = entity.stages[location.key];
						stage.data[location.index] = { ...stage.data[location.index], ...server };
					}
				}
			}

			if (Array.isArray(entity.timePeriods?.[timePeriod]?.data)) {
				entity.timePeriods[timePeriod].loading = false;
				entity.timePeriods[timePeriod].errorMessage = null;
				patchItemInList(entity.timePeriods[timePeriod].data, server, false);
			}
		},
		[updateEntityItem.pending.type]: (
			state,
			action: PayloadAction<IEntityData, string, { arg: { entityCode: string; data: IEntityData; stageId?: number; timePeriod?: string } }>,
		) => {
			const { entityCode, timePeriod } = action.meta.arg;
			const stageId = action.meta.arg.stageId || String(action.meta.arg.data.kanban_stage_id);
			if (Array.isArray(state[entityCode]?.data)) {
				state[entityCode].errorMessage = null;
			}
			if (Array.isArray(state[entityCode]?.stages?.[stageId]?.data)) {
				state[entityCode].stages[stageId].loading = true;
				state[entityCode].stages[stageId].errorMessage = null;
			}

			if (Array.isArray(state[entityCode]?.timePeriods?.[timePeriod]?.data)) {
				state[entityCode].timePeriods[timePeriod].loading = true;
				state[entityCode].timePeriods[timePeriod].errorMessage = null;
			}
		},
		[updateEntityItem.rejected.type]: (
			state,
			action: PayloadAction<IErrors, string, { arg: { entityCode: string; data: IEntityData; stageId?: number; timePeriod?: string } }>,
		) => {
			const { entityCode, timePeriod } = action.meta.arg;
			const stageId = action.meta.arg.stageId || String(action.meta.arg.data.kanban_stage_id);
			if (Array.isArray(state[entityCode]?.data)) {
				state[entityCode].errorMessage = action.payload;
			}
			if (Array.isArray(state[entityCode]?.stages?.[stageId]?.data)) {
				state[entityCode].stages[stageId].loading = false;
				state[entityCode].stages[stageId].errorMessage = action.payload;
			}
			if (Array.isArray(state[entityCode]?.timePeriods?.[timePeriod]?.data)) {
				state[entityCode].timePeriods[timePeriod].loading = false;
				state[entityCode].timePeriods[timePeriod].errorMessage = action.payload;
			}
		},

		[createEntityItem.fulfilled.type]: (
			state,
			action: PayloadAction<IEntityData, string, { arg: { entityCode: string; data: IEntityData; stageId?: number; timePeriod?: string } }>,
		) => {
			const { entityCode } = action.meta.arg;
			const stageId = action.meta.arg.stageId || action.meta.arg.data.kanban_stage_id;
			if (Array.isArray(state[entityCode]?.data)) {
				state[entityCode].loading = false;
				state[entityCode].errorMessage = null;
				state[entityCode].data = [action.payload, ...state[entityCode].data];
				if (state[entityCode].meta) state[entityCode].meta.total++;
			}
			if (Array.isArray(state[entityCode]?.stages?.[stageId]?.data)) {
				state[entityCode].stages[stageId].data = [action.payload, ...state[entityCode].stages[stageId].data];
				if (state[entityCode].stages[stageId].meta) state[entityCode].stages[stageId].meta.total++;
				state[entityCode].stages[stageId].loading = false;
				state[entityCode].stages[stageId].errorMessage = null;
			}
		},
		[createEntityItem.pending.type]: (
			state,
			action: PayloadAction<unknown, string, { arg: { entityCode: string; data: IEntityData; stageId?: number; timePeriod?: string } }>,
		) => {
			const { entityCode, timePeriod } = action.meta.arg;
			const stageId = action.meta.arg.stageId || action.meta.arg.data.kanban_stage_id;
			if (Array.isArray(state[entityCode]?.data)) {
				state[entityCode].loading = true;
				state[entityCode].errorMessage = null;
			}
			if (Array.isArray(state[entityCode]?.stages?.[stageId]?.data)) {
				state[entityCode].stages[stageId].loading = true;
				state[entityCode].stages[stageId].errorMessage = null;
			}
			if (Array.isArray(state[entityCode]?.timePeriods?.[timePeriod]?.data)) {
				state[entityCode].timePeriods[timePeriod].loading = true;
				state[entityCode].timePeriods[timePeriod].errorMessage = null;
			}
		},
		[createEntityItem.rejected.type]: (
			state,
			action: PayloadAction<IErrors, string, { arg: { entityCode: string; data: IEntityData; stageId?: number; timePeriod?: string } }>,
		) => {
			const { entityCode, timePeriod } = action.meta.arg;
			const stageId = action.meta.arg.stageId || action.meta.arg.data.kanban_stage_id;
			state[entityCode].loading = false;
			state[entityCode].errorMessage = action.payload;
			if (Array.isArray(state[entityCode]?.stages?.[stageId]?.data)) {
				state[entityCode].stages[stageId].loading = false;
				state[entityCode].stages[stageId].errorMessage = action.payload;
			}
			if (Array.isArray(state[entityCode]?.timePeriods?.[timePeriod]?.data)) {
				state[entityCode].timePeriods[timePeriod].loading = false;
				state[entityCode].timePeriods[timePeriod].errorMessage = action.payload;
			}
		},

		[deleteEntityItem.pending.type]: (
			state,
			action: PayloadAction<unknown, string, { arg: { id: Number; entityCode: string; stageId?: number; timePeriod?: string } }>,
		) => {
			const { entityCode, stageId, id, timePeriod } = action.meta.arg;
			if (Array.isArray(state[entityCode]?.data)) {
				state[entityCode].data = state[entityCode].data.filter((item) => item.id !== id);
				if (state[entityCode].meta) state[entityCode].meta.total--;
			}
			if (Array.isArray(state[entityCode]?.stages?.[stageId]?.data)) {
				state[entityCode].stages[stageId].data = state[entityCode].stages[stageId].data.filter((item) => item.id !== id);
				if (state[entityCode].stages[stageId].meta) state[entityCode].stages[stageId].meta.total--;
			}
			if (Array.isArray(state[entityCode]?.timePeriods?.[timePeriod]?.data)) {
				state[entityCode].timePeriods[timePeriod].data = state[entityCode].timePeriods[timePeriod].data.filter((item) => item.id !== id);
				state[entityCode].timePeriods[timePeriod].meta.total--;
			}
		},

		[moveItemFromStageToStage.fulfilled.type]: (
			state,
			action: PayloadAction<IEntityData, string, { arg: IMoveCardsData; requestId: string }>,
		) => {
			const { entityCode, stageId } = action.meta.arg;
			const entity = state[entityCode];
			if (!entity) return;
			entity.movingCard = false;
			entity.errorMessage = null;
			if (entity.moveRollbacks) delete entity.moveRollbacks[action.meta.requestId];

			const server = action.payload;
			if (!server?.id) return;

			// server response is the source of truth (closed_at, closed_by, kanban_status, required fields, ...)
			patchItemInList(entity.data, server, false);
			patchItemInList(entity.pendingNewItems, server, false);

			if (!entity.stages) return;
			const serverStageKey = String(server.kanban_stage_id ?? stageId);
			const location = findItemInStages(entity, server.id, serverStageKey);
			if (!location) return;
			if (location.key !== serverStageKey) {
				moveCardBetweenStages(entity, {
					id: server.id,
					targetStageId: serverStageKey,
					sourceStageId: location.key,
					data: server,
					removeOnly: !entity.stages[serverStageKey],
				});
				return;
			}
			const stage = entity.stages[location.key];
			stage.data[location.index] = { ...stage.data[location.index], ...server };
		},
		[moveItemFromStageToStage.pending.type]: (state, action: PayloadAction<unknown, string, { arg: IMoveCardsData; requestId: string }>) => {
			const {
				entityCode,
				stageId,
				destinationIndex,
				entityId,
				reason_id: reasonId,
				profileId,
				isFinishedStage,
				funnelHasChanged,
				sourceStageId,
			} = action.meta.arg;
			if (!state[entityCode]) {
				state[entityCode] = { loading: true } as EntityItems;
			}
			const entity = state[entityCode];
			entity.movingCard = true;
			entity.errorMessage = null;

			const now = Math.floor(new Date().valueOf() / 1000);
			const withMove = (item: IEntityData): IEntityData => ({
				...item,
				kanban_stage_id: stageId,
				kanban_reason_id: reasonId ?? null,
				updated_at: now,
				changed_by: profileId,
				...(isFinishedStage && {
					first_closed_at: item?.first_closed_at || now,
					closed_at: now,
					first_closed_by: item?.first_closed_by || profileId,
					closed_by: profileId,
				}),
			});

			const rollback: IMoveRollback = { entityId, targetStageKey: String(stageId), insertedIntoTarget: false };

			const listIndex = Array.isArray(entity.data) ? entity.data.findIndex((item) => item.id === entityId) : -1;
			if (listIndex !== -1) {
				rollback.listItem = snapshot(entity.data[listIndex]);
				entity.data[listIndex] = withMove(entity.data[listIndex]);
			}

			const location = findItemInStages(entity, entityId, sourceStageId);
			if (location) {
				const source = entity.stages[location.key];
				rollback.sourceStageKey = location.key;
				rollback.sourceIndex = location.index;
				rollback.stageItem = snapshot(source.data[location.index]);

				if (location.key === rollback.targetStageKey) {
					source.data[location.index] = withMove(source.data[location.index]);
				} else {
					const removed = removeFromStage(source, location.index);
					const target = entity.stages[rollback.targetStageKey];
					if (!funnelHasChanged && Array.isArray(target?.data)) {
						rollback.insertedIntoTarget = insertIntoStage(target, withMove(removed), destinationIndex || 0);
					}
				}
			}

			if (!entity.moveRollbacks) entity.moveRollbacks = {};
			entity.moveRollbacks[action.meta.requestId] = rollback;
		},
		[moveItemFromStageToStage.rejected.type]: (state, action: PayloadAction<IErrors, string, { arg: IMoveCardsData; requestId: string }>) => {
			const { entityCode } = action.meta.arg;
			if (!state[entityCode]) {
				state[entityCode] = { loading: true } as EntityItems;
			}
			const entity = state[entityCode];
			entity.movingCard = false;
			entity.errorMessage = action.payload;

			const rollback = entity.moveRollbacks?.[action.meta.requestId];
			if (!rollback) return;
			delete entity.moveRollbacks[action.meta.requestId];

			if (rollback.listItem && Array.isArray(entity.data)) {
				const listIndex = entity.data.findIndex((item) => item.id === rollback.entityId);
				if (listIndex !== -1) entity.data[listIndex] = rollback.listItem;
			}

			if (!entity.stages || !rollback.sourceStageKey || !rollback.stageItem) return;
			const source = entity.stages[rollback.sourceStageKey];

			if (rollback.sourceStageKey === rollback.targetStageKey) {
				const index = source?.data?.findIndex((item) => item.id === rollback.entityId) ?? -1;
				if (index !== -1) source.data[index] = rollback.stageItem;
				return;
			}

			if (rollback.insertedIntoTarget) {
				const target = entity.stages[rollback.targetStageKey];
				const index = target?.data?.findIndex((item) => item.id === rollback.entityId) ?? -1;
				if (index !== -1) removeFromStage(target, index);
			}
			if (Array.isArray(source?.data)) insertIntoStage(source, rollback.stageItem, rollback.sourceIndex);
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
			state[entityCode].data = state[entityCode].data.filter((item) => !(action.meta.arg.entityIds || []).map(Number).includes(item.id));

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
				state[entityCode].meta.total -= action.meta.arg.entityIds?.length || 0;
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
		[getEntitiesCurrenciesAmount.fulfilled.type]: (
			state,
			action: PayloadAction<IEntityAmount, string, { arg: { entityCode: string; stageId: number } }>,
		) => {
			const { entityCode, stageId } = action.meta.arg;

			if (!state[entityCode]?.stages?.[stageId]) return;
			state[entityCode].stages[stageId].currencyAmount = action.payload;
			state[entityCode].stages[stageId].loadingCurrencyAmount = false;
			state[entityCode].stages[stageId].errorCurrencyAmount = null;
		},
		[getEntitiesCurrenciesAmount.pending.type]: (
			state,
			action: PayloadAction<
				unknown,
				string,
				{ arg: { entityCode: string; stageId?: number; filters: Omit<IEntityFilters, 'openDatePicker'> } }
			>,
		) => {
			const { entityCode, stageId } = action.meta.arg;
			if (!state[entityCode]) {
				state[entityCode] = {
					...initialData,
					stages: {},
				};
			}
			state[entityCode].stages[stageId] = {
				...state[entityCode].stages[stageId],
				loadingCurrencyAmount: true,
				errorCurrencyAmount: null,
			};
		},
		[getEntitiesCurrenciesAmount.rejected.type]: (
			state,
			action: PayloadAction<IErrors, string, { arg: { entityCode: string; stageId: number } }>,
		) => {
			const { entityCode, stageId } = action.meta.arg;
			if (!state[entityCode]?.stages?.[stageId]) return;
			state[entityCode].stages[stageId].loadingCurrencyAmount = false;
		},
		[fetchEntityItemsByTimePeriod.fulfilled.type]: (
			state,
			action: PayloadAction<IResponseWithMeta<IEntityData>, string, { arg: { entityCode: string; timePeriod: string } }>,
		) => {
			const { entityCode, timePeriod } = action.meta.arg;

			state[entityCode].timePeriods[timePeriod].data = [...state[entityCode].timePeriods[timePeriod].data, ...action.payload.data];
			state[entityCode].timePeriods[timePeriod].loading = false;
			state[entityCode].timePeriods[timePeriod].meta = action.payload.meta;
		},
		[fetchEntityItemsByTimePeriod.pending.type]: (
			state,
			action: PayloadAction<
				unknown,
				string,
				{ arg: { entityCode: string; timePeriod: string; filters: Omit<IEntityFilters, 'openDatePicker'> } }
			>,
		) => {
			const { entityCode, timePeriod, filters } = action.meta.arg;
			if (!state[entityCode]) {
				state[entityCode] = {
					...initialData,
					timePeriods: {},
				};
			}
			state[entityCode].timePeriods[timePeriod] = {
				...initialData,
				...state[entityCode].timePeriods[timePeriod],
				// page 1 means that we are fetching data for the first time and we need to clear the data
				...(filters.page === 1 && {
					data: [],
					meta: undefined,
				}),
				loading: true,
				errorMessage: null,
			};
		},
		[fetchEntityItemsByTimePeriod.rejected.type]: (
			state,
			action: PayloadAction<IErrors, string, { arg: { entityCode: string; timePeriod: string } }>,
		) => {
			const { entityCode, timePeriod } = action.meta.arg;

			state[entityCode].timePeriods[timePeriod].loading = false;
		},
		[uploadEntityItemAvatar.fulfilled.type]: (
			state,
			action: PayloadAction<IEntityData, string, { arg: { data: IEntityData; entityCode: string } }>,
		) => {
			const { entityCode } = action.meta.arg;
			if (Array.isArray(state[entityCode]?.data)) {
				state[entityCode].errorMessage = null;
				state[entityCode].data = state[entityCode].data.map((item) => {
					if (item.id === action.payload.id) {
						return {
							...item,
							crm_avatar: action.payload?.crm_avatar,
						};
					}
					return item;
				});
			}
		},
		[uploadEntityItemAvatar.pending.type]: (
			state,
			action: PayloadAction<IEntityData, string, { arg: { entityCode: string; data: IEntityData } }>,
		) => {
			const { entityCode } = action.meta.arg;
			if (Array.isArray(state[entityCode]?.data)) {
				state[entityCode].errorMessage = null;
			}
		},
		[uploadEntityItemAvatar.rejected.type]: (
			state,
			action: PayloadAction<IErrors, string, { arg: { entityCode: string; data: IEntityData } }>,
		) => {
			const { entityCode } = action.meta.arg;
			if (Array.isArray(state[entityCode]?.data)) {
				state[entityCode].errorMessage = action.payload;
			}
		},
	},
});
export const {
	changeReason,
	clearItems,
	setViewModalOpen,
	setCreateModalOpen,
	setCompleteModalOpen,
	updateEntityItemLocal,
	moveItemFromStageToStageLocal,
	deleteEntityItemLocal,
	addEntityItemToStageLocal,
	addPendingNewItem,
	removePendingItem,
	flushPendingNewItems,
} = itemsReducer.actions;
export default itemsReducer.reducer;
