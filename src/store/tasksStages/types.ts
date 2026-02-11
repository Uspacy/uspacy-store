/* eslint-disable @typescript-eslint/no-explicit-any */
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IStages } from '@uspacy/sdk/lib/models/tasks-stages';

export interface IMoveCard {
	fromColumnId: string;
	toColumnId: string;
	cardId: string;
	item: any;
	fromCard: boolean;
	isSameColumn: boolean;
	isComplete: boolean;
}

export interface IState {
	stages: IStages;
	allGroupsStages: IStages;
	dndItem: IMoveCard | null;
	loadingStages: boolean;
	addingStage: boolean;
	editingStage: boolean;
	deletingStage: boolean;
	loadingMoveTask: boolean;
	errorLoadingStages: IErrorsAxiosResponse;
	errorLoadingAllGroupsStages: IErrorsAxiosResponse;
	errorAddingStage: IErrorsAxiosResponse;
	errorEditingStage: IErrorsAxiosResponse;
	errorDeletingStage: IErrorsAxiosResponse;
	errorLoadingMoveTask: IErrorsAxiosResponse;
}
