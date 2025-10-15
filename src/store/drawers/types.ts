export interface IDrawerNavItem {
	id: string;
	title?: string;
	entityCode?: string;
	entityId?: string | number;
	service?: 'task' | 'crm' | 'messenger';
	mode?: 'view' | 'create' | 'edit';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	initialValue?: any;
}

export interface IState {
	open: boolean;
	activeId: string;
	drawers: IDrawerNavItem[];
}
