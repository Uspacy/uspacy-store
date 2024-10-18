import { IField } from '@uspacy/sdk/lib/models/field';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

export type EntityFields = {
	loading: boolean;
	errorMessage?: string;
} & IResponseWithMeta<IField>;

export interface IState {
	[key: string]: EntityFields;
}
