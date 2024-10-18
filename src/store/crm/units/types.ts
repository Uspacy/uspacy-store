import { IMeasurementUnit } from '@uspacy/sdk/lib/models/crm-products-unit';

export interface EntityUnits {
	data: IMeasurementUnit[];
	errorMessage: string;
	loading: boolean;
}
export interface IState {
	[key: string]: EntityUnits;
}
