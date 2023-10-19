import { IDataPresence } from '@uspacy/sdk/lib/services/MigrationsService/dto/get-import-migrations-entities.dto';

export interface IState {
	companyInfo: IDataPresence;
	loadingCompanyInfo: boolean;
	errorCompanyInfo: boolean;
}
