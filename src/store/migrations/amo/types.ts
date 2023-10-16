import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IEntity } from '@uspacy/sdk/lib/models/migrations';
import { IMigrationData } from '@uspacy/sdk/lib/services/MigrationsService/dto/get-import-migrations-entities.dto';

export interface IState {
	amoEntities: IEntity;
	loadingAmo: boolean;
	errorLoadingAmo: IErrorsAxiosResponse;
	amoData: IMigrationData[];
}
