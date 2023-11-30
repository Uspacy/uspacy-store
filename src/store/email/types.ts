import { IEmailBox, IEmailBoxes, IFolder, IFolders, ILetter, ILetters } from '@uspacy/sdk/lib/models/email';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

export interface IState {
	emailBoxes: IEmailBoxes;
	emailBox: IEmailBox;
	connectedEmailBox: IEmailBox;
	folders: IFolders;
	folder: IFolder;
	letters: ILetters;
	letter: ILetter;
	loadingEmailBoxes: boolean;
	loadingConnectEmailBox: boolean;
	loadingRemoveEmailBox: boolean;
	loadingFolders: boolean;
	loadingLetters: boolean;
	loadingLetter: boolean;
	loadingCreatingLetter: boolean;
	loadingDeletingLetter: boolean;
	errorLoadingEmailBoxes: IErrorsAxiosResponse;
	errorLoadingConnectEmailBox: IErrorsAxiosResponse;
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
