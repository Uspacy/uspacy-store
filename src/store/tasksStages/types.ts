/* eslint-disable @typescript-eslint/no-explicit-any */
import { IStages } from '@uspacy/sdk/lib/models/tasks-stages';

export interface IState {
	stages: IStages;
	loadingStages: boolean;
	addingStage: boolean;
	editingStage: boolean;
	deletingStage: boolean;
	loadingMoveTask: boolean;
	errorLoadingStages: string;
	errorAddingStage: string;
	errorEditingStage: string;
	errorDeletingStage: string;
	errorLoadingMoveTask: string;
}
