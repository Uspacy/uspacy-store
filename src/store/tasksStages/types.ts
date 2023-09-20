/* eslint-disable @typescript-eslint/no-explicit-any */
import { IColumns, IStages } from '@uspacy/sdk/lib/models/tasks-stages';

export interface IMoveTaskId {
	id: string;
}

export interface IDnDItem {
	fromColumnId: string;
	toColumnId: string;
	cardId: string;
	// using for other kanban
	item: any;
}

export interface IState {
	stages: IStages;
	columns: IColumns;
	moveTask: IMoveTaskId;
	dndItem: IDnDItem;
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
