import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IFiles, IFilesSize } from '@uspacy/sdk/lib/models/files';

export interface IState {
	files: IFiles;
	filesSize: IFilesSize;
	loadingFiles: boolean;
	loadingFilesSize: boolean;
	errorLoadingFilesSize: IErrorsAxiosResponse;
	errorLoadingFiles: IErrorsAxiosResponse;
}
