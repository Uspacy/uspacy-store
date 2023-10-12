import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IEditPostItem, INewPost, IPost } from '@uspacy/sdk/lib/models/newsfeed';
import { IResponseWithPagination } from '@uspacy/sdk/lib/models/response';

export interface IState {
	allPosts: IPost[];
	post: IPost;
	loadPosts: IResponseWithPagination<IPost>;
	newPost: INewPost;
	editPostItem: IEditPostItem;
	isNewPostCreate: boolean;
	loadPost: boolean;
	loadingPosts: boolean;
	loadingCreatePost: boolean;
	loadingEditPost: boolean;
	loadingDeletePost: boolean;
	errorLoadingPosts: IErrorsAxiosResponse;
	errorLoadingCreatedPost: IErrorsAxiosResponse;
	errorEditingPost: IErrorsAxiosResponse;
	errorDeletingPost: IErrorsAxiosResponse;
}
