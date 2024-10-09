import { ICouchItemData, ICouchQueryResponse, ICreateCouchItemResponse } from '@uspacy/sdk/lib/models/couchdb';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IFilterPreset } from '@uspacy/sdk/lib/models/filter-preset';
import { IFilterTasks } from '@uspacy/sdk/lib/models/tasks';

export interface IState {
	isNewPreset: boolean;
	presets: ICouchQueryResponse<ICouchItemData<IFilterPreset<IFilterTasks>>>;
	preset: ICouchItemData<IFilterPreset<IFilterTasks>>;
	loadingPresets: boolean;
	loadingPreset: boolean;
	loadingCreatePreset: boolean;
	loadingUpdatePreset: boolean;
	loadingDeletePreset: boolean;
	errorLoadingPresets: IErrorsAxiosResponse;
	errorLoadingPreset: IErrorsAxiosResponse;
	errorLoadingCreatePreset: IErrorsAxiosResponse;
	errorLoadingUpdatePreset: IErrorsAxiosResponse;
	errorLoadingDeletePreset: IErrorsAxiosResponse;
}

export interface IBulkUpdateResponse {
	body: ICouchItemData<IFilterPreset<IFilterTasks>>[];
	res: ICreateCouchItemResponse[];
}
