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
	stages?: {
		[key: string]: {
			loading: boolean;
			errorMessage?: IErrors;
		} & IResponseWithMeta<IEntityData>;
	};
	currencies?: {
		[key: string]: {
			currencyAmount?: IEntityAmount;
			loadingCurrencyAmount?: boolean;
			errorCurrencyAmount?: IErrors;
		};
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
}
