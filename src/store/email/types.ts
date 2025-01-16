import {
	ICrmSetting,
	IEmailBox,
	IEmailBoxes,
	IEmailFilters,
	IEmailFiltersParams,
	IFolder,
	IFolders,
	ILetter,
	ILetters,
	ILettersCrmEntities,
	ISignature,
	IThreads,
} from '@uspacy/sdk/lib/models/email';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';
import { IUpdateEmailBox } from '@uspacy/sdk/lib/services/EmailService/connect-email-box.dto';

export type createNewLetterModeType = 'window' | 'fullScreen' | 'fromLetter' | 'fromCRM';
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
	signatures: IResponseWithMeta<ISignature>;
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
	loadingOAuthRedirect: boolean;
	loadingSignatures: boolean;
	loadingCreateSignature: boolean;
	loadingUpdateSignature: boolean;
	loadingRemoveSignature: boolean;
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
	errorLoadingOAuthRedirect: IErrorsAxiosResponse;
	errorLoadingSignatures: IErrorsAxiosResponse;
	errorLoadingCreateSignature: IErrorsAxiosResponse;
	errorLoadingUpdateSignature: IErrorsAxiosResponse;
	errorLoadingRemoveSignature: IErrorsAxiosResponse;
	openLetter: boolean;
	isCreateNewLetter: boolean;
	createNewLetterMode: createNewLetterModeType;
	filters: IEmailFilters;
	selectedLetters: ILetter[];
	emailTableHeaderType: headerTypes;
	crmSettings: ICrmSetting[];
	crm_entities: {
		letterId: ILetter['id'];
		entities: ILettersCrmEntities;
	}[];
	oAuthUrl: string;
	oAuthCode: string;
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

export interface IEmailMassActionsResponse {
	letterId?: number;
	ids?: number[];
	list_ids?: number[];
	folderId?: number;
	threads: IThreads;
}

export type headerTypes = 'default' | 'massActions' | 'openedLetter' | 'createLetter';
