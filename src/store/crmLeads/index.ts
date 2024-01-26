import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICardBlock } from '@uspacy/sdk/lib/models/crm-card-blocks';
import { IEntity, IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { ILeadFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IDnDItem } from '@uspacy/sdk/lib/models/crm-kanban';
import { IMassActions } from '@uspacy/sdk/lib/models/crm-mass-actions';
import { IField, IFields } from '@uspacy/sdk/lib/models/field';

import { idColumn } from './../../const';
import {
	createLead,
	createLeadField,
	createLeadFromKanban,
	deleteLead,
	deleteLeadField,
	deleteLeadListValues,
	fetchFieldsForLead,
	fetchLeadsByStages,
	fetchLeadsWithFilters,
	massLeadsDeletion,
	massLeadsEditing,
	moveLeadFromStageToStage,
	updateLead,
	updateLeadField,
	updateLeadListValues,
} from './actions';
import { IMoveCardsData, IState } from './types';
const initialDnD = {
	fromColumnId: '',
	toColumnId: '',
	cardId: '',
	item: {},
	isDeleteFromColumn: false,
	isAddToColumn: false,
};

const initialLeads = {
	data: [],
	meta: {
		total: 0,
		from: 0,
		per_page: 0,
		list: 0,
	},
	aborted: false,
};

const initialLeadsFilter = {
	kanban_status: [],
	stages: [],
	source: [],
	period: [],
	time_label: [],
	certainDateOrPeriod: [],
	owner: [],
	openDatePicker: false,
	search: '',
	page: 0,
	perPage: 0,
	table_fields: [],
};

const initialState = {
	leads: initialLeads,
	lead: {},
	updatedLead: {},
	leadCard: {},
	createdLead: {},
	leadFields: {
		// eslint-disable-next-line @typescript-eslint/no-array-constructor, no-array-constructor
		data: new Array(),
	},
	deleteLeadId: 0,
	deleteLeadIds: [],
	deleteAllFromKanban: false,
	changeLeads: [],
	leadFilters: initialLeadsFilter,
	errorMessage: '',
	loading: false,
	loadingLeadList: true,
	loadingLeadFields: true,
	movingCard: false,
	dndLeadItem: initialDnD,
	cardBlocks: [],
} as IState;

const stage = {
	name: 'stage',
	code: 'kanban_stage_id',
	required: false,
	editable: false,
	show: false,
	hidden: true,
	multiple: false,
	type: 'stage',
	fieldSectionId: '',
	system_field: true,
	sort: '',
	defaultValue: '',
};

const leadsReducer = createSlice({
	name: 'leads',
	initialState,
	reducers: {
		changeFilterLeads: (state, action: PayloadAction<{ key: string; value: ILeadFilters[keyof ILeadFilters] }>) => {
			state.leadFilters[action.payload.key] = action.payload.value;
		},
		changeItemsFilterLeads: (state, action: PayloadAction<ILeadFilters>) => {
			state.leadFilters = action.payload;
		},
		clearLeads: (state) => {
			state.leads = initialLeads;
			state.loadingLeadList = true;
		},
		clearLeadsFilter: (state) => {
			state.leadFilters = { ...initialLeadsFilter, page: 1, perPage: 20 };
		},
		moveLeadChangeCardInColumn: (state, action: PayloadAction<IDnDItem>) => {
			state.dndLeadItem = action.payload;
			state.leads.data = state.leads.data.map((it) =>
				it.id === +action.payload.item.id ? { ...it, kanban_stage_id: action.payload.toColumnId } : it,
			);
		},
		clearCreatedLead: (state) => {
			state.createdLead = { id: 0 };
		},
		dndHandlerDeleteCardFromColumn: (state) => {
			state.dndLeadItem.isDeleteFromColumn = true;
		},
		dndHandlerAddCardFromColumn: (state) => {
			state.dndLeadItem.isAddToColumn = true;
		},
		clearDNDItem: (state) => {
			state.dndLeadItem = initialDnD;
		},
		clearUpdateLead: (state) => {
			state.updatedLead = initialState.updatedLead;
		},
		changeReasonForLead: (state, action: PayloadAction<{ id: number; reasonId: number | string }>) => {
			state.leads.data = state.leads.data.map((lead) => {
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
		setCardBlocks: (state, action: PayloadAction<ICardBlock[]>) => {
			state.cardBlocks = action.payload;
		},
	},
	extraReducers: {
		[fetchLeadsWithFilters.fulfilled.type]: (state, action: PayloadAction<IEntity>) => {
			state.loadingLeadList = action.payload.aborted;
			state.errorMessage = '';
			state.leads = action.payload.aborted ? state.leads : action.payload;
		},
		[fetchLeadsWithFilters.pending.type]: (state) => {
			state.loadingLeadList = true;
			state.errorMessage = '';
		},
		[fetchLeadsWithFilters.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingLeadList = false;
			state.errorMessage = action.payload;
		},
		[fetchLeadsByStages.fulfilled.type]: (state, action: PayloadAction<IEntity>) => {
			state.loading = false;
			state.errorMessage = '';
			state.leads = action.payload;
		},
		[fetchLeadsByStages.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[fetchLeadsByStages.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createLead.fulfilled.type]: (state, action: PayloadAction<IEntityData>) => {
			state.loading = false;
			state.errorMessage = '';
			state.leads.data.unshift(action.payload);
			state.createdLead = action.payload;
			state.leads.meta.total = ++state.leads.meta.total;
		},
		[createLead.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createLead.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createLeadFromKanban.fulfilled.type]: (state, action: PayloadAction<{ data: IEntityData; dontRenderInKanban?: boolean }>) => {
			state.loading = false;
			state.errorMessage = '';
			state.leads.data.unshift(action.payload?.data);
			if (!action.payload?.dontRenderInKanban) {
				state.createdLead = action.payload?.data;
			}
		},
		[createLeadFromKanban.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createLeadFromKanban.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[updateLead.fulfilled.type]: (state, action: PayloadAction<IEntityData>) => {
			state.loading = false;
			state.errorMessage = '';
			state.updatedLead = action.payload;
			state.leads.data = state.leads.data.map((lead) => {
				if (lead.id === action.payload.id) {
					return action.payload;
				}
				return lead;
			});
		},
		[updateLead.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[updateLead.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteLead.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loading = false;
			state.errorMessage = '';
			state.leads.data = state.leads.data.filter((lead) => lead.id !== action.payload);
			state.deleteLeadId = action.payload;
			state.leads.meta.total = --state.leads.meta.total;
		},
		[deleteLead.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteLead.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[massLeadsDeletion.fulfilled.type]: (state, action: PayloadAction<IMassActions>) => {
			state.loading = false;
			state.loadingLeadList = false;
			state.errorMessage = '';
			state.leads.data = state.leads.data.filter((item) => !action.payload.entityIds.includes(item?.id));

			state.deleteLeadIds = action?.payload.entityIds.map((id) => id);

			if (action.payload.all) {
				state.deleteAllFromKanban = true;
			}

			if (action.payload.all) {
				state.leads.meta.total = 0;
			} else if (action.payload.all && action.payload.exceptIds.length) {
				state.leads.meta.total = action.payload.exceptIds.length;
			} else {
				state.leads.meta.total = state.leads.meta.total - action.payload.entityIds.length;
			}
		},
		[massLeadsDeletion.pending.type]: (state) => {
			state.loading = true;
			state.loadingLeadList = true;
			state.errorMessage = '';
		},
		[massLeadsDeletion.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingLeadList = false;
			state.errorMessage = action.payload;
		},
		[massLeadsEditing.fulfilled.type]: (state) => {
			state.loading = false;
			state.errorMessage = '';
		},
		[massLeadsEditing.pending.type]: (state) => {
			state.loading = true;
			state.loadingLeadList = true;
			state.errorMessage = '';
		},
		[massLeadsEditing.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingLeadList = false;
			state.errorMessage = action.payload;
		},
		[fetchFieldsForLead.fulfilled.type]: (state, action: PayloadAction<IFields>) => {
			state.loading = false;
			state.loadingLeadFields = false;
			state.errorMessage = '';
			state.leadFields = action.payload;
			// @ts-ignore
			state.leadFields.data.splice(0, 0, idColumn);
			// @ts-ignore
			state.leadFields.data.splice(2, 0, stage);
			state.leadFields.data.forEach((field) => {
				field?.values?.sort((a, b) => a.sort - b.sort);
			});
		},
		[fetchFieldsForLead.pending.type]: (state) => {
			state.loading = true;
			state.loadingLeadFields = true;
			state.errorMessage = '';
		},
		[fetchFieldsForLead.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingLeadFields = false;
			state.errorMessage = action.payload;
		},
		[updateLeadField.fulfilled.type]: (state, action: PayloadAction<IField>) => {
			state.loading = false;
			state.errorMessage = '';
			state.leadFields.data = state.leadFields.data.map((field) => {
				if (field.code === action.payload.code) {
					return { ...action.payload, values: action?.payload?.values || field?.values };
				}
				return field;
			});
		},
		[updateLeadField.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[updateLeadField.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[updateLeadListValues.fulfilled.type]: (state, action: PayloadAction<IField>) => {
			state.loading = false;
			state.errorMessage = '';
			state.leadFields.data = state.leadFields.data.map((field) => {
				if (field.code === action.payload.code) {
					field = action.payload;
					field.values.sort((a, b) => a.sort - b.sort);
				}
				return field;
			});
		},
		[updateLeadListValues.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[updateLeadListValues.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createLeadField.fulfilled.type]: (state, action: PayloadAction<IField>) => {
			state.loading = false;
			state.errorMessage = '';
			state.leadFields.data.push(action.payload);
		},
		[createLeadField.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createLeadField.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteLeadListValues.fulfilled.type]: (state, action: PayloadAction<{ fieldCode: string; value: string }>) => {
			state.loading = false;
			state.errorMessage = '';
			state.leadFields.data = state.leadFields.data.map((field) => {
				if (field.code === action.payload.fieldCode) {
					field.values = field.values.filter((value) => value.value !== action.payload.value);
				}
				return field;
			});
		},
		[deleteLeadListValues.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteLeadListValues.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteLeadField.fulfilled.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = '';
			state.leadFields.data = state.leadFields.data.filter((field) => field.code !== action.payload);
		},
		[deleteLeadField.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteLeadField.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[moveLeadFromStageToStage.fulfilled.type]: (state, action: PayloadAction<IMoveCardsData>) => {
			state.movingCard = false;
			state.errorMessage = '';
			state.leads.data = state.leads.data.map((lead) => {
				if (lead?.id === action?.payload?.entityId) {
					return {
						...lead,
						kanban_stage_id: +action.payload.stageId,
					};
				}

				return lead;
			});
		},
		[moveLeadFromStageToStage.pending.type]: (state) => {
			state.movingCard = true;
			state.errorMessage = '';
		},
		[moveLeadFromStageToStage.rejected.type]: (state, action: PayloadAction<string>) => {
			state.movingCard = false;
			state.errorMessage = action.payload;
		},
	},
});

export const {
	changeFilterLeads,
	changeItemsFilterLeads,
	clearLeads,
	clearLeadsFilter,
	moveLeadChangeCardInColumn,
	clearCreatedLead,
	dndHandlerDeleteCardFromColumn,
	dndHandlerAddCardFromColumn,
	clearDNDItem,
	clearUpdateLead,
	changeReasonForLead,
	setDeleteAllFromKanban,
	setCardBlocks,
} = leadsReducer.actions;
export default leadsReducer.reducer;
