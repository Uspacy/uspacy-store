/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEntityData, IEntityMain } from '@uspacy/sdk/lib/models/crm-entities';
import { IErrors } from '@uspacy/sdk/lib/models/crm-errors';
import { IEntityFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IDnDItem } from '@uspacy/sdk/lib/models/crm-kanban';

export interface IState {
	loading: boolean;
	entities: IEntityMain;
	entitiesWithFunnels: IEntityMain;
	entityFilters?: IEntityFilters;
	entityItemsColumns: any;
	errorMessage: IErrors;
	// funnels: IFunnel[];
	loadingItems: boolean;
	createEntityMode: boolean;
	movingCard: boolean;
	deletedItemId: number;
	deletedItemIds: number[];
	deleteAllFromKanban?: boolean;
	changeItems: IEntityData;
	dndEntityItem: IDnDItem;
	createdUniversalEntityItem: IEntityData;
}

export interface IMoveCardsData {
	entityId: number;
	stageId: number;
	reason_id: number | null;
	funnelHasChanged?: boolean;
	entityCode: string;
	profileId: number;
	isFinishedStage?: boolean;
}
