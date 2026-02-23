import { ICreateWidgetData } from '@uspacy/sdk/lib/models/messenger';
import { IMeta } from '@uspacy/sdk/lib/models/tasks';

export interface IState {
	widgets: {
		data: ICreateWidgetData[];
		meta: IMeta;
		loading: boolean;
	};
}
