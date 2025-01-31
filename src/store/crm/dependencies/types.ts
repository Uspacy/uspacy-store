import { IDependenciesList } from '@uspacy/sdk/lib/models/dependencies-list';

export type DependenciesLists = {
	loading: boolean;
	errorMessage?: string;
} & { data: IDependenciesList[] };

export interface IState {
	[key: string]: DependenciesLists;
}
