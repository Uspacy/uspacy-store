import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICardBlock } from '@uspacy/sdk/lib/models/crm-card-blocks';
import { IEntity, IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { IFilterPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { ICreatedAt, IDealFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IDnDItem } from '@uspacy/sdk/lib/models/crm-kanban';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { IField, IFields } from '@uspacy/sdk/lib/models/field';

import { idColumn, OTHER_DEFAULT_FIELDS, taskField } from './../../const';
import { getField } from './../../helpers/filterFieldsArrs';
import {
	createDeal,
	createDealField,
	createDealFromKanban,
	deleteDeal,
	deleteDealField,
	deleteDealListValues,
	fetchDeals,
	fetchDealsWithFilters,
	fetchFieldsForDeal,
	massDealsDeletion,
	massDealsEditing,
	moveDealFromStageToStage,
	updateDeal,
	updateDealField,
	updateDealListValues,
} from './actions';
import { IMoveCardsData, IState } from './types';

const initialDealsFilterPreset = {
	isNewPreset: false,
	currentPreset: {},
	standardPreset: {},
	filterPresets: [],
};

const initialDnD = {
	fromColumnId: '',
	toColumnId: '',
	cardId: '',
	item: {},
	isDeleteFromColumn: false,
	isAddToColumn: false,
};

const initialDeals = {
	data: [],
	meta: {
		total: 0,
		from: 0,
		per_page: 0,
		list: 0,
	},
	aborted: false,
};

export const initialDealsFilter: IDealFilters = {
	kanban_status: [],
	stages: [],
	period: [],
	time_label: [],
	certainDateOrPeriod: [],
	owner: [],
	tasks_label: [],
	tasks: [],
	openDatePicker: false,
	search: '',
	page: 0,
	perPage: 0,
	select: 0,
	boolean_operator: '',
	table_fields: [],
	sortModel: [],
};

const initialState = {
	deals: initialDeals,
	deal: {},
	createdDeal: {},
	dealFields: {
		data: [],
	},
	deleteDealId: 0,
	deleteDealIds: [],
	deleteAllFromKanban: false,
	changeDeals: [],
	taskTime: [],
	dealFilters: {},
	dealFiltersPreset: initialDealsFilterPreset,
	errorMessage: '',
	loading: false,
	loadingDealList: true,
	loadingDealFields: true,
	movingCard: false,
	dndDealItem: initialDnD,
	cardBlocks: [],
} as IState;

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
	system_field: true,
	sort: '',
	defaultValue: '',
};

const dealsReducer = createSlice({
	name: 'deals',
	initialState,
	reducers: {
		changeFilterDeals: (state, action: PayloadAction<{ key: string; value: IDealFilters[keyof IDealFilters] }>) => {
			state.dealFilters[action.payload.key] = action.payload.value;
		},
		changeItemsFilterDeals: (state, action: PayloadAction<IDealFilters>) => {
			state.dealFilters = action.payload;
		},
		changeTaskTime: (state, action: PayloadAction<ICreatedAt[]>) => {
			state.taskTime = action.payload;
		},
		clearDeals: (state) => {
			state.deals = initialDeals;
			state.loadingDealList = true;
		},
		clearDealsFilter: (state) => {
			state.taskTime = [];
			if (!!Object.keys(state.dealFields.data)?.length) {
				state.dealFilters = {
					...state.dealFields.data.reduce((acc, it) => ({ ...acc, ...getField(it) }), {}),
					...OTHER_DEFAULT_FIELDS,
					table_fields: state?.dealFilters?.table_fields || [],
					page: 1,
					perPage: 20,
					select: 0,
				};
			}
		},
		moveDealChangeCardInColumn: (state, action: PayloadAction<{ data: IDnDItem; meta: Partial<IEntityData> }>) => {
			state.dndDealItem = action.payload?.data;
			state.deals.data = state.deals.data.map((it) =>
				it.id === +action.payload?.data?.item?.id
					? {
							...it,
							...(action.payload?.meta || {}),
							first_closed_at: it.first_closed_at || action.payload?.meta?.closed_at,
							first_closed_by: it.first_closed_by || action.payload?.meta?.changed_by,
							kanban_stage_id: +action.payload.data?.toColumnId,
					  }
					: it,
			);
		},
		dndHandlerDeleteCardFromColumn: (state) => {
			state.dndDealItem.isDeleteFromColumn = true;
		},
		dndHandlerAddCardFromColumn: (state) => {
			state.dndDealItem.isAddToColumn = true;
		},
		clearDNDItem: (state) => {
			state.dndDealItem = initialDnD;
		},
		clearCreatedDeal: (state) => {
			state.createdDeal = { id: 0 };
		},
		changeReasonForDeal: (state, action: PayloadAction<{ id: number; reasonId: number | string }>) => {
			state.deals.data = state.deals.data.map((lead) => {
				if (lead?.id === action?.payload?.id) {
					return {
						...lead,
						kanban_reason_id: +action.payload.reasonId,
					};
				}

				return lead;
			});
		},
		setDeleteAllFromKanban: (state, action: PayloadAction<boolean>) => {
			state.deleteAllFromKanban = action.payload;
		},
		setIsNewPreset: (state, action: PayloadAction<boolean>) => {
			state.dealFiltersPreset.isNewPreset = action.payload;
		},
		setCurrentPreset: (state, action: PayloadAction<IFilterPreset>) => {
			state.dealFiltersPreset.currentPreset = action.payload;
		},
		setStandardPreset: (state, action: PayloadAction<IFilterPreset>) => {
			state.dealFiltersPreset.standardPreset = action.payload;
		},
		setFilterPresets: (state, action: PayloadAction<IFilterPreset[]>) => {
			state.dealFiltersPreset.filterPresets = action.payload;
		},
		setCardBlocks: (state, action: PayloadAction<ICardBlock[]>) => {
			state.cardBlocks = action.payload;
		},
	},
	extraReducers: {
		[fetchDeals.fulfilled.type]: (state, action: PayloadAction<IEntity>) => {
			state.loadingDealList = false;
			state.errorMessage = '';
			state.deals = action.payload;
		},
		[fetchDeals.pending.type]: (state) => {
			state.loadingDealList = true;
			state.errorMessage = '';
		},
		[fetchDeals.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingDealList = false;
			state.errorMessage = action.payload;
		},
		[fetchDealsWithFilters.fulfilled.type]: (state, action: PayloadAction<IEntity>) => {
			state.loadingDealList = action.payload.aborted;
			state.errorMessage = '';
			state.deals = action.payload.aborted ? state.deals : action.payload;
		},
		[fetchDealsWithFilters.pending.type]: (state) => {
			state.loadingDealList = true;
			state.errorMessage = '';
		},
		[createDeal.fulfilled.type]: (state, action: PayloadAction<IEntityData>) => {
			state.loading = false;
			state.errorMessage = '';
			state.deals.data.unshift(action.payload);
			state.deals.meta.total = ++state.deals.meta.total;
		},
		[fetchDealsWithFilters.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingDealList = false;
			state.errorMessage = action.payload;
		},
		[createDeal.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createDeal.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createDealFromKanban.fulfilled.type]: (state, action: PayloadAction<{ data: IEntityData; dontRenderInKanban?: boolean }>) => {
			state.loading = false;
			state.errorMessage = '';
			state.deals.data.unshift(action.payload?.data);
			if (!action.payload?.dontRenderInKanban) {
				state.createdDeal = action.payload?.data;
			}
		},
		[createDealFromKanban.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createDealFromKanban.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[updateDeal.fulfilled.type]: (state, action: PayloadAction<IEntityData>) => {
			state.loading = false;
			state.errorMessage = '';
			state.deals.data = state.deals.data.map((deal) => {
				if (deal.id === action.payload.id) {
					return action.payload;
				}
				return deal;
			});
		},
		[updateDeal.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[updateDeal.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteDeal.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loading = false;
			state.errorMessage = '';
			state.deals.data = state.deals.data.filter((deal) => deal.id !== action.payload);
			state.deleteDealId = action.payload;
		},
		[deleteDeal.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteDeal.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[massDealsDeletion.fulfilled.type]: (state, action: PayloadAction<IMassActions>) => {
			state.loading = false;
			state.loadingDealList = false;
			state.errorMessage = '';
			state.deals.data = state.deals.data.filter((item) => !action.payload.entityIds.includes(item?.id));
			state.deleteDealIds = action?.payload.entityIds.map((id) => id);

			if (action.payload.all) {
				state.deleteAllFromKanban = true;
			}

			if (action.payload.all) {
				state.deals.meta.total = 0;
			} else if (action.payload.all && action.payload.exceptIds.length) {
				state.deals.meta.total = action.payload.exceptIds.length;
			} else {
				state.deals.meta.total = state.deals.meta.total - action.payload.entityIds.length;
			}
		},
		[massDealsDeletion.pending.type]: (state) => {
			state.loading = true;
			state.loadingDealList = true;
			state.errorMessage = '';
		},
		[massDealsDeletion.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingDealList = false;
			state.errorMessage = action.payload;
		},
		[massDealsEditing.fulfilled.type]: (state) => {
			state.loading = false;
			state.errorMessage = '';
		},
		[massDealsEditing.pending.type]: (state) => {
			state.loading = true;
			state.loadingDealList = true;
			state.errorMessage = '';
		},
		[massDealsEditing.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingDealList = false;
			state.errorMessage = action.payload;
		},
		[fetchFieldsForDeal.fulfilled.type]: (state, action: PayloadAction<IFields>) => {
			state.loading = false;
			state.loadingDealFields = false;
			state.errorMessage = '';
			state.dealFields = action.payload;
			state.dealFields.data.splice(0, 0, idColumn);
			// @ts-ignore
			state.dealFields.data.splice(2, 0, stage);
			state.dealFields.data.splice(0, 0, taskField);
			state.dealFields.data.forEach((field) => {
				field?.values?.sort((a, b) => a.sort - b.sort);
			});
			if (!Object.keys(state.dealFilters)?.length) {
				state.dealFilters = {
					...state.dealFields.data.reduce((acc, it) => ({ ...acc, ...getField(it) }), {}),
					...OTHER_DEFAULT_FIELDS,
					select: 0,
				};
			}
		},
		[fetchFieldsForDeal.pending.type]: (state) => {
			state.loading = true;
			state.loadingDealFields = true;
			state.errorMessage = '';
		},
		[fetchFieldsForDeal.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingDealFields = false;
			state.errorMessage = action.payload;
		},
		[updateDealField.fulfilled.type]: (state, action: PayloadAction<IField>) => {
			state.loading = false;
			state.errorMessage = '';
			state.dealFields.data = state.dealFields.data.map((field) => {
				if (field.code === action.payload.code) {
					return { ...action.payload, values: action?.payload?.values || field?.values };
				}
				return field;
			});
		},
		[updateDealField.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[updateDealField.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[updateDealListValues.fulfilled.type]: (state, action: PayloadAction<IField>) => {
			state.loading = false;
			state.errorMessage = '';
			state.dealFields.data = state.dealFields.data.map((field) => {
				if (field.code === action.payload.code) {
					field = action.payload;
					field.values.sort((a, b) => a.sort - b.sort);
				}
				return field;
			});
		},
		[updateDealListValues.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[updateDealListValues.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createDealField.fulfilled.type]: (state, action: PayloadAction<IField>) => {
			state.loading = false;
			state.errorMessage = '';
			state.dealFields.data.push(action.payload);
		},
		[createDealField.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createDealField.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteDealListValues.fulfilled.type]: (state, action: PayloadAction<{ fieldCode: string; value: string }>) => {
			state.loading = false;
			state.errorMessage = '';
			state.dealFields.data = state.dealFields.data.map((field) => {
				if (field.code === action.payload.fieldCode) {
					field.values = field.values.filter((value) => value.value !== action.payload.value);
				}
				return field;
			});
		},
		[deleteDealListValues.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteDealListValues.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteDealField.fulfilled.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = '';
			state.dealFields.data = state.dealFields.data.filter((field) => field.code !== action.payload);
		},
		[deleteDealField.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteDealField.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[moveDealFromStageToStage.fulfilled.type]: (state, action: PayloadAction<IMoveCardsData>) => {
			state.movingCard = false;
			state.errorMessage = '';
			if (action?.payload?.funnelHasChanged) {
				state.deals.data = state.deals.data.filter((deal) => deal?.id !== action?.payload?.entityId);
			} else {
				state.deals.data = state.deals.data.map((deal) =>
					deal?.id === action?.payload?.entityId
						? {
								...deal,
								kanban_stage_id: action.payload.stageId,
								updated_at: Math.floor(new Date().valueOf() / 1000),
								changed_by: action?.payload?.profileId,
								...(action?.payload?.isFinishedStage && {
									first_closed_at: deal?.first_closed_at || Math.floor(new Date().valueOf() / 1000),
									closed_at: Math.floor(new Date().valueOf() / 1000),
									first_closed_by: deal?.first_closed_by || action?.payload?.profileId,
									closed_by: action?.payload?.profileId,
								}),
						  }
						: deal,
				);
			}
		},
		[moveDealFromStageToStage.pending.type]: (state) => {
			state.movingCard = true;
			state.errorMessage = '';
		},
		[moveDealFromStageToStage.rejected.type]: (state, action: PayloadAction<string>) => {
			state.movingCard = false;
			state.errorMessage = action.payload;
		},
	},
});

export const {
	changeFilterDeals,
	changeItemsFilterDeals,
	changeTaskTime,
	clearDeals,
	clearDealsFilter,
	moveDealChangeCardInColumn,
	clearCreatedDeal,
	dndHandlerAddCardFromColumn,
	dndHandlerDeleteCardFromColumn,
	clearDNDItem,
	changeReasonForDeal,
	setDeleteAllFromKanban,
	setIsNewPreset,
	setCurrentPreset,
	setStandardPreset,
	setFilterPresets,
	setCardBlocks,
} = dealsReducer.actions;
export default dealsReducer.reducer;
