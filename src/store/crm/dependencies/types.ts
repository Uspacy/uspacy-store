import { IDependenciesList } from '@uspacy/sdk/lib/models/dependencies-list';

export type DependenciesLists = {
	loading: boolean;
	loadingItem: boolean;
	errorMessage?: string;
} & { data: IDependenciesList[] };

export interface IState {
	[key: string]: DependenciesLists;
}
