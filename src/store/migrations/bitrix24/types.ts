import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IEntity, IImportSystem } from '@uspacy/sdk/lib/models/migrations';
import { IMigrationData } from '@uspacy/sdk/lib/services/MigrationsService/dto/get-import-migrations-entities.dto';

export interface IState {
	bitrix24Entities: IEntity;
	bitrix24ImportEntities: IImportSystem;
	loadingBitrix24: boolean;
	errorLoadingBitrix24: IErrorsAxiosResponse;
	b24Data: IMigrationData[];
	loadingImportBitrix24: boolean;
	errorLoadingImportBitrix24: IErrorsAxiosResponse;
}

export interface IImportB24Props {
	webhook: string;
	data: IMigrationData[];
}
