import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IEntity, IImportSystem } from '@uspacy/sdk/lib/models/migrations';
import { IMigrationData } from '@uspacy/sdk/lib/services/MigrationsService/dto/get-import-migrations-entities.dto';

export interface IState {
	systemEntities: IEntity;
	systemImportEntities: IImportSystem;
	loadingSystem: boolean;
	errorLoadingSystem: IErrorsAxiosResponse;
	systemData: IMigrationData[];
	loadingImportSystem: boolean;
	errorLoadingImportSystem: IErrorsAxiosResponse;
}
