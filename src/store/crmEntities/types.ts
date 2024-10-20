/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEntityData, IEntityMainData } from '@uspacy/sdk/lib/models/crm-entities';
import { IErrors } from '@uspacy/sdk/lib/models/crm-errors';
import { IFiltersPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { IFilter } from '@uspacy/sdk/lib/models/crm-filters';
import { IDnDItem } from '@uspacy/sdk/lib/models/crm-kanban';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

export interface IState {
	loading: boolean;
	entities: IResponseWithMeta<IEntityMainData>;
	entitiesWithFunnels: IResponseWithMeta<IEntityMainData>;
	entityFilters?: {
		[key: string]: IFilter;
	};
	entityFiltersPreset: IFiltersPreset;
	entityItemsColumns: any;
	errorMessage: IErrors;
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
