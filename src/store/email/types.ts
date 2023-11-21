import { IFolder, IFolders, ILetter, ILetters } from '@uspacy/sdk/lib/models/email';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

export interface IState {
	folders: IFolders;
	folder: IFolder;
	letters: ILetters;
	letter: ILetter;
	loadingFolders: boolean;
	loadingLetters: boolean;
	loadingLetter: boolean;
	loadingCreatingLetter: boolean;
	loadingDeletingLetter: boolean;
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
