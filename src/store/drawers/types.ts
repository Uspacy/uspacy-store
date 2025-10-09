import { ReactNode } from 'react';

export interface IDrawerNavItem {
	id: string;
	label: string;
	icon?: ReactNode;
	render: ReactNode | (() => ReactNode);
	disabled?: boolean;
	entityCode?: string;
	entityId?: string;
	service?: 'task' | 'crm' | 'messenger';
	mode?: 'view' | 'create' | 'edit';
}

export interface IState {
	open: boolean;
	activeId: string;
	drawers: IDrawerNavItem[];
}
