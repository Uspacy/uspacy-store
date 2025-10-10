import { IEntityData } from '@uspacy/sdk/lib/models/crm-entities';

export interface IDrawerNavItem {
	id: string;
	title: string;
	entityCode?: string;
	entityId?: string;
	service?: 'task' | 'crm' | 'messenger';
	mode?: 'view' | 'create' | 'edit';
	initialValue?: IEntityData;
}

export interface IState {
	open: boolean;
	activeId: string;
	drawers: IDrawerNavItem[];
}
