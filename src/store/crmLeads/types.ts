/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICardBlock } from '@uspacy/sdk/lib/models/crm-card-blocks';
import { IEntity, IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { IFiltersPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { ILeadFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IDnDItem } from '@uspacy/sdk/lib/models/crm-kanban';
import { IFields } from '@uspacy/sdk/lib/models/field';

export interface IState {
	leads: IEntity;
	lead: IEntityData;
	updatedLead: IEntityData;
	createdLead: IEntityData;
	leadCard: IEntityData;
	leadFields: IFields;
	deleteLeadId: number;
	deleteLeadIds: number[];
	deleteAllFromKanban: boolean;
	changeLeads: IEntityData[];
	leadFilters: ILeadFilters;
	leadFiltersPreset: IFiltersPreset;
	loading: boolean;
	loadingLeadList: boolean;
	loadingLeadFields: boolean;
	movingCard: boolean;
	errorMessage: string;
	dndLeadItem: IDnDItem;
	cardBlocks: ICardBlock[];
}

export interface IMoveCardsData {
	entityId: number;
	stageId: number;
	reason_id: number | null;
	profileId: number;
	isFinishedStage?: boolean;
}
