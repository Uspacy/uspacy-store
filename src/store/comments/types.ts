import { IComment } from '@uspacy/sdk/lib/models/comment';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

export interface IComments {
	data: IComment[];
}

export interface IState {
	commentsList: IComment[];
	subCommentsList: IComment[];
	comments: IComments;
	loadingComments: boolean;
	errorLoadingComments: IErrorsAxiosResponse;
}
