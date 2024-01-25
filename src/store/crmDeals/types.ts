/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICardBlock } from '@uspacy/sdk/lib/models/crm-card-blocks';
import { IEntity, IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { ICreatedAt, IDealFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IDnDItem } from '@uspacy/sdk/lib/models/crm-kanban';
import { IFields } from '@uspacy/sdk/lib/models/field';

export interface IState {
	deals: IEntity;
	deal: IEntityData;
	createdDeal: IEntityData;
	deleteDealId: number;
	deleteDealIds: number[];
	deleteAllFromKanban: boolean;
	changeDeals: IEntityData[];
	createdAt: ICreatedAt[];
	taskTime: ICreatedAt[];
	dealFields: IFields;
	dealFilters: IDealFilters;
	loading: boolean;
	loadingDealList: boolean;
	loadingDealFields: boolean;
	movingCard: boolean;
	errorMessage: string;
	dndDealItem: IDnDItem;
	cardBlocks: ICardBlock[];
}

export interface IMoveCardsData {
	entityId: number;
	stageId: number;
	reason_id: number | null;
	funnelHasChanged?: boolean;
}
