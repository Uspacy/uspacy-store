import { IEntityAmount, IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { IErrors } from '@uspacy/sdk/lib/models/crm-errors';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

export interface EntityItems extends IResponseWithMeta<IEntityData> {
	loading: boolean;
	errorMessage?: IErrors;
	movingCard?: boolean;
	viewModalOpen?: boolean;
	createModalOpen?: boolean;
	completeModalOpen?: boolean;
	pendingNewItems?: IEntityData[];
	/** snapshots of optimistic stage moves, keyed by thunk requestId, used to roll back on reject */
	moveRollbacks?: Record<string, IMoveRollback>;
	stages?: {
		[key: string]: {
			loading: boolean;
			errorMessage?: IErrors;
			currencyAmount?: IEntityAmount;
			loadingCurrencyAmount?: boolean;
			errorCurrencyAmount?: IErrors;
		} & IResponseWithMeta<IEntityData>;
	};
	timePeriods?: {
		[key: string]: {
			loading: boolean;
			errorMessage?: IErrors;
		} & IResponseWithMeta<IEntityData>;
	};
}

export interface IState {
	[key: string]: EntityItems;
}

export interface IMoveCardsData {
	entityId: number;
	stageId: number;
	reason_id: number | null;
	funnelHasChanged?: boolean;
	entityCode: string;
	profileId: number;
	isFinishedStage?: boolean;
	sourceStageId?: number;
	destinationIndex?: number;
	item?: IEntityData;
	/** other fields sent in the same PATCH as the stage change (e.g. required fields of the stage) */
	fields?: Partial<IEntityData>;
	reason_comment?: string;
	/** item holds only kanban fields (live event without fetched entity): update/move existing cards, never insert it */
	partial?: boolean;
}

export interface IMoveRollback {
	entityId: number;
	targetStageKey: string;
	/** stage where the card was before the optimistic move (undefined if it was not loaded on the board) */
	sourceStageKey?: string;
	sourceIndex?: number;
	/** item as it was in the kanban column */
	stageItem?: IEntityData;
	/** item as it was in the list (table) data */
	listItem?: IEntityData;
	insertedIntoTarget: boolean;
}
