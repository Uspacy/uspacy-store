import { IEmailBox, IEmailBoxes, IEmailFilters, IEmailFiltersParams, IFolder, IFolders, ILetter, ILetters } from '@uspacy/sdk/lib/models/email';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IUpdateEmailBox } from '@uspacy/sdk/lib/services/EmailService/connect-email-box.dto';

export type createNewLetterModeType = 'window' | 'fullScreen' | 'fromLetter';
export interface IState {
	emailBoxes: IEmailBoxes;
	emailBox: IEmailBox;
	connectedEmailBox: IEmailBox;
	folders: IFolders;
	folder: IFolder;
	letters: ILetters;
	chainLetters: ILetters;
	letter: ILetter;
	createdLetter: ILetter;
	removedLetterIds: number[];
	loadingEmailBoxes: boolean;
	loadingEmailBox: boolean;
	loadingConnectEmailBox: boolean;
	loadingUpdateEmailCredentials: boolean;
	loadingUpdateEmailBox: boolean;
	loadingRemoveEmailBox: boolean;
	loadingFolders: boolean;
	loadingLetters: boolean;
	loadingChainLetters: boolean;
	loadingLetter: boolean;
	loadingCreatingLetter: boolean;
	loadingResendLetter: boolean;
	loadingDeletingLetter: boolean;
	loadingDeletingLetters: boolean;
	loadingIsReadStatus: boolean;
	loadingMoveLetter: boolean;
	errorLoadingEmailBoxes: IErrorsAxiosResponse;
	errorLoadingEmailBox: IErrorsAxiosResponse;
	errorLoadingConnectEmailBox: IErrorsAxiosResponse;
	errorLoadingUpdateEmailCredentials: IErrorsAxiosResponse;
	errorLoadingUpdateEmailBox: IErrorsAxiosResponse;
	errorLoadingRemoveEmailBox: IErrorsAxiosResponse;
	errorLoadingFolders: IErrorsAxiosResponse;
	errorLoadingLetters: IErrorsAxiosResponse;
	errorLoadingChainLetters: IErrorsAxiosResponse;
	errorLoadingLetter: IErrorsAxiosResponse;
	errorLoadingCreatingLetter: IErrorsAxiosResponse;
	errorLoadingResendLetter: IErrorsAxiosResponse;
	errorLoadingDeletingLetter: IErrorsAxiosResponse;
	errorLoadingDeletingLetters: IErrorsAxiosResponse;
	errorLoadingIsReadStatus: IErrorsAxiosResponse;
	errorLoadingMoveLetter: IErrorsAxiosResponse;
	openLetter: boolean;
	isCreateNewLetter: boolean;
	createNewLetterMode: createNewLetterModeType;
	filters: IEmailFilters;
	selectedLetters: number[];
	emailTableHeaderType: headerTypes;
}

export interface ILettersParams {
	id: number;
	params: IEmailFiltersParams;
	signal?: AbortSignal;
}

export interface IUpdateEmailBoxPayload {
	id: number;
	data: IUpdateEmailBox;
}

export interface IMoveLetterPayload {
	letterId?: number;
	ids?: number[];
	folderId: number;
}

export interface IEmailMassActionsResponse {
	ids: number[];
	folderId: number;
}

export type headerTypes = 'default' | 'massActions' | 'openedLetter' | 'createLetter';
