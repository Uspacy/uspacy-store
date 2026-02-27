import { IFormField } from '@uspacy/sdk/lib/models/forms';
import { ICreateWidgetData } from '@uspacy/sdk/lib/models/messenger';
import { IMeta } from '@uspacy/sdk/lib/models/tasks';

export interface IState {
	widgetData: ICreateWidgetData;
	widgetsList: ICreateWidgetData[];
	meta: IMeta;
	loading: boolean;
	fields: IFormField[];
}
