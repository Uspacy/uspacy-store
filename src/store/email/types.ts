import { IEmailBox, IEmailBoxes, IEmailFilters, IFolder, IFolders, ILetter, ILetters } from '@uspacy/sdk/lib/models/email';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

export interface IState {
	emailBoxes: IEmailBoxes;
	emailBox: IEmailBox;
	connectedEmailBox: IEmailBox;
	folders: IFolders;
	folder: IFolder;
	letters: ILetters;
	letter: ILetter;
	filters: IEmailFilters;
	loadingEmailBoxes: boolean;
	loadingEmailBox: boolean;
	loadingConnectEmailBox: boolean;
	loadingUpdateEmailBox: boolean;
	loadingRemoveEmailBox: boolean;
	loadingFolders: boolean;
	loadingLetters: boolean;
	loadingLetter: boolean;
	loadingCreatingLetter: boolean;
	loadingDeletingLetter: boolean;
	errorLoadingEmailBoxes: IErrorsAxiosResponse;
	errorLoadingEmailBox: IErrorsAxiosResponse;
	errorLoadingConnectEmailBox: IErrorsAxiosResponse;
	errorLoadingUpdateEmailBox: IErrorsAxiosResponse;
	errorLoadingRemoveEmailBox: IErrorsAxiosResponse;
	errorLoadingFolders: IErrorsAxiosResponse;
	errorLoadingLetters: IErrorsAxiosResponse;
	errorLoadingLetter: IErrorsAxiosResponse;
	errorLoadingCreatingLetter: IErrorsAxiosResponse;
	errorLoadingDeletingLetter: IErrorsAxiosResponse;
	openLetter: boolean;
}

export interface ILettersParams {
	id: number;
	page: number;
	list: number;
}
