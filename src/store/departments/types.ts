import { IDepartment } from '@uspacy/sdk/lib/models/department';

export interface IState {
	departments: IDepartment[];
	loadingDepartments: boolean;
	errorLoadingDepartments: string;
}
