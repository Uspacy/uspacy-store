/* eslint-disable @typescript-eslint/no-explicit-any */
import { IReasons, IStages } from '@uspacy/sdk/lib/models/crm-stages';

export interface IState {
	stages: IStages;
	stage: IStage;
	errorMessage: string;
	loading: boolean;
	reasonsLoading: boolean;
	dealsColumns: any;
	reasons: IReasons;
}
