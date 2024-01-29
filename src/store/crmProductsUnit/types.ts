import { IMeasurementUnit, IMeasurementUnits } from '@uspacy/sdk/lib/models/crm-products-unit';

export interface IState {
	productsUnits: IMeasurementUnits;
	productsUnit: IMeasurementUnit;
	errorMessage: string;
	loadingList: boolean;
	loading: boolean;
}
