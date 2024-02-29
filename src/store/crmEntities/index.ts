/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICardBlock } from '@uspacy/sdk/lib/models/crm-card-blocks';
import { IEntity, IEntityData, IEntityMain, IEntityMainData } from '@uspacy/sdk/lib/models/crm-entities';
import { IErrors } from '@uspacy/sdk/lib/models/crm-errors';
import { IFilterPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { IEntityFilters, IFilter } from '@uspacy/sdk/lib/models/crm-filters';
import { IFunnel } from '@uspacy/sdk/lib/models/crm-funnel';
import { IColumns, IDnDItem } from '@uspacy/sdk/lib/models/crm-kanban';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { IReason, IStage, IStages } from '@uspacy/sdk/lib/models/crm-stages';
import { IField, IFields, IFieldValue } from '@uspacy/sdk/lib/models/field';

import { idColumn, OTHER_DEFAULT_FIELDS } from './../../const';
import { getField } from './../../helpers/filterFieldsArrs';
import { sortStagesWhenCreateNew } from './../../helpers/sortStagesWhenCreateNew';
import {
	createFieldForUniversalEntity,
	createFunnelForUniversalEntity,
	createReasonsForUniversalEntity,
	createStageForUniversalEntity,
	createUniversalEntity,
	createUniversalEntityItem,
	createUniversalEntityItemFromKanban,
	deleteFieldForUniversalEntity,
	deleteFunnelForUniversalEntity,
	deleteListValuesForUniversalEntity,
	deleteStageForUniversalEntity,
	deleteUniversalEntity,
	deleteUniversalEntityItem,
	editFunnelForUniversalEntity,
	editReasonForUniversalEntity,
	editStageForUniversalEntity,
	editUniversalEntity,
	fetchEntities,
	fetchEntitiesWithFunnels,
	fetchEntityItemsForUniversalEntity,
	fetchFieldsForUniversalEntity,
	fetchStagesForUniversalEntity,
	fetchUniversalEntityItemsWithFilters,
	fetchUniversalFunnel,
	massUniversalEntityItemsDeletion,
	massUniversalEntityItemsEditing,
	moveUniversalItemFromStageToStage,
	updateFieldForUniversalEntity,
	updateListValuesForUniversalEntity,
	updateUniversalEntityItem,
} from './actions';
import { IMoveCardsData, IState } from './types';

export const initialEntityFilterPreset = {
	isNewPreset: false,
	currentPreset: {},
	standardPreset: {},
	filterPresets: [],
};

export const initialEntityItemFilter: IEntityFilters = {
	created_at: [],
	updated_at: [],
	created_at_period: [],
	updated_at_period: [],
	created_by: [],
	changed_by: [],
	time_label: [],
	certainDateOrPeriod: [],
	owner: [],
	search: '',
	page: 0,
	perPage: 0,
	select: 0,
	entityCode: '',
	boolean_operator: '',
	stages: [],
	openDatePicker: false,
	table_fields: [],
};

const stage = {
	name: 'stage',
	code: 'kanban_stage_id',
	required: false,
	editable: false,
	show: true,
	hidden: false,
	multiple: false,
	type: 'stage',
	fieldSectionId: '',
	sort: '',
	defaultValue: '',
	system_field: false,
};

const initialDnD = {
	fromColumnId: '',
	toColumnId: '',
	cardId: '',
	item: {},
	isDeleteFromColumn: false,
	isAddToColumn: false,
};

const initialState = {
	entities: {
		data: [],
	} as any,
	entitiesWithFunnels: {
		data: [],
	} as any,
	entityFilters: {},
	entityFiltersPreset: initialEntityFilterPreset,
	entityItemsColumns: {},
	errorMessage: null,
	loading: false,
	loadingItems: false,
	createEntityMode: false,
	movingCard: false,
	deletedItemId: 0,
	deletedItemIds: [],
	changeItems: [] as any,
	dndEntityItem: initialDnD,
	createdUniversalEntityItem: {},
} as IState;

const entitiesReducer = createSlice({
	name: 'entities',
	initialState,
	reducers: {
		changeFilterUniversalEntity: (state, action: PayloadAction<{ tableCode: string; key: string; value: IFilter[keyof IFilter] }>) => {
			state.entityFilters = {
				...state.entityFilters,
				[action.payload.tableCode]: { ...state.entityFilters[action.payload.tableCode], [action.payload.key]: action.payload.value },
			};
		},
		changeItemsFilterUniversalEntity: (state, action: PayloadAction<{ tableCode: string; filters: IFilter }>) => {
			state.entityFilters = {
				...state.entityFilters,
				[action.payload.tableCode]: action.payload.filters,
			};
		},
		clearItemsFilterUniversalEntity: (state, action: PayloadAction<{ tableCode: string }>) => {
			if (!!Object.keys(state.entityFilters[action.payload.tableCode])?.length) {
				const fields = state.entities.data.find((entity) => entity.table_name === action.payload.tableCode)?.fields?.data || [];
				state.entityFilters = {
					...state.entityFilters,
					[action.payload.tableCode]: {
						...state.entityFilters[action.payload.tableCode],
						...fields?.reduce((acc, it) => ({ ...acc, ...getField(it) }), {}),
						...OTHER_DEFAULT_FIELDS,
						table_fields: state.entityFilters[action.payload.tableCode]?.table_fields || [],
						page: 1,
						perPage: 20,
						select: 0,
						entityCode: state.entityFilters[action.payload.tableCode].entityCode,
					},
				};
			}
		},
		changeEntityCode: (state, action: PayloadAction<{ tableCode: string; entityCode: string }>) => {
			state.entityFilters = {
				...state.entityFilters,
				[action.payload.tableCode]: {
					...state.entityFilters[action.payload.tableCode],
					entityCode: action.payload.entityCode,
				},
			};
		},
		changeCreateEntityMode: (state, action: PayloadAction<boolean>) => {
			state.createEntityMode = action.payload;
		},
		changeEntityItemColumnsState: (state, action: PayloadAction<{ data: IColumns; isColumnsChanged: boolean }>) => {
			state.entityItemsColumns = action.payload.data;
		},
		changeReasonForUniversalEntityItem: (state, action: PayloadAction<{ id: number; reasonId: number | string; entityCode: string }>) => {
			state.entities.data = state?.entities?.data?.map((entity) => {
				if (entity?.table_name === action.payload.entityCode) {
					entity?.items?.data?.map((item) => {
						if (item?.id === action?.payload?.id) {
							return {
								...item,
								kanban_reason_id: +action.payload.reasonId,
							};
						}
						return item;
					});
				}
				return entity;
			});
		},
		changeUniversalEntityItem: (state, action: PayloadAction<IEntityData>) => {
			state.entityItemsColumns = Object.entries(state.entityItemsColumns).reduce((acc, [key, value]) => {
				// @ts-ignore
				const findObject = value.items.map((el) => +el.id).includes(action.payload?.id || 0);
				if (findObject) {
					const newObject = {
						// @ts-ignore
						...value,
						// @ts-ignore
						items: value.items.map((it) =>
							+it.id === +action.payload.id
								? {
										...it,
										title: action.payload?.title || it?.title,
										preparedTitle: action.payload?.title || it?.title,
										...action.payload,
										id: String(it.id),
								  }
								: it,
						),
					};
					return { ...acc, [key]: newObject };
				} else {
					return { ...acc, [key]: value };
				}
			}, {});
		},
		changeUniversalEntityFunnelState: (state, action: PayloadAction<{ stages: IStage[]; funnelId: number; entityCode: string }>) => {
			state.entities.data = state?.entities?.data?.map((entity) => {
				if (entity.table_name === action.payload.entityCode) {
					entity.funnels = entity.funnels.map((it) => (it.id === action.payload.funnelId ? { ...it, stages: action.payload.stages } : it));
					return entity;
				}
				return entity;
			});
		},
		moveEntityChangeCardInColumn: (state, action: PayloadAction<{ dndItem: IDnDItem; entityCode: string; meta: Partial<IEntityData> }>) => {
			state.dndEntityItem = action.payload.dndItem;
			state.entities.data = state?.entities?.data?.map((entity) => {
				if (entity?.table_name === action?.payload?.entityCode) {
					entity?.items?.data?.map((it) =>
						it?.id === +action?.payload?.dndItem?.item?.id
							? {
									...it,
									...(action.payload?.meta || {}),
									first_closed_at: it.first_closed_at || action.payload?.meta?.closed_at,
									first_closed_by: it.first_closed_by || action.payload?.meta?.changed_by,
									kanban_stage_id: +action?.payload?.dndItem?.toColumnId,
							  }
							: it,
					);
					return entity;
				}
				return entity;
			});
		},
		dndHandlerDeleteCardFromColumn: (state) => {
			state.dndEntityItem.isDeleteFromColumn = true;
		},
		dndHandlerAddCardFromColumn: (state) => {
			state.dndEntityItem.isAddToColumn = true;
		},
		clearDNDItem: (state) => {
			state.dndEntityItem = initialDnD;
		},
		clearCreatedUniversalEntityItem: (state) => {
			state.createdUniversalEntityItem = { id: 0 };
		},
		clearDataByTableName: (state, action: PayloadAction<string>) => {
			// @ts-ignore
			state.entities.data = state?.entities?.data?.map((it) => (it?.table_name === action?.payload ? { ...it, data: [], items: [] } : it));
			state.loadingItems = true;
		},
		setDeleteAllFromKanban: (state, action: PayloadAction<boolean>) => {
			state.deleteAllFromKanban = action.payload;
		},
		setIsNewPreset: (state, action: PayloadAction<boolean>) => {
			state.entityFiltersPreset.isNewPreset = action.payload;
		},
		setCurrentPreset: (state, action: PayloadAction<IFilterPreset>) => {
			state.entityFiltersPreset.currentPreset = action.payload;
		},
		setStandardPreset: (state, action: PayloadAction<IFilterPreset>) => {
			state.entityFiltersPreset.standardPreset = action.payload;
		},
		setFilterPresets: (state, action: PayloadAction<IFilterPreset[]>) => {
			state.entityFiltersPreset.filterPresets = action.payload;
		},
		setUniversalEntityCardBlocks: (state, action: PayloadAction<{ cardBlocks: ICardBlock[]; entityCode: string }>) => {
			state.entities.data = state?.entities?.data?.map((it) =>
				it?.table_name === action?.payload?.entityCode ? { ...it, cardBlocks: action?.payload?.cardBlocks } : it,
			);
		},
	},
	extraReducers: {
		[fetchEntities.fulfilled.type]: (state, action: PayloadAction<IEntityMain>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities = action.payload;
		},
		[fetchEntities.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[fetchEntities.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[fetchEntitiesWithFunnels.fulfilled.type]: (state, action: PayloadAction<IEntityMain>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entitiesWithFunnels = action.payload;
		},
		[fetchEntitiesWithFunnels.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[fetchEntitiesWithFunnels.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createUniversalEntity.fulfilled.type]: (state, action: PayloadAction<IEntityMainData>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data.push(action.payload);
		},
		[createUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[createUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteUniversalEntity.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data = state?.entities?.data?.filter((entity) => entity?.id !== action?.payload);
		},
		[deleteUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[deleteUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[editUniversalEntity.fulfilled.type]: (state, action: PayloadAction<IEntityMainData>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data = state?.entities?.data?.map((entity) => {
				if (entity?.id === action?.payload?.id) {
					return {
						...entity,
						...action.payload,
					};
				}

				return entity;
			});
		},
		[editUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[editUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[fetchUniversalFunnel.fulfilled.type]: (state, action: PayloadAction<{ res: IFunnel[]; code: string }>) => {
			state.loading = false;
			state.errorMessage = null;
			const sortedStages = action.payload.res
				.map((funnel) => {
					funnel.stages.sort((a, b) => a.sort - b.sort);
					return funnel;
				})
				.map((it) => (it.title === 'Universal funnel' ? { ...it, title: 'newDirection' } : it));

			state?.entities?.data?.forEach((entity) => {
				if (entity.table_name === action.payload.code) {
					entity.funnels = sortedStages;
				}
			});
		},
		[fetchUniversalFunnel.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[fetchUniversalFunnel.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[fetchFieldsForUniversalEntity.fulfilled.type]: (state, action: PayloadAction<{ res: IFields; code: string }>) => {
			state.loading = false;
			state.errorMessage = null;
			state?.entities?.data?.forEach((entity) => {
				if (entity.table_name === action.payload.code) {
					entity.fields = action.payload.res;
					// @ts-ignore
					entity.fields.data.splice(0, 0, idColumn);
					// @ts-ignore
					entity.fields.data.splice(2, 0, stage);
					state.entityFilters = {
						...state.entityFilters,
						[action.payload.code]: {
							...state.entityFilters[action.payload.code],
							...entity.fields.data.reduce((acc, it) => ({ ...acc, ...getField(it) }), {}),
							...OTHER_DEFAULT_FIELDS,
							select: 0,
							entityCode: action.payload.code,
						},
					};
				}
			});
		},
		[fetchFieldsForUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[fetchFieldsForUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[updateFieldForUniversalEntity.fulfilled.type]: (state, action: PayloadAction<{ response: IField; entityCode: string }>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data = state?.entities?.data?.map((entity) => {
				if (entity?.table_name === action?.payload?.entityCode) {
					// return { ...action.payload.response, values: action?.payload?.response.values || field?.values };
					entity.fields.data = entity?.fields?.data?.map((field) => {
						if (field.code === action?.payload?.response?.code) {
							return { ...action?.payload?.response, values: action?.payload?.response?.values || field?.values };
						}
						return field;
					});
				}
				return entity;
			});
		},
		[updateFieldForUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[updateFieldForUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createFieldForUniversalEntity.fulfilled.type]: (state, action: PayloadAction<{ response: IField; entityCode: string }>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode) {
					entity?.fields?.data?.push(action.payload.response);
				}
			});
		},
		[createFieldForUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[createFieldForUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[updateListValuesForUniversalEntity.fulfilled.type]: (
			state,
			action: PayloadAction<{ code: string; values: IFieldValue[]; entityCode: string }>,
		) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data = state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode) {
					entity.fields.data = entity.fields.data.map((field) => {
						if (field?.code === action.payload.code) {
							return { ...field, values: action.payload.values };
						}
						return field;
					});
				}
				return entity;
			});
		},
		[updateListValuesForUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[updateListValuesForUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteListValuesForUniversalEntity.fulfilled.type]: (
			state,
			action: PayloadAction<{ value: string; fieldCode: string; entityCode: string }>,
		) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode) {
					entity.fields.data = entity.fields.data.map((field) => {
						if (field?.code === action.payload.fieldCode) {
							field.values = field.values.filter((value) => value.value !== action.payload.value);
						}
						return field;
					});
				}
				return entity;
			});
		},
		[deleteListValuesForUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[deleteListValuesForUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteFieldForUniversalEntity.fulfilled.type]: (state, action: PayloadAction<{ fieldCode: string; entityCode: string }>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode) {
					entity.fields.data = entity.fields.data.filter((field) => {
						return field?.code !== action.payload.fieldCode;
					});
				}
				return entity;
			});
		},
		[deleteFieldForUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[deleteFieldForUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createFunnelForUniversalEntity.fulfilled.type]: (state, action: PayloadAction<{ response: IFunnel; entityCode: string }>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode && entity?.funnels) {
					entity?.funnels?.push(action.payload.response);
				}
				return entity;
			});
		},
		[createFunnelForUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[createFunnelForUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[editFunnelForUniversalEntity.fulfilled.type]: (state, action: PayloadAction<{ response: IFunnel; entityCode: string }>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data = state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode) {
					entity.funnels = entity.funnels.map((funnel) => {
						if (funnel.id === action.payload.response.id) {
							return { ...funnel, ...action.payload.response };
						} else {
							return funnel;
						}
					});
				}
				return entity;
			});
		},
		[editFunnelForUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[editFunnelForUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteFunnelForUniversalEntity.fulfilled.type]: (state, action: PayloadAction<{ id: number; entityCode: string }>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data = state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode) {
					entity.funnels = entity.funnels.filter((funnel) => funnel.id !== action.payload.id);
				}
				return entity;
			});
		},
		[deleteFunnelForUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[deleteFunnelForUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createStageForUniversalEntity.fulfilled.type]: (state, action: PayloadAction<{ response: IStage; entityCode: string; funnel_id }>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data = state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode) {
					entity.funnels = entity.funnels.map((funnel) => {
						if (funnel.id === action.payload.funnel_id) {
							return { ...funnel, stages: sortStagesWhenCreateNew({ data: funnel.stages }, action.payload.response) };
						}
						return funnel;
					});
				}
				return entity;
			});
		},
		[createStageForUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[createStageForUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[editStageForUniversalEntity.fulfilled.type]: (state, action: PayloadAction<{ response: IStage; funnelId: number; entityCode: string }>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data = state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode) {
					entity.funnels.map((funnel) => {
						if (funnel.id === action.payload.funnelId) {
							funnel.stages = funnel.stages.map((it) => {
								if (it.id === action.payload.response.id) {
									return action.payload.response;
								}
								return it;
							});
						}
						return funnel;
					});
				}
				return entity;
			});
		},
		[editStageForUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[editStageForUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteStageForUniversalEntity.fulfilled.type]: (state, action: PayloadAction<{ id: number; entityCode: string }>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data = state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode) {
					entity.funnels = entity.funnels.map((funnel) => {
						funnel.stages = funnel.stages.filter((it) => it.id !== action.payload.id);
						return funnel;
					});
				}
				return entity;
			});
		},
		[deleteStageForUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[deleteStageForUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[fetchStagesForUniversalEntity.fulfilled.type]: (
			state,
			action: PayloadAction<{ response: IStages; funnelId: number; entityCode: string }>,
		) => {
			state.loading = false;
			state.errorMessage = null;
			// const sortedStages = action.payload.response.data.sort((a, b) => a.sort - b.sort);
			state.entities.data = state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode) {
					entity.funnels = entity.funnels.map((funnel) => {
						if (funnel.id === action.payload.funnelId) {
							funnel.stages = action.payload.response.data;
						}
						return funnel;
					});
				}
				return entity;
			});
		},
		[fetchStagesForUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[fetchStagesForUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createReasonsForUniversalEntity.fulfilled.type]: (
			state,
			action: PayloadAction<{ response: IReason; funnelId: number; entityCode: string }>,
		) => {
			const { response, funnelId, entityCode } = action.payload;
			state.loading = false;
			state.errorMessage = null;
			state.entities.data = state.entities.data.map((entity) => {
				if (entity.table_name === entityCode) {
					entity.funnels = entity.funnels.map((funnel) => {
						if (funnel.id === funnelId) {
							funnel.stages = funnel.stages.map((item) => {
								if (item.stage_code === 'FAIL') {
									item.reasons.push(response);
								}
								return item;
							});
						}
						return funnel;
					});
				}
				return entity;
			});
			return state;
		},
		[createReasonsForUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[createReasonsForUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[editReasonForUniversalEntity.fulfilled.type]: (
			state,
			action: PayloadAction<{ response: IReason; funnelId: number; entityCode: string }>,
		) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data = state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode) {
					entity.funnels = entity.funnels.map((funnel) => {
						if (funnel.id === action.payload.funnelId) {
							funnel.stages = funnel.stages.map((it) => {
								if (it.stage_code === 'FAIL') {
									it.reasons = it.reasons.map((reason) =>
										reason.id === action.payload.response.id ? action.payload.response : reason,
									);
								}
								return it;
							});
						}
						return funnel;
					});
				}
				return entity;
			});
		},
		[editReasonForUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[editReasonForUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[fetchEntityItemsForUniversalEntity.fulfilled.type]: (state, action: PayloadAction<{ res: IEntity; entityCode: string }>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode) {
					entity.items = action.payload.res;
				}
			});
		},
		[fetchEntityItemsForUniversalEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[fetchEntityItemsForUniversalEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createUniversalEntityItem.fulfilled.type]: (state, action: PayloadAction<{ response: IEntityData; entityCode: string }>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data = state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode && !!entity?.items?.data?.length) {
					entity?.items?.data.unshift(action.payload.response);
					entity.items.meta.total = ++entity.items.meta.total;
				}
				return entity;
			});
		},
		[createUniversalEntityItem.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createUniversalEntityItem.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[updateUniversalEntityItem.fulfilled.type]: (state, action: PayloadAction<{ data: IEntityData; entityCode: string }>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data = state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode) {
					entity?.items?.data?.map((item) => {
						if (item.id === action.payload.data.id) {
							return action.payload.data.id;
						}
						return item;
					});
				}
				return entity;
			});
		},
		[updateUniversalEntityItem.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[updateUniversalEntityItem.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteUniversalEntityItem.fulfilled.type]: (state, action: PayloadAction<{ id: number; entityCode: string }>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode && entity?.items?.data) {
					entity.items.data = entity.items.data.filter((item) => item.id !== action.payload.id);
					entity.items.meta.total -= 1;
				}
				return entity;
			});
			state.deletedItemId = action.payload.id;
		},
		[deleteUniversalEntityItem.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[deleteUniversalEntityItem.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[massUniversalEntityItemsDeletion.fulfilled.type]: (state, action: PayloadAction<IMassActions & { entityCode: string }>) => {
			state.loading = false;
			state.loadingItems = false;
			state.errorMessage = null;
			state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode && entity?.items?.data) {
					entity.items.data = entity.items.data.filter((item) => !action.payload.entityIds.includes(item?.id));
					state.deletedItemIds = action?.payload.entityIds.map((id) => id);

					if (action.payload.all) {
						state.deleteAllFromKanban = true;
					}
					if (entity?.items?.meta?.total) {
						if (action.payload.all) {
							entity.items.meta.total = 0;
						} else if (action.payload.all && action.payload.exceptIds.length) {
							entity.items.meta.total = action.payload.exceptIds.length;
						} else {
							entity.items.meta.total = entity?.items?.meta?.total - action.payload.entityIds.length;
						}
					}
				}
				return entity;
			});
		},
		[massUniversalEntityItemsDeletion.pending.type]: (state) => {
			state.loading = true;
			state.loadingItems = true;
			state.errorMessage = null;
		},
		[massUniversalEntityItemsDeletion.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.loadingItems = false;
			state.errorMessage = action.payload;
		},
		[massUniversalEntityItemsEditing.fulfilled.type]: (state) => {
			state.loading = false;
			state.errorMessage = null;
		},
		[massUniversalEntityItemsEditing.pending.type]: (state) => {
			state.loading = true;
			state.loadingItems = true;
			state.errorMessage = null;
		},
		[massUniversalEntityItemsEditing.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.loadingItems = false;
			state.errorMessage = action.payload;
		},
		[fetchUniversalEntityItemsWithFilters.fulfilled.type]: (
			state,
			action: PayloadAction<{ res: IEntity; entityCode: string; aborted: boolean }>,
		) => {
			state.loadingItems = action.payload.aborted;
			state.errorMessage = null;
			state.entities.data.map((entity) => {
				if (entity.table_name === action.payload.entityCode) {
					entity.items = action.payload.aborted ? entity.items : action.payload.res;
				}
				return entity;
			});
		},
		[fetchUniversalEntityItemsWithFilters.pending.type]: (state) => {
			state.loadingItems = true;
			state.errorMessage = null;
		},
		[fetchUniversalEntityItemsWithFilters.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loadingItems = false;
			state.errorMessage = action.payload;
		},
		[moveUniversalItemFromStageToStage.fulfilled.type]: (state, action: PayloadAction<IMoveCardsData>) => {
			state.movingCard = false;
			state.errorMessage = null;

			const entityIndex = state.entities.data.findIndex((entity) => entity?.table_name === action?.payload?.entityCode);

			if (entityIndex !== -1) {
				const entity = state.entities.data[entityIndex];

				if (entity?.items?.data) {
					if (action?.payload?.funnelHasChanged) {
						entity.items.data = entity.items.data.filter((item) => item?.id !== action?.payload?.entityId);
					} else {
						entity.items.data = entity?.items?.data?.map((item) =>
							item?.id === action?.payload?.entityId
								? {
										...item,
										kanban_stage_id: action.payload.stageId,
										updated_at: Math.floor(new Date().valueOf() / 1000),
										changed_by: action?.payload?.profileId,
										...(action?.payload?.isFinishedStage && {
											first_closed_at: item?.first_closed_at || Math.floor(new Date().valueOf() / 1000),
											closed_at: Math.floor(new Date().valueOf() / 1000),
											first_closed_by: item?.first_closed_by || action?.payload?.profileId,
											closed_by: action?.payload?.profileId,
										}),
								  }
								: item,
						);
					}
				}
			}
		},
		[moveUniversalItemFromStageToStage.pending.type]: (state) => {
			state.movingCard = true;
			state.errorMessage = null;
		},
		[moveUniversalItemFromStageToStage.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.movingCard = false;
			state.errorMessage = action.payload;
		},
		[createUniversalEntityItemFromKanban.fulfilled.type]: (state, action: PayloadAction<{ response: IEntityData; entityCode: string }>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities.data = state?.entities?.data?.map((entity) => {
				if (entity?.table_name === action?.payload?.entityCode) {
					return {
						...entity,
						items: {
							...entity.items,
							data: [action?.payload?.response, ...entity?.items?.data],
						},
					};
				}
				return entity;
			});
			state.createdUniversalEntityItem = action.payload.response;
		},
		[createUniversalEntityItemFromKanban.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[createUniversalEntityItemFromKanban.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
	},
});
export const {
	changeFilterUniversalEntity,
	changeItemsFilterUniversalEntity,
	clearItemsFilterUniversalEntity,
	changeEntityCode,
	changeCreateEntityMode,
	changeEntityItemColumnsState,
	changeReasonForUniversalEntityItem,
	changeUniversalEntityItem,
	changeUniversalEntityFunnelState,
	moveEntityChangeCardInColumn,
	dndHandlerDeleteCardFromColumn,
	dndHandlerAddCardFromColumn,
	clearDNDItem,
	clearCreatedUniversalEntityItem,
	clearDataByTableName,
	setDeleteAllFromKanban,
	setIsNewPreset,
	setCurrentPreset,
	setStandardPreset,
	setFilterPresets,
	setUniversalEntityCardBlocks,
} = entitiesReducer.actions;
export default entitiesReducer.reducer;
