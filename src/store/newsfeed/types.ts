import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { EmotionType, IPost } from '@uspacy/sdk/lib/models/newsfeed';
import { INotify } from '@uspacy/sdk/lib/models/notify';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';
import { FileInfoDto, RecipientsPost } from '@uspacy/sdk/lib/services/NewsFeedService/dto/cteate-update-posts.dto';

export interface IState {
	allPosts: IPost[];
	post: IPost;
	loadPosts: IResponseWithMeta<IPost>;
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

export interface ISendPost {
	title: string;
	message: string;
	file_ids?: number[];
	author_mood: EmotionType | '';
	recipients: RecipientsPost;
	group_id?: number;
	notify?: INotify;
}

export interface IEditPost {
	data: ISendPost;
	id: string;
}

export interface INewPost {
	placeholderInputTitle: string;
	labelInputTitle: string;
	isShowAddPost: boolean;
	valuePlaceholderEditor: string;
	titlePost?: string;
	whichMethod?: string;
	postId?: string;
	authorMood: EmotionType | '';
	fileIds: number[];
	recipients: RecipientsPost;
	group_id?: number;
	notify?: INotify;
}

export interface IEditPostItem {
	id: string;
	title: string;
	fileIds: number[];
	message: string;
	authorId: string;
	editStatus: boolean;
	author_mood: EmotionType | '';
	files: FileInfoDto[];
	date: number;
	recipients: RecipientsPost;
	notify?: INotify;
}
