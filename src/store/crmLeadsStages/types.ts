import { IReasons, IStage, IStages } from '@uspacy/sdk/lib/models/crm-stages';

export interface IState {
	stages: IStages;
	stage: IStage;
	reasons: IReasons;
	errorMessage: string;
	loading: boolean;
	reasonsLoading: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	leadsColumns: any;
}
